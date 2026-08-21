import { downloadZip, predictLength } from 'client-zip';

// Export zip builder — runs entirely on Cloudflare's edge with an R2 binding,
// so media never passes through the Cloudways origin server. The Cloudways
// backend only sends the list of {key, name} R2 objects to include (it still
// owns the Mongo query / CSV row-building — that part is cheap and stays
// there); this Worker does the actual file fetch + zip streaming.
// Called from the admin dashboard in the browser (kandofromhome.com), which
// is a different origin than this worker.dev URL, so every response needs
// CORS headers — including the OPTIONS preflight the browser sends first
// because the request carries a custom header (X-Export-Secret).
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Export-Secret',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    const auth = request.headers.get('X-Export-Secret');
    if (!auth || auth !== env.EXPORT_SECRET) {
      return new Response('Unauthorized', { status: 401, headers: CORS_HEADERS });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON body', { status: 400, headers: CORS_HEADERS });
    }

    const { files, csvContent, filename, storeKey } = body || {};
    if (!Array.isArray(files) || typeof csvContent !== 'string') {
      return new Response('Expected { files: [{key,name}], csvContent }', { status: 400, headers: CORS_HEADERS });
    }

    const entries = [];

    // CSV first, so it's always present even if some media fetches fail.
    entries.push({
      name: 'users_summary.csv',
      input: csvContent,
    });

    for (const f of files) {
      if (!f?.key || !f?.name) continue;
      const obj = await env.BUCKET.get(f.key);
      if (!obj) continue; // skip missing objects rather than failing the whole export
      entries.push({ name: f.name, input: obj.body, size: obj.size });
    }

    // client-zip streams input->output with no re-compression (store method
    // internally uses no deflate by default), which is exactly right here
    // since the media files (jpg/mp4) are already compressed.
    const zipBody = downloadZip(entries).body;

    // Email-export path: the Cloudways backend (server-to-server, not the
    // browser) asks us to save the zip into R2 under `storeKey` instead of
    // streaming it back, so it can sign a download link and email it —
    // the zip itself never touches Cloudways either way.
    if (storeKey && typeof storeKey === 'string') {
      try {
        // R2's binding put() requires a stream of known length (it can't
        // buffer an arbitrary-size body itself), so wrap it in a
        // FixedLengthStream sized via client-zip's own length predictor —
        // exact because store-mode zip layout is fully deterministic from
        // just the entry names/sizes.
        const length = Number(predictLength(entries));
        const fixed = new FixedLengthStream(length);
        zipBody.pipeTo(fixed.writable);
        await env.BUCKET.put(storeKey, fixed.readable, { httpMetadata: { contentType: 'application/zip' } });
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err && err.stack || err) }), {
          status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ key: storeKey }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    return new Response(zipBody, {
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename || 'kando_export.zip'}"`,
      },
    });
  },
};

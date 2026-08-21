# kando-export Worker

Builds the CSV+media export zip directly from R2 (edge-side), so exports
don't route media bytes through the Cloudways origin server.

## Deploy

```
npm install
npx esbuild src/worker.js --bundle --format=esm --target=es2022 --outfile=dist/worker.js

cp metadata.example.json metadata.json
# edit metadata.json: set a real EXPORT_SECRET

curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/workers/scripts/kando-export" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -F "metadata=@metadata.json;type=application/json" \
  -F "worker.js=@dist/worker.js;type=application/javascript+module"
```

The Cloudways backend's `EXPORT_WORKER_SECRET` env var must match the
`EXPORT_SECRET` binding here.

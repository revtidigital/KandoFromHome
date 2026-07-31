import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SubmissionRecord } from '../context/AppContext';
import { 
  Shield, Search, Eye, History, LogOut, 
  Play, FileSpreadsheet, X 
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { 
    submissions, updateSubmissionStatus, auditLogs, 
    addAuditLog, setIsAdminLoggedIn, navigateTo 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'submissions' | 'audit'>('submissions');

  // Media Lightbox Modal State
  const [selectedMedia, setSelectedMedia] = useState<{
    type: 'image' | 'video';
    url: string;
    title: string;
  } | null>(null);

  // Filter logic
  const filteredSubmissions = submissions.filter(item => {
    const matchesSearch = 
      item.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.refId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCity = cityFilter === 'All' || item.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  // Handle Export to CSV
  const handleExportCSV = () => {
    const headers = ["Ref ID", "Employee ID", "Employee Name", "Email", "Phone", "City", "Family Members", "Status", "Submission Date", "CEO Reflection"];
    const rows = filteredSubmissions.map(item => [
      `"${item.refId}"`,
      `"${item.empId}"`,
      `"${item.empName}"`,
      `"${item.email}"`,
      `"${item.phone}"`,
      `"${item.city}"`,
      item.familyMembers,
      `"${item.status}"`,
      `"${item.submittedAt}"`,
      `"${item.ceoReflection.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Yamaha_Kando_Submissions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('CSV_EXPORT', `Exported ${filteredSubmissions.length} submission records to CSV file.`);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    addAuditLog('LOGOUT', 'Admin logged out.');
    navigateTo('home');
  };

  return (
    <div className="container" style={{ padding: '30px 20px', minHeight: '90vh' }}>
      
      {/* ADMIN HEADER BAR */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
        background: 'rgba(4, 14, 42, 0.9)',
        border: '1px solid rgba(0, 229, 255, 0.3)',
        borderRadius: '16px',
        padding: '20px 28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={24} color="#00E5FF" />
            <h1 className="heading-font" style={{ fontSize: '1.6rem', color: 'white' }}>
              Yamaha Day 2026 Admin Dashboard
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#A0B2D6', marginTop: '2px' }}>
            Yamaha Motor India Group — Campaign Media & Submission Review Portal
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={handleExportCSV}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.9rem', background: 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)' }}
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV ({filteredSubmissions.length})</span>
          </button>

          <button 
            onClick={handleLogout}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Metric 1 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#A0B2D6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            Total Submissions
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>
            {submissions.length} <span style={{ fontSize: '0.9rem', color: '#00E5FF', fontWeight: 600 }}>/ 5,000 Cap</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Target capacity: ~4,000–5,000</div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#A0B2D6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            Shortlisted Entries
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFD700' }}>
            {submissions.filter(s => s.status === 'Shortlisted' || s.status === 'Featured').length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Tagged by evaluation committee</div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#A0B2D6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            Cloudflare R2 Media Storage
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00E5FF' }}>
            768.4 GB <span style={{ fontSize: '0.85rem', color: '#A0B2D6' }}>/ 1 TB</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '8px' }}>
            <div style={{ width: '76%', height: '100%', background: 'linear-gradient(90deg, #00E5FF 0%, #0052CC 100%)', borderRadius: '3px' }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#A0B2D6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            Participating Locations
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#A855F7' }}>
            5 Cities
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Surajpur, Chennai, Gurgaon, Kanchipuram</div>
        </div>
      </div>

      {/* TABS & SEARCH BAR */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px' }}>
            <button 
              onClick={() => setActiveTab('submissions')}
              style={{
                background: activeTab === 'submissions' ? '#0052CC' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Submissions List ({submissions.length})
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              style={{
                background: activeTab === 'audit' ? '#0052CC' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <History size={14} />
              Audit Log ({auditLogs.length})
            </button>
          </div>

          {/* Filters */}
          {activeTab === 'submissions' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={16} color="#A0B2D6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search name, ID, city..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
                />
              </div>

              {/* Status Filter */}
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
                style={{ width: '140px', height: '38px', fontSize: '0.85rem', padding: '0 12px' }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Featured">Featured</option>
                <option value="Flagged">Flagged</option>
              </select>

              {/* City Filter */}
              <select 
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="form-select"
                style={{ width: '140px', height: '38px', fontSize: '0.85rem', padding: '0 12px' }}
              >
                <option value="All">All Cities</option>
                <option value="Surajpur">Surajpur</option>
                <option value="Chennai">Chennai</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Kanchipuram">Kanchipuram</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: SUBMISSIONS TABLE */}
        {activeTab === 'submissions' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', color: '#A0B2D6', height: '42px' }}>
                  <th style={{ padding: '12px' }}>Reference & Employee</th>
                  <th style={{ padding: '12px' }}>City / Plant</th>
                  <th style={{ padding: '12px' }}>Media Files (Video + 2 Photos)</th>
                  <th style={{ padding: '12px' }}>CEO Reflection Snippet</th>
                  <th style={{ padding: '12px' }}>Status Tag</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.2s' }}>
                    
                    {/* Employee Info */}
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 700, color: 'white' }}>{row.empName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#00E5FF', fontFamily: 'monospace' }}>{row.empId} • {row.refId}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{row.email}</div>
                    </td>

                    {/* City */}
                    <td style={{ padding: '14px 12px', color: '#E2E8F0' }}>
                      <div>{row.city}</div>
                      <div style={{ fontSize: '0.75rem', color: '#A0B2D6' }}>{row.familyMembers} Family Members</div>
                    </td>

                    {/* Media Preview Thumbnails */}
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Video Thumb */}
                        <div 
                          onClick={() => setSelectedMedia({ type: 'video', url: row.videoUrl, title: `Video - ${row.empName}` })}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            background: 'rgba(0, 229, 255, 0.2)',
                            border: '1px solid #00E5FF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Play size={18} color="#00E5FF" />
                        </div>

                        {/* Photo 1 Thumb */}
                        <img 
                          src={row.photo1Url} 
                          alt="Photo 1"
                          onClick={() => setSelectedMedia({ type: 'image', url: row.photo1Url, title: `Photo 1 - ${row.empName}` })}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid rgba(255,255,255,0.3)',
                            cursor: 'pointer'
                          }}
                        />

                        {/* Photo 2 Thumb */}
                        <img 
                          src={row.photo2Url} 
                          alt="Photo 2"
                          onClick={() => setSelectedMedia({ type: 'image', url: row.photo2Url, title: `Photo 2 - ${row.empName}` })}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid rgba(255,255,255,0.3)',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    </td>

                    {/* Reflection */}
                    <td style={{ padding: '14px 12px', color: '#CBD5E1', maxWidth: '280px', fontSize: '0.85rem' }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontStyle: 'italic'
                      }}>
                        "{row.ceoReflection}"
                      </div>
                    </td>

                    {/* Status Tag Selector */}
                    <td style={{ padding: '14px 12px' }}>
                      <select
                        value={row.status}
                        onChange={(e) => updateSubmissionStatus(row.id, e.target.value as SubmissionRecord['status'])}
                        style={{
                          background: 
                            row.status === 'Shortlisted' ? 'rgba(255, 215, 0, 0.2)' :
                            row.status === 'Featured' ? 'rgba(0, 229, 255, 0.2)' :
                            row.status === 'Flagged' ? 'rgba(230, 0, 18, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          color: 
                            row.status === 'Shortlisted' ? '#FFD700' :
                            row.status === 'Featured' ? '#00E5FF' :
                            row.status === 'Flagged' ? '#FF4D4D' : '#A0B2D6',
                          border: '1px solid rgba(255,255,255,0.2)',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="Pending" style={{ background: '#06133B', color: 'white' }}>Pending</option>
                        <option value="Shortlisted" style={{ background: '#06133B', color: '#FFD700' }}>Shortlisted ⭐</option>
                        <option value="Featured" style={{ background: '#06133B', color: '#00E5FF' }}>Featured 🌟</option>
                        <option value="Flagged" style={{ background: '#06133B', color: '#FF4D4D' }}>Flagged 🚩</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 12px' }}>
                      <button 
                        onClick={() => setSelectedMedia({ type: 'image', url: row.photo1Url, title: `${row.empName} - Details` })}
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: AUDIT LOG */}
        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {auditLogs.map((log) => (
              <div key={log.id} style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '14px 18px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>{log.action}: {log.details}</div>
                  <div style={{ fontSize: '0.75rem', color: '#A0B2D6' }}>By {log.adminUser}</div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#00E5FF', fontFamily: 'monospace' }}>
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MEDIA LIGHTBOX MODAL */}
      {selectedMedia && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '800px',
            width: '100%',
            padding: '24px',
            position: 'relative',
            background: '#040F2E',
            border: '1px solid #00E5FF'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem' }}>{selectedMedia.title}</h3>
              <button onClick={() => setSelectedMedia(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {selectedMedia.type === 'video' ? (
              <video src={selectedMedia.url} controls autoPlay style={{ width: '100%', maxHeight: '480px', borderRadius: '12px' }} />
            ) : (
              <img src={selectedMedia.url} alt="Lightbox Preview" style={{ width: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '12px' }} />
            )}
          </div>
        </div>
      )}

    </div>
  );
};

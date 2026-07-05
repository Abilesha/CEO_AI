import { useState } from 'react'
import './Reports.css'

interface Report {
  id: string
  name: string
  date: string
  size: string
  type: string
  status: 'generated' | 'processing' | 'failed'
}

const INITIAL_REPORTS: Report[] = [
  { id: '1', name: 'Q2 Executive Summary & Growth Forecast', date: '2026-07-02', size: '2.4 MB', type: 'PDF', status: 'generated' },
  { id: '2', name: 'APAC Market Logistics Disruption Report', date: '2026-07-04', size: '1.8 MB', type: 'PDF', status: 'generated' },
  { id: '3', name: 'Global Token Cost Optimizer Audit', date: '2026-07-04', size: '--', type: 'PDF', status: 'processing' },
  { id: '4', name: 'Q1 HR Sprint Velocity Analytics', date: '2026-04-12', size: '4.1 MB', type: 'CSV', status: 'generated' },
  { id: '5', name: 'Competitor Multi-agent Swarm Analysis', date: '2026-06-28', size: '--', type: 'PDF', status: 'failed' },
]

/* Simulate a real CSV/PDF download as a Blob */
function downloadReport(report: Report) {
  const content =
    report.type === 'CSV'
      ? `Report Name,Date,Size,Status\n"${report.name}","${report.date}","${report.size}","${report.status}"\n`
      : `%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%% CEO AI Report: ${report.name}\n%% Generated: ${report.date}\n`
  const mime = report.type === 'CSV' ? 'text/csv' : 'application/pdf'
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${report.name.replace(/[^a-z0-9]/gi, '_')}.${report.type.toLowerCase()}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS)
  const [filter, setFilter] = useState<'all' | 'generated' | 'processing' | 'failed'>('all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [newReportName, setNewReportName] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReportName.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        name: newReportName,
        date: new Date().toISOString().split('T')[0],
        size: '1.2 MB',
        type: 'PDF',
        status: 'generated',
      }
      setReports((prev) => [newReport, ...prev])
      setNewReportName('')
      setIsGenerating(false)
    }, 2000)
  }

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
    setDeleteConfirmId(null)
  }

  const handleDownload = (report: Report) => {
    setDownloadingId(report.id)
    setTimeout(() => {
      downloadReport(report)
      setDownloadingId(null)
    }, 800)
  }

  const filteredReports = reports.filter((r) => filter === 'all' || r.status === filter)

  return (
    <div className="reports animate-fade-in">
      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="delete-modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="delete-modal glass animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-icon">🗑️</div>
            <h3>Delete Report?</h3>
            <p>This action cannot be undone. The report will be permanently removed from the archive.</p>
            <div className="delete-modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirmId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Topbar */}
      <div className="reports-topbar">
        <div className="reports-filters">
          {(['all', 'generated', 'processing', 'failed'] as const).map((opt) => (
            <button
              key={opt}
              className={`filter-btn ${filter === opt ? 'active' : ''}`}
              onClick={() => setFilter(opt)}
            >
              {opt.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="reports-count-badge">
          {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'}
        </div>
      </div>

      <div className="reports-layout">
        {/* Reports log list */}
        <div className="reports-log-card glass">
          <h3 className="panel-title">Document Archive</h3>
          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report Title</th>
                  <th>Date</th>
                  <th>Size</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty-table-row">No reports found.</td>
                  </tr>
                )}
                {filteredReports.map((report) => (
                  <tr key={report.id} className="report-row">
                    <td>
                      <div className="report-name-col">
                        <span className="report-icon-cube">▤</span>
                        <span className="report-name-text">{report.name}</span>
                      </div>
                    </td>
                    <td>{report.date}</td>
                    <td>{report.size}</td>
                    <td><span className="file-type-badge">{report.type}</span></td>
                    <td>
                      <span className={`badge badge-${
                        report.status === 'generated'
                          ? 'success'
                          : report.status === 'processing'
                          ? 'warning'
                          : 'danger'
                      }`}>
                        {report.status === 'processing' && <span className="processing-dot" />}
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-cell">
                        {report.status === 'generated' ? (
                          <button
                            className={`btn-download ${downloadingId === report.id ? 'downloading' : ''}`}
                            title="Download Report"
                            onClick={() => handleDownload(report)}
                            disabled={downloadingId === report.id}
                          >
                            {downloadingId === report.id ? (
                              <><span className="dl-spinner" /> Downloading...</>
                            ) : (
                              <>↓ Download</>
                            )}
                          </button>
                        ) : (
                          <span className="action-disabled">--</span>
                        )}
                        <button
                          className="btn-delete"
                          title="Delete Report"
                          onClick={() => setDeleteConfirmId(report.id)}
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Generate Report Form */}
        <div className="reports-generator glass">
          <h3 className="panel-title">Generate Custom Report</h3>
          <form className="generator-form" onSubmit={handleGenerateReport}>
            <div className="form-group">
              <label>Report Name</label>
              <input
                type="text"
                placeholder="e.g. Sales Competitor Audit Q3"
                value={newReportName}
                onChange={(e) => setNewReportName(e.target.value)}
                disabled={isGenerating}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Model Configuration Profile</label>
              <select className="form-select" disabled={isGenerating}>
                <option>Multi-Agent Synthesis (Deep Reasoning)</option>
                <option>Fast Heuristics & Operations Summary</option>
                <option>Supabase DB Schema Analyzer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data Window</label>
              <select className="form-select" disabled={isGenerating}>
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-submit-gen"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <><span className="dl-spinner" /> Queuing Swarm...</>
              ) : (
                '✦ Generate Swarm Report'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage

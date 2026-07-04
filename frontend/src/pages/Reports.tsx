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

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS)
  const [filter, setFilter] = useState<'all' | 'generated' | 'processing' | 'failed'>('all')
  const [isGenerating, setIsGenerating] = useState(false)
  const [newReportName, setNewReportName] = useState('')

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReportName.trim()) return

    setIsGenerating(true)

    // Simulate generation queue delay
    setTimeout(() => {
      const newReport: Report = {
        id: (reports.length + 1).toString(),
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

  const filteredReports = reports.filter((r) => filter === 'all' || r.status === filter)

  return (
    <div className="reports animate-fade-in">
      {/* Search & Actions Header */}
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
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
                        {report.status}
                      </span>
                    </td>
                    <td>
                      {report.status === 'generated' ? (
                        <button className="btn-download" title="Download Report">
                          ↓ Download
                        </button>
                      ) : (
                        <span className="action-disabled">--</span>
                      )}
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
              {isGenerating ? 'Queuing Swarm...' : '✦ Generate Swarm Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage

import { useState, useEffect } from 'react'
import api from '@services/api'
import './engine-forms.css'
import './Schedule.css'

interface ScheduleJob {
  id: number
  task: string
  icon: string
  time: string
  freq: string
  channel: string
  status: 'active' | 'paused'
}

interface LogEntry {
  timestamp: string
  engine: string
  message: string
  type: 'info' | 'success' | 'warning'
}

export function SchedulePage() {
  const [task, setTask]       = useState('Run Market Research')
  const [time, setTime]       = useState('09:00')
  const [freq, setFreq]       = useState('Daily')
  const [channel, setChannel] = useState('WhatsApp')
  const [toastMessage, setToastMessage] = useState('')
  const [jobs, setJobs] = useState<ScheduleJob[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])

  const fetchScheduleData = async () => {
    try {
      const response = await api.get<{ jobs: ScheduleJob[]; logs: LogEntry[] }>('/schedule')
      if (response.data) {
        setJobs(response.data.jobs)
        setLogs(response.data.logs)
      }
    } catch (err) {
      console.error('Failed to load schedule data', err)
    }
  }

  useEffect(() => {
    fetchScheduleData()
  }, [])

  const getTaskIcon = (t: string) => {
    if (t.includes('Research')) return '🧭'
    if (t.includes('Marketing')) return '📣'
    if (t.includes('Lead')) return '⚡'
    if (t.includes('Objection')) return '💹'
    return '📊'
  }

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    const formattedTime = new Date(`2000-01-01T${time}:00`)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    try {
      const response = await api.post<ScheduleJob>('/schedule', {
        task,
        icon: getTaskIcon(task),
        time: formattedTime,
        freq,
        channel,
      })

      if (response.data) {
        setJobs((prev) => [...prev, response.data!])
        setToastMessage(`Successfully scheduled: ${task}`)
        setTimeout(() => setToastMessage(''), 3000)
      }
    } catch (err) {
      console.error('Failed to schedule job', err)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete(`/schedule/${id}`)
      if (response.status === 200 || !response.error) {
        setJobs(jobs.filter(j => j.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete scheduled job', err)
    }
  }

  const toggleStatus = async (id: number) => {
    try {
      const response = await api.patch<ScheduleJob>(`/schedule/${id}/toggle`, {})
      if (response.data) {
        setJobs(jobs.map(j => j.id === id ? { ...j, status: response.data!.status } : j))
      }
    } catch (err) {
      console.error('Failed to toggle status', err)
    }
  }

  return (
    <div
      className="engine-page animate-fade-in"
      style={{
        '--eng-accent': 'linear-gradient(90deg, #8b5cf6, #06b6d4)',
        '--eng-glow': 'rgba(139, 92, 246, 0.15)',
        '--eng-focus-color': '#a78bfa',
        '--eng-focus-ring': 'rgba(139, 92, 246, 0.2)',
        '--eng-btn-bg': 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
        '--eng-btn-shadow': 'rgba(139, 92, 246, 0.45)',
        '--eng-chip-bg': 'rgba(139, 92, 246, 0.12)',
        '--eng-chip-color': '#a78bfa',
        '--eng-chip-border': 'rgba(139, 92, 246, 0.3)',
      } as React.CSSProperties}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="sched-toast glass animate-fade-in">
          <span>🔔 {toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="engine-page-header">
        <h2 className="engine-page-title">📅 Schedule &amp; Automations</h2>
        <p className="engine-page-subtitle">
          Setup automated routines for strategy updates, marketing drips, lead processing, and audit scans.
        </p>
      </div>

      <div className="sched-layout">

        {/* ---- Left: Builder Panel ---- */}
        <div className="engine-form-panel sched-panel-left">
          <span className="engine-form-panel-title">Create Schedule</span>
          <form onSubmit={handleAddSchedule}>
            <div className="eng-field">
              <label className="eng-label">
                <span className="eng-label-icon">🤖</span>
                Select Agent Action
              </label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={task} onChange={e => setTask(e.target.value)}>
                  <option value="Run Market Research">Run Market Research (Strategy)</option>
                  <option value="Model Marketing Spend">Model Marketing Spend (Marketing)</option>
                  <option value="Run Lead Gen Outbound Drip">Run Lead Gen Outbound Drip (Lead Gen)</option>
                  <option value="Synthesize Objection Playbook">Synthesize Objection Playbook (Sales)</option>
                  <option value="Audit Safety Stock Levels">Audit Safety Stock Levels (Analytics)</option>
                </select>
              </div>
            </div>

            <div className="sched-row-2">
              <div className="eng-field">
                <label className="eng-label">
                  <span className="eng-label-icon">⏰</span>
                  Time
                </label>
                <input
                  type="time"
                  className="eng-input"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </div>

              <div className="eng-field">
                <label className="eng-label">
                  <span className="eng-label-icon">🔁</span>
                  Frequency
                </label>
                <div className="eng-select-wrapper">
                  <select className="eng-select" value={freq} onChange={e => setFreq(e.target.value)}>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="eng-field">
              <label className="eng-label">
                <span className="eng-label-icon">📡</span>
                Dispatch Notification Channel
              </label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={channel} onChange={e => setChannel(e.target.value)}>
                  <option value="Dashboard">Dashboard Notification</option>
                  <option value="Email">Email Digest</option>
                  <option value="WhatsApp">WhatsApp Alert</option>
                  <option value="Slack">Slack Webhook</option>
                </select>
              </div>
            </div>

            <button type="submit" className="eng-cta-btn">
              <span className="eng-cta-btn-inner">✦ Add Scheduled Job</span>
            </button>
          </form>
        </div>

        {/* ---- Right: List & Logs ---- */}
        <div className="sched-panel-right">
          {/* Active Jobs */}
          <div className="engine-output-panel sched-jobs-card">
            <div className="engine-output-title">📋 Active Automation Routines</div>
            <div className="sched-jobs-list">
              {jobs.length === 0 ? (
                <div className="sched-empty">No active automated jobs.</div>
              ) : (
                jobs.map(job => (
                  <div key={job.id} className={`sched-job-item glass ${job.status === 'paused' ? 'paused' : ''}`}>
                    <div className="job-info">
                      <span className="job-icon">{job.icon}</span>
                      <div className="job-meta">
                        <span className="job-task">{job.task}</span>
                        <span className="job-sub">
                          ⏰ {job.time} ({job.freq}) • 📡 {job.channel}
                        </span>
                      </div>
                    </div>
                    <div className="job-actions">
                      <button
                        className={`btn-pause-job ${job.status === 'paused' ? 'resume' : ''}`}
                        onClick={() => toggleStatus(job.id)}
                      >
                        {job.status === 'paused' ? '▶ Resume' : '⏸ Pause'}
                      </button>
                      <button className="btn-delete-job" onClick={() => handleDelete(job.id)}>
                        🗑
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System logs */}
          <div className="engine-output-panel sched-logs-card">
            <div className="engine-output-title">📰 Automation Execution Logs</div>
            <div className="sched-logs-list">
              {logs.map((log, i) => (
                <div key={i} className="sched-log-row">
                  <span className="log-time">[{log.timestamp}]</span>
                  <span className={`log-badge badge-${log.type}`}>{log.engine}</span>
                  <span className="log-msg">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SchedulePage

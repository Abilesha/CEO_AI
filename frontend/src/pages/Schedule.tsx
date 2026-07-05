import { useState } from 'react'
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

  const [jobs, setJobs] = useState<ScheduleJob[]>([
    { id: 1, task: 'Run Market Research', icon: '🧭', time: '09:30 AM', freq: 'Daily', channel: 'Dashboard', status: 'active' },
    { id: 2, task: 'Model Marketing Spend', icon: '📣', time: '11:00 AM', freq: 'Weekly', channel: 'Email', status: 'active' },
    { id: 3, task: 'Run Lead Gen Outbound Drip', icon: '⚡', time: '03:00 PM', freq: 'Daily', channel: 'WhatsApp', status: 'active' },
  ])

  const [logs] = useState<LogEntry[]>([
    { timestamp: '09:30:02 AM', engine: 'Strategy Engine', message: 'Autonomous market scan completed. Updated positioning model for B2B SaaS.', type: 'success' },
    { timestamp: '09:30:15 AM', engine: 'Strategy Engine', message: 'Report compiled and sent to executive briefing feed.', type: 'info' },
    { timestamp: '11:00:01 AM', engine: 'Marketing Engine', message: 'Marketing campaign run initiated for regional segment.', type: 'info' },
    { timestamp: '11:00:24 AM', engine: 'Marketing Engine', message: 'Budget allocation updated: +12% focus on Instagram Reels.', type: 'success' },
    { timestamp: '03:00:02 PM', engine: 'Lead Gen Engine', message: 'WhatsApp campaign drip triggered: 14 outbound triggers dispatched.', type: 'success' },
    { timestamp: '03:00:10 PM', engine: 'Lead Gen Engine', message: 'Interakt API returned 100% dispatch delivery confirmation.', type: 'info' },
  ])

  const getTaskIcon = (t: string) => {
    if (t.includes('Research')) return '🧭'
    if (t.includes('Marketing')) return '📣'
    if (t.includes('Lead')) return '⚡'
    if (t.includes('Objection')) return '💹'
    return '📊'
  }

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    const formattedTime = new Date(`2000-01-01T${time}:00`)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    
    const newJob: ScheduleJob = {
      id: Date.now(),
      task,
      icon: getTaskIcon(task),
      time: formattedTime,
      freq,
      channel,
      status: 'active',
    }

    setJobs([...jobs, newJob])
    setToastMessage(`Successfully scheduled: ${task}`)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleDelete = (id: number) => {
    setJobs(jobs.filter(j => j.id !== id))
  }

  const toggleStatus = (id: number) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: j.status === 'active' ? 'paused' : 'active' } : j))
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
          Configure autonomous AI sweeps, periodic model audits, and report synthesis runs
          targeting multiple outreach channels.
        </p>
      </div>

      <div className="engine-grid schedule-grid-container">

        {/* ---- Form Panel ---- */}
        <div className="engine-form-panel">
          <span className="engine-form-panel-title">Schedule AI Job / Audit</span>

          <form onSubmit={handleAddSchedule} className="drawer-form">
            <div className="eng-field">
              <label className="eng-label">
                <span className="eng-label-icon">🤖</span>
                AI Task / Engine Trigger
              </label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={task} onChange={e => setTask(e.target.value)}>
                  <option value="Run Market Research">🧭 Run Market Research</option>
                  <option value="Model Marketing Spend">📣 Model Marketing Spend</option>
                  <option value="Run Lead Gen Outbound Drip">⚡ Run Lead Gen Outbound Drip</option>
                  <option value="Synthesize Objection Playbook">💹 Synthesize Objection Playbook</option>
                  <option value="Compute Revenue Forecasts">📊 Compute Revenue Forecasts</option>
                </select>
              </div>
            </div>

            <div className="form-group-row">
              <div className="eng-field flex-1">
                <label className="eng-label">
                  <span className="eng-label-icon">⏰</span>
                  Time
                </label>
                <input
                  type="time"
                  className="eng-input"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                />
              </div>

              <div className="eng-field flex-1">
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
                Output Destination Channel
              </label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={channel} onChange={e => setChannel(e.target.value)}>
                  <option value="WhatsApp">WhatsApp Notification</option>
                  <option value="Email">Email Digest</option>
                  <option value="Dashboard">Dashboard Feed Only</option>
                </select>
              </div>
              <div className="eng-chip-row">
                <span className="eng-chip">⏰ {freq} at {time}</span>
                <span className="eng-chip">📡 {channel} Destination</span>
              </div>
            </div>

            <button type="submit" className="eng-cta-btn">
              <span className="eng-cta-btn-inner">+ Schedule Automation</span>
            </button>
          </form>
        </div>

        {/* ---- Output Queue Panel ---- */}
        <div className="engine-output-panel">
          <div className="engine-output-title">
            📅 Active Auto-Pilot Schedules
          </div>

          <div className="engine-result-stack">
            {jobs.map(job => (
              <div key={job.id} className="schedule-card-full glass">
                <div className="sched-card-info">
                  <div className="sched-card-title-row">
                    <span className="sched-card-icon">{job.icon}</span>
                    <span className="sched-card-title">{job.task}</span>
                  </div>
                  <div className="sched-card-badges">
                    <span className="sched-badge">⏰ {job.time}</span>
                    <span className="sched-badge">🔁 {job.freq}</span>
                    <span className="sched-badge">📡 {job.channel}</span>
                  </div>
                </div>
                <div className="sched-card-actions">
                  <button 
                    className={`sched-status-toggle ${job.status}`}
                    onClick={() => toggleStatus(job.id)}
                    title={job.status === 'active' ? 'Pause Automation' : 'Resume Automation'}
                  >
                    {job.status === 'active' ? '⏸' : '▶'}
                  </button>
                  <button 
                    className="sched-delete"
                    onClick={() => handleDelete(job.id)}
                    title="Remove Schedule"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Console logs */}
          <div className="console-panel glass">
            <div className="console-header">
              <span>🖥️ System Automation Console Log</span>
              <span className="console-blink" />
            </div>
            <div className="console-body">
              {logs.map((log, i) => (
                <div key={i} className={`console-row ${log.type}`}>
                  <span className="console-time">[{log.timestamp}]</span>
                  <span className="console-engine">[{log.engine}]</span>
                  <span className="console-msg">{log.message}</span>
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

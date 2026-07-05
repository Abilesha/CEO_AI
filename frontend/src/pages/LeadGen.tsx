import { useState } from 'react'
import api from '@services/api'
import './engine-forms.css'
import './LeadGen.css'

const SEGMENTS = ['Enterprise Tech', 'Retail Electronics', 'SaaS Startups']

const CHANNELS = [
  { value: 'WhatsApp Campaign',    label: '💬 WhatsApp Campaign',  chip: '#25D366' },
  { value: 'Cold Email Sequence',  label: '📧 Cold Email Sequence', chip: '#60a5fa' },
  { value: 'LinkedIn InMail Drip', label: '🔗 LinkedIn InMail Drip',chip: '#0ea5e9' },
  { value: 'Physical Marketing',   label: '📍 Physical Marketing',  chip: '#f97316' },
]

/* ---- Dynamic Chart Component ---- */
function FunnelChart({ chart }: { chart: any }) {
  if (!chart || !chart.datasets?.[0]) return null
  const dataset = chart.datasets[0]
  const maxValue = Math.max(...dataset.data, 100)

  return (
    <div className="custom-chart bar-chart-container glass animate-fade-in" style={{ marginTop: '1.5rem', width: '100%', maxWidth: 'none' }}>
      <h4 className="chart-title" style={{ fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
        {chart.title}
      </h4>
      <div className="bar-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {chart.labels.map((label: string, idx: number) => {
          const val = dataset.data[idx] || 0
          const pct = Math.min((val / maxValue) * 100, 100)
          return (
            <div key={idx} className="bar-row" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="bar-label" style={{ width: '140px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {label}
              </span>
              <div className="bar-track-wrapper" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', overflow: 'hidden', position: 'relative', height: '20px' }}>
                <div
                  className="bar-fill animate-grow-width"
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: dataset.color || '#fbbf24',
                    boxShadow: `0 0 10px ${dataset.color}44`,
                  }}
                />
                <span className="bar-value" style={{ fontSize: '10px', color: 'var(--color-text-primary)', position: 'absolute', right: '6px', fontWeight: 500 }}>
                  {val} leads
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function LeadGenPage() {
  const [segment, setSegment]   = useState('Enterprise Tech')
  const [channel, setChannel]   = useState('WhatsApp Campaign')
  const [goal, setGoal]         = useState('Book Demo Meetings')
  const [isSimulating, setIsSimulating] = useState(false)
  
  const [leads, setLeads] = useState<any[]>([])
  const [output, setOutput] = useState<any>({
    digital: 'Suggested Digital SEO strategy targeting electronics distributors and retail components shops.',
    whatsapp: 'Hi [Name], we mapped out a demo booking projection report specifically for your business operations. Can I send over the 3-line breakdown?',
    physical: '📍 VIP invitations & hardware samples sent to target procurement leaders.',
    chart: null,
    path: '',
  })

  const chipColor = CHANNELS.find(p => p.value === channel)?.chip ?? '#fbbf24'

  const handleSimulate = async () => {
    setIsSimulating(true)
    try {
      const response = await api.post<{
        leads: any[]
        digital_strategy: string
        whatsapp_campaign: string
        physical_ideas: string
        chart_data: any
        langgraph_path: string
      }>('/leadgen', {
        segment,
        channel,
        goal,
      })

      if (response.data) {
        setLeads(response.data.leads)
        setOutput({
          digital: response.data.digital_strategy,
          whatsapp: response.data.whatsapp_campaign,
          physical: response.data.physical_ideas,
          chart: response.data.chart_data,
          path: response.data.langgraph_path,
        })
      }
    } catch (err) {
      console.error('Failed to run lead gen agent', err)
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div
      className="engine-page animate-fade-in"
      style={{
        '--eng-accent': 'linear-gradient(90deg, #fbbf24, #f97316)',
        '--eng-glow': 'rgba(251, 191, 36, 0.15)',
        '--eng-focus-color': '#fbbf24',
        '--eng-focus-ring': 'rgba(251, 191, 36, 0.2)',
        '--eng-btn-bg': 'linear-gradient(135deg, #f59e0b, #ea580c)',
        '--eng-btn-shadow': 'rgba(245, 158, 11, 0.4)',
        '--eng-chip-bg': 'rgba(251, 191, 36, 0.12)',
        '--eng-chip-color': '#fbbf24',
        '--eng-chip-border': 'rgba(251, 191, 36, 0.25)',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="engine-page-header">
        <h2 className="engine-page-title">⚡ Lead Gen Engine</h2>
        <p className="engine-page-subtitle">
          Brings in leads and helps to convert those leads effectively with AI strategy agents.
        </p>
      </div>

      {/* Grid */}
      <div className="engine-grid">

        {/* ---- Form Panel ---- */}
        <div className="engine-form-panel">
          <span className="engine-form-panel-title">Campaign Parameters</span>

          {/* Segment Selection */}
          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">🎯</span>
              Target Segment
            </label>
            <div className="eng-select-wrapper">
              <select
                className="eng-select"
                value={segment}
                onChange={e => setSegment(e.target.value)}
              >
                {SEGMENTS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Platform */}
          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">📡</span>
              Outreach Channel
            </label>
            <div className="eng-select-wrapper">
              <select
                className="eng-select"
                value={channel}
                onChange={e => setChannel(e.target.value)}
              >
                {CHANNELS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="eng-chip-row">
              <span className="eng-chip" style={{
                background: `${chipColor}18`,
                color: chipColor,
                borderColor: `${chipColor}40`,
              }}>
                ✓ {channel}
              </span>
            </div>
          </div>

          {/* Goal */}
          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">🏆</span>
              Outreach Goal / CTA
            </label>
            <input
              type="text"
              className="eng-input"
              placeholder="e.g. Book Demo Meetings"
              value={goal}
              onChange={e => setGoal(e.target.value)}
            />
          </div>

          <button
            className={`eng-cta-btn${isSimulating ? ' loading' : ''}`}
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            <span className="eng-cta-btn-inner">
              {isSimulating ? '⬡ Querying Database & Synthesizing Plan...' : '⚡ Run Lead Gen AI Agent'}
            </span>
          </button>
        </div>

        {/* ---- Output Panel ---- */}
        <div className="engine-output-panel">
          <div className="engine-output-title">
            ⚡ Lead Acquisition &amp; Campaign Plan
          </div>

          {isSimulating ? (
            <div className="engine-loading">
              <div className="engine-loading-orb">⚡</div>
              <span className="engine-loading-text">Consulting database and drafting templates…</span>
            </div>
          ) : (
            <div className="engine-result-stack">
              {output.path && (
                <div className="engine-result-card" style={{ background: 'rgba(251, 191, 36, 0.04)', borderColor: 'rgba(251, 191, 36, 0.15)' }}>
                  <span className="engine-result-label">🤖 LangGraph Agent Path</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {output.path.split(' ➔ ').map((node: string, nIdx: number, arr: string[]) => (
                      <span key={nIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-accent" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                          {node}
                        </span>
                        {nIdx < arr.length - 1 && <span style={{ color: 'var(--color-text-muted)' }}>➔</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {leads.length > 0 && (
                <div className="engine-result-card">
                  <span className="engine-result-label">👥 Database Leads Retrieved</span>
                  <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                          <th style={{ padding: '0.5rem' }}>Company</th>
                          <th style={{ padding: '0.5rem' }}>Email / Contact</th>
                          <th style={{ padding: '0.5rem' }}>Interest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--color-text-primary)' }}>
                            <td style={{ padding: '0.5rem', fontWeight: 600 }}>{lead.name}</td>
                            <td style={{ padding: '0.5rem' }}>{lead.contact}</td>
                            <td style={{ padding: '0.5rem' }}>{lead.interest}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="engine-result-card">
                <span className="engine-result-label">📣 Digital Marketing Strategy</span>
                <p className="engine-result-value" style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{output.digital}</p>
              </div>

              <div className="engine-result-card">
                <span className="engine-result-label">💬 Suggested Copy / WhatsApp Hook</span>
                <pre className="engine-code-block" style={{ fontSize: '0.75rem', padding: '0.75rem' }}>{output.whatsapp}</pre>
              </div>

              <div className="engine-result-card">
                <span className="engine-result-label">📍 Physical & Offline Marketing Ideas</span>
                <p className="engine-result-value" style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{output.physical}</p>
              </div>

              {output.chart && <FunnelChart chart={output.chart} />}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default LeadGenPage

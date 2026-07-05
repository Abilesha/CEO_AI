import { useState } from 'react'
import './engine-forms.css'
import './LeadGen.css'

const PLATFORMS = [
  { value: 'WhatsApp Campaign',    label: '💬 WhatsApp Campaign',  chip: '#25D366' },
  { value: 'Cold Email Sequence',  label: '📧 Cold Email Sequence', chip: '#60a5fa' },
  { value: 'LinkedIn InMail Drip', label: '🔗 LinkedIn InMail Drip',chip: '#0ea5e9' },
  { value: 'Physical Marketing',   label: '📍 Physical Marketing',  chip: '#f97316' },
]

export function LeadGenPage() {
  const [platform, setPlatform] = useState('WhatsApp Campaign')
  const [goal, setGoal]         = useState('Book Demo Meetings')
  const [isSimulating, setIsSimulating] = useState(false)
  const [output, setOutput] = useState<any>({
    hook: 'Hi [Name], we mapped out a demo booking projection report specifically for your business operations. Can I send over the 3-line breakdown?',
    playbook: 'Run a segmented 3-touch WhatsApp workflow using a soft feedback hook.',
  })

  const chipColor = PLATFORMS.find(p => p.value === platform)?.chip ?? '#a78bfa'

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setOutput({
        hook: `Hi [Name]! Based on our recent industry analysis, we highlighted 3 operations leaks in your sector. Here is a custom roadmap to fix it — targeting "${goal}". Do you have 2 min?`,
        playbook: `Follow up via a structured 3-part automated ${platform} sequence. Add an interactive CTA link letting leads choose time slots instantly.`,
      })
    }, 1400)
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
          Acquire prospects and convert leads using AI-crafted hooks, omnichannel outreach
          sequences, and smart CTA playbooks.
        </p>
      </div>

      {/* Grid */}
      <div className="engine-grid">

        {/* ---- Form Panel ---- */}
        <div className="engine-form-panel">
          <span className="engine-form-panel-title">Campaign Parameters</span>

          {/* Platform */}
          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">📡</span>
              Outreach Platform
            </label>
            <div className="eng-select-wrapper">
              <select
                className="eng-select"
                value={platform}
                onChange={e => setPlatform(e.target.value)}
              >
                {PLATFORMS.map(p => (
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
                ✓ {platform}
              </span>
            </div>
          </div>

          {/* Goal */}
          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">🎯</span>
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
              {isSimulating ? '⬡ Generating Outreach Strategy...' : '⚡ Synthesize Campaign Hook'}
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
              <span className="engine-loading-text">Drafting templates and copy sequences…</span>
            </div>
          ) : (
            <div className="engine-result-stack">
              <div className="engine-result-card">
                <span className="engine-result-label">💬 Suggested Copy / Hook</span>
                <pre className="engine-code-block">{output.hook}</pre>
              </div>
              <div className="engine-result-card">
                <span className="engine-result-label">📋 Action Playbook</span>
                <p className="engine-result-value">{output.playbook}</p>
              </div>
              <div className="engine-result-card">
                <span className="engine-result-label">📡 Active Channel</span>
                <span className="engine-highlight-pill" style={{
                  background: `${chipColor}18`,
                  color: chipColor,
                  borderColor: `${chipColor}40`,
                }}>
                  {platform}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default LeadGenPage

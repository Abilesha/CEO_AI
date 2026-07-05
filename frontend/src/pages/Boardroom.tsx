import { useState } from 'react'
import api from '@services/api'
import './engine-forms.css'
import './Boardroom.css'

interface DebateTurn {
  role: string
  name: string
  avatar: string
  text: string
  color: string
}

interface ConsensusDetails {
  title: string
  steps: string[]
  expected_impact: string
  confidence_score: string
}

export function BoardroomPage() {
  const [query, setQuery] = useState('How can I increase revenue next quarter?')
  const [isDebating, setIsDebating] = useState(false)
  const [debateStep, setDebateStep] = useState(0)
  const [debateHistory, setDebateHistory] = useState<DebateTurn[]>([])
  const [consensus, setConsensus] = useState<ConsensusDetails | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleStartDebate = async () => {
    if (!query.trim()) return
    setIsDebating(true)
    setDebateStep(0)
    setDebateHistory([])
    setConsensus(null)
    setErrorMsg('')

    try {
      const response = await api.post<{ turns: DebateTurn[]; consensus: ConsensusDetails }>('/boardroom', {
        query,
      })

      if (response.data) {
        const fetchedTurns = response.data.turns
        const fetchedConsensus = response.data.consensus

        // Animate the turns step-by-step
        let currentStep = 0
        const interval = setInterval(() => {
          if (fetchedTurns && currentStep < fetchedTurns.length) {
            setDebateHistory(prev => [...prev, fetchedTurns[currentStep]])
            setDebateStep(currentStep + 1)
            currentStep++
          } else {
            clearInterval(interval)
            setIsDebating(false)
            setConsensus(fetchedConsensus)
            setDebateStep(5) // Debate complete
          }
        }, 1800)
      } else {
        setErrorMsg(response.error || 'Failed to convene boardroom debate.')
        setIsDebating(false)
      }
    } catch (err) {
      setErrorMsg('Network error connecting to the Boardroom agent.')
      setIsDebating(false)
    }
  }

  return (
    <div
      className="engine-page animate-fade-in"
      style={{
        '--eng-accent': 'linear-gradient(90deg, #8b5cf6, #34d399)',
        '--eng-glow': 'rgba(139, 92, 246, 0.15)',
        '--eng-focus-color': '#a78bfa',
        '--eng-focus-ring': 'rgba(139, 92, 246, 0.2)',
        '--eng-btn-bg': 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
        '--eng-btn-shadow': 'rgba(139, 92, 246, 0.4)',
        '--eng-chip-bg': 'rgba(139, 92, 246, 0.12)',
        '--eng-chip-color': '#a78bfa',
        '--eng-chip-border': 'rgba(139, 92, 246, 0.3)',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div className="engine-page-header">
        <h2 className="engine-page-title">🧠 AI Boardroom</h2>
        <p className="engine-page-subtitle">
          A Virtual Executive Team that debates and resolves conflicting priorities before presenting the final business decision.
        </p>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.75rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="boardroom-layout">
        {/* Left Column: Query Console */}
        <div className="engine-form-panel query-console">
          <span className="engine-form-panel-title">CEO Decision Console</span>

          <div className="eng-field">
            <label className="eng-label">
              <span className="eng-label-icon">💬</span>
              Enter Business Query
            </label>
            <textarea
              className="eng-input boardroom-textarea"
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={isDebating}
              placeholder="e.g. How can we increase revenue next quarter?"
            />
          </div>

          <button
            className={`eng-cta-btn ${isDebating ? 'loading' : ''}`}
            onClick={handleStartDebate}
            disabled={isDebating || !query.trim()}
          >
            <span className="eng-cta-btn-inner">
              {isDebating ? '⬡ Debate in Progress...' : '🧠 Convene Boardroom Debate'}
            </span>
          </button>

          {/* Execs attending */}
          <div className="boardroom-members glass">
            <h5>Executive Board Members Attending:</h5>
            <div className="member-icons-grid">
              <div className="member-chip" style={{ borderColor: '#ec4899' }}>📢 Marketing</div>
              <div className="member-chip" style={{ borderColor: '#10b981' }}>💰 Sales</div>
              <div className="member-chip" style={{ borderColor: '#f59e0b' }}>💸 Finance</div>
              <div className="member-chip" style={{ borderColor: '#fb923c' }}>🤝 Customer Success</div>
              <div className="member-chip" style={{ borderColor: '#22d3ee' }}>⚙️ Strategy</div>
            </div>
          </div>
        </div>

        {/* Right Column: Debate Chamber */}
        <div className="engine-output-panel debate-chamber">
          <div className="engine-output-title">
            🎙️ AI Executive Debate Chamber
            {isDebating && <span className="debate-active-badge">● Debating</span>}
          </div>

          {debateHistory.length === 0 && !isDebating && (
            <div className="boardroom-placeholder">
              <div className="placeholder-icon">🧠</div>
              <p>Convene the AI Boardroom to witness the virtual executive debate and resolve conflicts in real-time.</p>
            </div>
          )}

          {/* Transcript Feed */}
          <div className="debate-transcript-feed">
            {debateHistory.map((turn, i) => {
              if (!turn) return null;
              const color = turn.color || '#8b5cf6';
              const avatar = turn.avatar || '🤖';
              return (
                <div key={i} className="debate-turn-card glass" style={{ borderLeftColor: color }}>
                  <div className="turn-header">
                    <span className="turn-avatar" style={{ background: `${color}15`, color: color }}>
                      {avatar}
                    </span>
                    <div className="turn-identity">
                      <span className="turn-name">{turn.name}</span>
                      <span className="turn-role" style={{ color: color }}>{turn.role}</span>
                    </div>
                  </div>
                  <p className="turn-text">{turn.text}</p>
                </div>
              );
            })}

            {isDebating && (
              <div className="debate-turn-card typing-placeholder glass">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}

            {/* Resolved Strategy decision card */}
            {debateStep === 5 && consensus && (
              <div className="boardroom-consensus-section animate-slide-up">
                <div className="strategy-resolution-header">
                  <span className="resolution-icon">⚙️</span>
                  <div>
                    <span className="resolution-label">Resolution Agent (Strategy)</span>
                    <span className="resolution-status">Consensus Synthesized</span>
                  </div>
                </div>

                <div className="resolution-body glass">
                  <h4 className="resolution-title">📋 {consensus.title}</h4>
                  <ol className="resolution-steps">
                    {consensus.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>

                  <div className="resolution-impact-row">
                    <div className="impact-badge positive">
                      <span className="impact-badge-lbl">Expected Impact</span>
                      <span className="impact-badge-val">{consensus.expected_impact}</span>
                    </div>
                    <div className="impact-badge info">
                      <span className="impact-badge-lbl">Confidence Score</span>
                      <span className="impact-badge-val">{consensus.confidence_score}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardroomPage

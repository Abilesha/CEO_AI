import { useState } from 'react'
import api from '@services/api'
import './CustomerSuccess.css'

interface Message {
  sender: 'user' | 'bot'
  text: string
  chart?: {
    type: 'bar' | 'pie'
    title: string
    labels: string[]
    datasets?: Array<{ label: string; data: number[]; color: string }>
    colors?: string[]
  }
}

/* ---- Custom SVG Chart Component ---- */
function VisualChart({ chart }: { chart: Message['chart'] }) {
  if (!chart) return null

  if (chart.type === 'bar') {
    const datasets = chart.datasets || []
    if (datasets.length === 0) return null

    // Determine max value for scaling
    const allValues = datasets.flatMap((d) => d.data)
    const maxValue = Math.max(...allValues, 100)

    return (
      <div className="custom-chart bar-chart-container glass animate-fade-in">
        <h4 className="chart-title">{chart.title}</h4>
        <div className="bar-grid">
          {chart.labels.map((label, idx) => (
            <div key={idx} className="bar-row">
              <span className="bar-label">{label}</span>
              <div className="bar-track-group">
                {datasets.map((dataset, dIdx) => {
                  const val = dataset.data[idx] || 0
                  const pct = Math.min((val / maxValue) * 100, 100)
                  return (
                    <div key={dIdx} className="bar-track-wrapper">
                      <div
                        className="bar-fill animate-grow-width"
                        style={{
                          width: `${pct}%`,
                          background: dataset.color || 'var(--color-primary)',
                          boxShadow: `0 0 10px ${dataset.color}44`,
                        }}
                      />
                      <span className="bar-value">{val}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="chart-legend">
          {datasets.map((dataset, idx) => (
            <div key={idx} className="legend-item">
              <span className="legend-dot" style={{ background: dataset.color }} />
              <span className="legend-text">{dataset.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (chart.type === 'pie') {
    const dataset = chart.datasets?.[0]
    if (!dataset) return null

    const total = dataset.data.reduce((a, b) => a + b, 0)
    const colors = chart.colors || ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

    let accumulatedAngle = 0

    return (
      <div className="custom-chart pie-chart-container glass animate-fade-in">
        <h4 className="chart-title">{chart.title}</h4>
        <div className="pie-layout">
          <div className="pie-svg-wrapper">
            <svg width="120" height="120" viewBox="0 0 32 32" className="pie-svg">
              {dataset.data.map((value, idx) => {
                const percentage = (value / total) * 100
                const strokeDash = `${percentage} ${100 - percentage}`
                const strokeOffset = 100 - accumulatedAngle + 25 // 25 to start at top (12 o'clock)
                accumulatedAngle += percentage

                return (
                  <circle
                    key={idx}
                    r="15.915"
                    cx="16"
                    cy="16"
                    fill="transparent"
                    stroke={colors[idx % colors.length]}
                    strokeWidth="3.5"
                    strokeDasharray={strokeDash}
                    strokeDashoffset={strokeOffset}
                    className="pie-segment"
                  />
                )
              })}
            </svg>
            <div className="pie-center-hole">⬡</div>
          </div>
          <div className="pie-legend">
            {chart.labels.map((label, idx) => {
              const val = dataset.data[idx] || 0
              const percentage = ((val / total) * 100).toFixed(1)
              return (
                <div key={idx} className="pie-legend-row">
                  <span className="legend-dot" style={{ background: colors[idx % colors.length] }} />
                  <span className="pie-legend-label">{label}</span>
                  <span className="pie-legend-val">{val} ({percentage}%)</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export function CustomerSuccessPage() {
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Welcome to CEO AI Customer Success portal. I have loaded active LangGraph database routing schemas. How can I help you today?',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = chatInput
    const newMsg: Message = { sender: 'user', text: userMessage }
    setChatHistory((prev) => [...prev, newMsg])
    setChatInput('')

    setIsSimulating(true)
    try {
      const response = await api.post<{
        reply: string
        session_id: string
        timestamp: string
      }>('/chat', {
        message: userMessage,
        session_id: sessionId,
      })

      if (response.data) {
        setSessionId(response.data.session_id)
        let replyText = response.data.reply
        let parsedChart: Message['chart'] | undefined = undefined

        // Parse chart token if present: [CHART: {...}]
        const chartMarker = '[CHART:'
        if (replyText.includes(chartMarker)) {
          const startIdx = replyText.indexOf(chartMarker)
          const endIdx = replyText.lastIndexOf(']')
          if (endIdx > startIdx) {
            const jsonStr = replyText.substring(startIdx + chartMarker.length, endIdx).trim()
            try {
              parsedChart = JSON.parse(jsonStr)
              // Strip the chart token from visible text
              replyText = replyText.substring(0, startIdx).trim() + replyText.substring(endIdx + 1).trim()
            } catch (err) {
              console.error('Failed to parse chart json', err)
            }
          }
        }

        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: replyText,
            chart: parsedChart,
          },
        ])
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Error: ${response.error || 'Failed to reach AI agents.'}`,
          },
        ])
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Network error connecting to the active LangGraph orchestrator.',
        },
      ])
    } finally {
      setIsSimulating(false)
    }
  }

  return (
    <div className="cs-page animate-fade-in">
      <div className="cs-header">
        <h2 className="cs-title">Customer Success Engine 🤝</h2>
        <p className="cs-subtitle">
          Manage customer tickets, link CRM systems, and test the active LangGraph database-backed chatbot.
        </p>
      </div>

      <div className="cs-grid">
        <div className="cs-chat-panel glass">
          <h3>Interactive AI Chatbot Console (LangGraph Powered)</h3>
          <div className="chat-window">
            <div className="chat-history">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-bubble-container ${msg.sender}`}>
                  <div className={`chat-bubble-wrapper ${msg.sender}`}>
                    {msg.sender === 'bot' && i > 0 && (
                      <div className="agent-route-badge animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px', fontSize: '9px', fontWeight: 500 }}>
                        <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>check_db</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>➔</span>
                        {(msg.chart || msg.text.toLowerCase().includes('database') || msg.text.toLowerCase().includes('overview') || msg.text.toLowerCase().includes('retrieved')) && (
                          <>
                            <span style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.1)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(6, 182, 212, 0.15)' }}>query_postgresql</span>
                            <span style={{ color: 'var(--color-text-muted)' }}>➔</span>
                          </>
                        )}
                        <span style={{ color: '#a78bfa', background: 'rgba(139, 92, 246, 0.1)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(139, 92, 246, 0.15)' }}>call_llm</span>
                      </div>
                    )}
                    <div className={`chat-bubble ${msg.sender}`} style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                    {msg.chart && <VisualChart chart={msg.chart} />}
                  </div>
                </div>
              ))}
              {isSimulating && (
                <div className="chat-bubble-container bot">
                  <div className="chat-bubble bot typing">● ● ●</div>
                </div>
              )}
            </div>
            <form className="chat-form" onSubmit={handleSendChat}>
              <input
                type="text"
                placeholder="Query database... (e.g. 'Show resistor units sold chart', 'strategy recommendations graph')..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isSimulating}
                className="form-input chat-input-field"
              />
              <button type="submit" className="btn btn-primary chat-send-btn" disabled={isSimulating}>
                Send
              </button>
            </form>
          </div>
        </div>

        <div className="cs-info-panel glass">
          <h3>🤝 CRM & Support Portal Integration</h3>
          <div className="integration-row">
            <strong>Active CRM Link:</strong>
            <p className="badge badge-success">● Connected to Salesforce Hub</p>
          </div>
          <div className="integration-row">
            <strong>LangGraph Orchestration:</strong>
            <p>Routes queries dynamically between executive agents and SQL databases.</p>
          </div>
          <div className="integration-row">
            <strong>Database Queries Enabled:</strong>
            <p>Supports live retrieval of `electronic_components` and `recommendations` data.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerSuccessPage

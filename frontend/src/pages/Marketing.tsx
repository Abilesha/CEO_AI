import { useState, useEffect } from 'react'
import './engine-forms.css'
import './Marketing.css'

/* ── Instagram Weekly Post Generator Data ── */
const AUDIENCES = [
  'Urban Millennials (25–35)',
  'Tier-2 & Tier-3 City SMBs',
  'MSME Owners & Founders',
  'College Students (Gen-Z)',
  'Homemakers & D2C Shoppers',
  'IT Professionals & Techies',
  'Rural Farmers (via AgriTech)',
  'HNI / Startup Investors',
]

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Kannada', 'Bengali', 'Malayalam',
]

const INSTA_POST_POOL = [
  {
    emoji: '🚀',
    caption: `The future of business is AI-powered.\n\nWe're using CEO AI to run our entire marketing engine — from strategy to execution — in minutes, not months.\n\n📊 48 signals processed overnight\n💰 ₹3.4L opportunity identified\n⚡ 94.7% efficiency score\n\nAre you still making decisions manually? 👀`,
    hashtags: '#CEOAI #ArtificialIntelligence #StartupIndia #BusinessGrowth #AIForBusiness #Entrepreneur #GrowthHacking #IndiaStartup #DigitalIndia #AIStrategy',
    theme: 'AI Transformation',
    cta: 'Link in bio → Try CEO AI free for 14 days',
  },
  {
    emoji: '💡',
    caption: `What if your entire executive team worked 24/7?\n\nWith CEO AI's AI Boardroom, every major business decision goes through a virtual debate:\n\n🧠 Marketing AI vs Finance AI vs Sales AI\n⚖️ Conflicts resolved automatically\n✅ Best strategy wins — always\n\nStop guessing. Start deciding with data.`,
    hashtags: '#Leadership #BusinessStrategy #AIBoardroom #DecisionMaking #StartupLife #BusinessIntelligence #CEOAI #TechForGood #IndiaGrowth #FutureOfWork',
    theme: 'AI Boardroom',
    cta: 'Comment "BOARDROOM" to get a free demo 💬',
  },
  {
    emoji: '📈',
    caption: `We asked our Growth Simulator: "What if we doubled the sales team?"\n\nResult in 3 seconds:\n📊 Revenue Growth: +34%\n🎯 Lead Growth: +31%\n📉 CAC reduced by ₹1,750\n⚠️ Risk Level: Medium\n\nThis used to take us 2 weeks of spreadsheets. Now it's a slider. 🤯`,
    hashtags: '#GrowthHacking #RevenueGrowth #SalesStrategy #StartupIndia #AITools #BusinessSimulator #ScaleUp #CEOAI #DataDriven #B2BSaaS',
    theme: 'Growth Simulator',
    cta: 'Try the simulator free → Link in bio',
  },
  {
    emoji: '🛡️',
    caption: `Our AI Crisis Detector flagged a supply chain risk at 3:42 AM.\n\nBy 9:00 AM, our team had already activated the backup supplier.\n\n✅ Zero customer impact\n✅ ₹8.2L in potential losses avoided\n✅ Full audit trail generated automatically\n\nSleeping peacefully because AI never sleeps. 😌`,
    hashtags: '#CrisisManagement #RiskManagement #AIForBusiness #BusinessContinuity #StartupIndia #CEOAI #SupplyChain #OperationalExcellence #IndiaStartup #AIProtection',
    theme: 'Crisis Detector',
    cta: 'See how CEO AI protects your business → Link in bio',
  },
]

/* ── Post History ── */
interface PostRecord {
  id: string
  caption: string
  hashtags: string
  theme: string
  postedOn: string
  status: 'posted' | 'pending' | 'skipped'
}

const INITIAL_HISTORY: PostRecord[] = [
  {
    id: 'h1',
    caption: INSTA_POST_POOL[0].caption,
    hashtags: INSTA_POST_POOL[0].hashtags,
    theme: INSTA_POST_POOL[0].theme,
    postedOn: '2026-06-28',
    status: 'posted',
  },
  {
    id: 'h2',
    caption: INSTA_POST_POOL[1].caption,
    hashtags: INSTA_POST_POOL[1].hashtags,
    theme: INSTA_POST_POOL[1].theme,
    postedOn: '2026-06-21',
    status: 'posted',
  },
]

/* Next Sunday helper */
function getNextSunday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? 7 : 7 - day
  d.setDate(d.getDate() + diff)
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function MarketingPage() {
  const [audience,  setAudience]  = useState('Urban Millennials (25–35)')
  const [budget,    setBudget]    = useState('500000')
  const [language,  setLanguage]  = useState('English')
  const [isSimulating, setIsSimulating] = useState(false)
  const [output, setOutput] = useState<any>({
    theme:    'India\'s Digital Growth Partner — Scale with AI',
    channels: 'Instagram Reels & YouTube Shorts (40%), WhatsApp Business Broadcasts (30%), Google UAC / Performance Max (20%), Influencer collabs on Moj & Josh (10%).',
    roi:      'Estimated 3.8× ROI based on India CPM benchmarks (₹80–₹120 per 1000 impressions).',
  })

  /* Instagram Auto-Post state */
  const [instaEnabled,    setInstaEnabled]    = useState(true)
  const [postTime,        setPostTime]        = useState('10:00')
  const [postDay,         setPostDay]         = useState('Sunday')
  const [currentPost,     setCurrentPost]     = useState(INSTA_POST_POOL[2])
  const [showApproval,    setShowApproval]    = useState(true)
  const [history,         setHistory]         = useState<PostRecord[]>(INITIAL_HISTORY)
  const [postApproved,    setPostApproved]    = useState(false)
  const [editCaption,     setEditCaption]     = useState(false)
  const [editedCaption,   setEditedCaption]   = useState(currentPost.caption)
  const [editedHashtags,  setEditedHashtags]  = useState(currentPost.hashtags)
  const [copied,          setCopied]          = useState(false)
  const [regenerating,    setRegenerating]    = useState(false)
  const [activeTab,       setActiveTab]       = useState<'campaign'|'instagram'>('campaign')

  useEffect(() => {
    setEditedCaption(currentPost.caption)
    setEditedHashtags(currentPost.hashtags)
  }, [currentPost])

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setOutput({
        theme:    `"AI Layer for Your ${audience}" — customized campaign in ${language} targeting aspirational growth story.`,
        channels: `Meta India (Instagram + Facebook Ads) 45%, YouTube ${language} pre-roll 25%, WhatsApp Business campaigns 20%, Jio/Airtel OTT pre-rolls 10%.`,
        roi:      `Projected 4.2× ROI on ₹${parseInt(budget).toLocaleString('en-IN')} budget. Break-even at 18 days with retargeting enabled. Estimated ₹${Math.round(parseInt(budget) * 0.9).toLocaleString('en-IN')} in new MRR.`,
      })
    }, 1400)
  }

  const handleApprove = () => {
    setPostApproved(true)
    const record: PostRecord = {
      id: Date.now().toString(),
      caption: editCaption ? editedCaption : currentPost.caption,
      hashtags: editedHashtags,
      theme: currentPost.theme,
      postedOn: new Date().toISOString().split('T')[0],
      status: 'pending',
    }
    setHistory(prev => [record, ...prev])
    setTimeout(() => {
      setHistory(prev => prev.map(r => r.id === record.id ? { ...r, status: 'posted' } : r))
    }, 2000)
  }

  const handleSkip = () => {
    const record: PostRecord = {
      id: Date.now().toString(),
      caption: currentPost.caption,
      hashtags: currentPost.hashtags,
      theme: currentPost.theme,
      postedOn: new Date().toISOString().split('T')[0],
      status: 'skipped',
    }
    setHistory(prev => [record, ...prev])
    setShowApproval(false)
  }

  const handleRegenerate = () => {
    setRegenerating(true)
    setTimeout(() => {
      const pool = INSTA_POST_POOL.filter(p => p.theme !== currentPost.theme)
      const next = pool[Math.floor(Math.random() * pool.length)]
      setCurrentPost(next)
      setPostApproved(false)
      setEditCaption(false)
      setRegenerating(false)
      setShowApproval(true)
    }, 1200)
  }

  const handleCopy = () => {
    const text = `${editCaption ? editedCaption : currentPost.caption}\n\n${editedHashtags}\n\n${currentPost.cta}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="engine-page animate-fade-in"
      style={{
        '--eng-accent': 'linear-gradient(90deg, #ec4899, #f472b6)',
        '--eng-glow': 'rgba(236, 72, 153, 0.15)',
        '--eng-focus-color': '#f472b6',
        '--eng-focus-ring': 'rgba(236, 72, 153, 0.2)',
        '--eng-btn-bg': 'linear-gradient(135deg, #ec4899, #be185d)',
        '--eng-btn-shadow': 'rgba(236, 72, 153, 0.4)',
        '--eng-chip-bg': 'rgba(236, 72, 153, 0.12)',
        '--eng-chip-color': '#f472b6',
        '--eng-chip-border': 'rgba(236, 72, 153, 0.3)',
      } as React.CSSProperties}
    >
      <div className="engine-page-header">
        <h2 className="engine-page-title">📣 Marketing Engine</h2>
        <p className="engine-page-subtitle">
          Design 360° India-first marketing campaigns with AI — vernacular content, WhatsApp
          broadcasts, regional OTT, and Instagram auto-posting.
        </p>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="mkt-tabs">
        <button
          className={`mkt-tab ${activeTab === 'campaign' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaign')}
        >
          📢 Campaign Engine
        </button>
        <button
          className={`mkt-tab ${activeTab === 'instagram' ? 'active' : ''}`}
          onClick={() => setActiveTab('instagram')}
        >
          <span className="insta-tab-icon">📸</span> Instagram Auto-Post
          {showApproval && !postApproved && (
            <span className="mkt-tab-badge">1</span>
          )}
        </button>
      </div>

      {/* ══════════════════════ CAMPAIGN TAB ══════════════════════ */}
      {activeTab === 'campaign' && (
        <div className="engine-grid">
          <div className="engine-form-panel">
            <span className="engine-form-panel-title">Campaign Configuration</span>

            <div className="eng-field">
              <label className="eng-label"><span className="eng-label-icon">👥</span>Target Audience</label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={audience} onChange={e => setAudience(e.target.value)}>
                  {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="eng-chip-row"><span className="eng-chip">🎯 {audience}</span></div>
            </div>

            <div className="eng-field">
              <label className="eng-label"><span className="eng-label-icon">🗣️</span>Primary Language</label>
              <div className="eng-select-wrapper">
                <select className="eng-select" value={language} onChange={e => setLanguage(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="eng-chip-row"><span className="eng-chip">🇮🇳 {language}</span></div>
            </div>

            <div className="eng-field">
              <label className="eng-label"><span className="eng-label-icon">💰</span>Campaign Budget (₹)</label>
              <div className="eng-number-wrapper">
                <span className="eng-number-prefix">₹</span>
                <input type="number" className="eng-input" placeholder="500000" value={budget} onChange={e => setBudget(e.target.value)} />
              </div>
              {budget && (
                <div className="eng-chip-row">
                  <span className="eng-chip">₹{parseInt(budget || '0').toLocaleString('en-IN')} budget</span>
                </div>
              )}
            </div>

            <button className={`eng-cta-btn${isSimulating ? ' loading' : ''}`} onClick={handleSimulate} disabled={isSimulating}>
              <span className="eng-cta-btn-inner">
                {isSimulating ? '⬡ Modelling India Campaign...' : '📣 Generate 360° India Strategy'}
              </span>
            </button>
          </div>

          <div className="engine-output-panel">
            <div className="engine-output-title">📢 360° India Marketing Recommendations</div>
            {isSimulating ? (
              <div className="engine-loading">
                <div className="engine-loading-orb">📣</div>
                <span className="engine-loading-text">Analysing India audience profiles…</span>
              </div>
            ) : (
              <div className="engine-result-stack">
                <div className="engine-result-card">
                  <span className="engine-result-label">🎨 Campaign Theme</span>
                  <p className="engine-result-value">{output.theme}</p>
                </div>
                <div className="engine-result-card">
                  <span className="engine-result-label">📱 India Channel Mix</span>
                  <p className="engine-result-value">{output.channels}</p>
                </div>
                <div className="engine-result-card">
                  <span className="engine-result-label">📈 Projected ROI</span>
                  <p className="engine-result-value">{output.roi}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════ INSTAGRAM TAB ══════════════════════ */}
      {activeTab === 'instagram' && (
        <div className="insta-layout">

          {/* LEFT: Controls + Schedule */}
          <div className="insta-left">

            {/* Schedule Config */}
            <div className="insta-schedule-card glass">
              <div className="insta-schedule-header">
                <div className="insta-schedule-icon">📸</div>
                <div>
                  <h3 className="insta-schedule-title">Instagram Weekly Auto-Post</h3>
                  <p className="insta-schedule-sub">AI generates & schedules one post per week</p>
                </div>
                <div
                  className={`insta-toggle ${instaEnabled ? 'on' : 'off'}`}
                  onClick={() => setInstaEnabled(v => !v)}
                  title={instaEnabled ? 'Disable auto-post' : 'Enable auto-post'}
                >
                  <span className="insta-toggle-knob" />
                </div>
              </div>

              {instaEnabled && (
                <div className="insta-schedule-body">
                  <div className="insta-sched-row">
                    <label>📅 Post Day</label>
                    <select
                      className="insta-sched-select"
                      value={postDay}
                      onChange={e => setPostDay(e.target.value)}
                    >
                      {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="insta-sched-row">
                    <label>⏰ Post Time</label>
                    <input
                      type="time"
                      className="insta-sched-input"
                      value={postTime}
                      onChange={e => setPostTime(e.target.value)}
                    />
                  </div>
                  <div className="insta-next-post">
                    <span className="insta-next-label">🗓️ Next Post</span>
                    <span className="insta-next-val">{getNextSunday()} at {postTime}</span>
                  </div>
                  <div className="insta-status-chip">
                    <span className="insta-live-dot" />
                    Auto-posting active — Every {postDay}
                  </div>
                </div>
              )}

              {!instaEnabled && (
                <div className="insta-disabled-notice">
                  Auto-posting is paused. Toggle to re-enable weekly scheduling.
                </div>
              )}
            </div>

            {/* Post History */}
            <div className="insta-history-card glass">
              <h4 className="insta-history-title">📋 Post History</h4>
              <div className="insta-history-list">
                {history.map(h => (
                  <div key={h.id} className={`insta-hist-row ${h.status}`}>
                    <div className="insta-hist-meta">
                      <span className="insta-hist-theme">{h.theme}</span>
                      <span className="insta-hist-date">{h.postedOn}</span>
                    </div>
                    <span className={`insta-hist-badge ${h.status}`}>
                      {h.status === 'posted' ? '✓ Posted' : h.status === 'pending' ? '⏳ Queued' : '✕ Skipped'}
                    </span>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="insta-hist-empty">No posts yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Approval Card */}
          <div className="insta-right">
            {showApproval && !postApproved && (
              <div className="insta-approval-card glass">
                <div className="insta-approval-header">
                  <span className="insta-approval-badge">
                    <span className="insta-live-dot" /> This Week's AI Post
                  </span>
                  <span className="insta-approval-theme">{currentPost.theme}</span>
                </div>

                {/* Instagram Phone Mockup */}
                <div className="insta-phone-mockup">
                  <div className="insta-mock-header">
                    <div className="insta-mock-avatar">CA</div>
                    <div className="insta-mock-name">
                      <span>ceo_ai_official</span>
                      <span className="insta-mock-sub">CEO AI • Sponsored</span>
                    </div>
                    <span className="insta-mock-dots">···</span>
                  </div>
                  <div className="insta-mock-image">
                    <span className="insta-mock-emoji">{currentPost.emoji}</span>
                    <span className="insta-mock-label">CEO AI</span>
                  </div>
                  <div className="insta-mock-actions">
                    <span>🤍</span><span>💬</span><span>📤</span>
                    <span style={{marginLeft:'auto'}}>🔖</span>
                  </div>
                  <div className="insta-mock-caption">
                    <strong>ceo_ai_official</strong>{' '}
                    {(editCaption ? editedCaption : currentPost.caption).split('\n')[0]}
                    <span className="insta-mock-more"> ...more</span>
                  </div>
                </div>

                {/* Caption Editor */}
                <div className="insta-caption-section">
                  <div className="insta-caption-header">
                    <span className="insta-caption-label">✍️ Caption</span>
                    <button
                      className="insta-edit-btn"
                      onClick={() => setEditCaption(v => !v)}
                    >
                      {editCaption ? '👁 Preview' : '✏️ Edit'}
                    </button>
                  </div>

                  {editCaption ? (
                    <textarea
                      className="insta-caption-textarea"
                      value={editedCaption}
                      onChange={e => setEditedCaption(e.target.value)}
                      rows={6}
                    />
                  ) : (
                    <p className="insta-caption-text">
                      {currentPost.caption}
                    </p>
                  )}

                  <div className="insta-hashtag-section">
                    <span className="insta-caption-label">🏷️ Hashtags</span>
                    <textarea
                      className="insta-hashtag-textarea"
                      value={editedHashtags}
                      onChange={e => setEditedHashtags(e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="insta-cta-text">
                    <span className="insta-caption-label">📎 CTA</span>
                    <p className="insta-cta-value">{currentPost.cta}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="insta-approval-actions">
                  <button className="insta-btn-regen" onClick={handleRegenerate} disabled={regenerating}>
                    {regenerating ? '⏳ Regenerating...' : '🔄 Regenerate'}
                  </button>
                  <button className="insta-btn-copy" onClick={handleCopy}>
                    {copied ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button className="insta-btn-skip" onClick={handleSkip}>
                    ✕ Skip
                  </button>
                  <button className="insta-btn-approve" onClick={handleApprove}>
                    ✓ Approve & Schedule Post
                  </button>
                </div>
              </div>
            )}

            {/* Success State */}
            {postApproved && (
              <div className="insta-success-card glass animate-fade-in">
                <div className="insta-success-icon">🎉</div>
                <h3>Post Approved & Scheduled!</h3>
                <p>Your Instagram post has been queued for <strong>{postDay} at {postTime}</strong>.</p>
                <p className="insta-success-sub">CEO AI will publish this automatically. No further action needed.</p>
                <div className="insta-success-detail">
                  <div className="insta-success-row">
                    <span>📅 Scheduled for</span>
                    <strong>{getNextSunday()}</strong>
                  </div>
                  <div className="insta-success-row">
                    <span>⏰ Post time</span>
                    <strong>{postTime} IST</strong>
                  </div>
                  <div className="insta-success-row">
                    <span>🎨 Theme</span>
                    <strong>{currentPost.theme}</strong>
                  </div>
                </div>
                <button
                  className="insta-btn-approve"
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => { handleRegenerate(); setPostApproved(false); setShowApproval(true) }}
                >
                  ✦ Preview Next Week's Post
                </button>
              </div>
            )}

            {!showApproval && !postApproved && (
              <div className="insta-success-card glass animate-fade-in">
                <div className="insta-success-icon">⏭️</div>
                <h3>Post Skipped</h3>
                <p>This week's post was skipped. CEO AI will generate a fresh post next week.</p>
                <button className="insta-btn-approve" style={{ marginTop: '1rem' }}
                  onClick={() => { setShowApproval(true) }}>
                  ↩ Review This Week's Post Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MarketingPage

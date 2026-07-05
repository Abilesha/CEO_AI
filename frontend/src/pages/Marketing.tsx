import { useState, useEffect, useRef } from 'react'
import api from '@services/api'
import './engine-forms.css'
import './Marketing.css'

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const AUDIENCES = [
  'Urban Millennials (25–35)', 'Tier-2 & Tier-3 City SMBs',
  'MSME Owners & Founders', 'College Students (Gen-Z)',
  'Homemakers & D2C Shoppers', 'IT Professionals & Techies',
  'Rural Farmers (via AgriTech)', 'HNI / Startup Investors',
]
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Kannada', 'Bengali', 'Malayalam']

const INSTA_POST_POOL = [
  {
    emoji: '🚀', theme: 'AI Transformation',
    caption: `The future of business is AI-powered.\n\nWe're using CEO AI to run our entire marketing engine — from strategy to execution — in minutes, not months.\n\n📊 48 signals processed overnight\n💰 ₹3.4L opportunity identified\n⚡ 94.7% efficiency score\n\nAre you still making decisions manually? 👀`,
    hashtags: '#CEOAI #ArtificialIntelligence #StartupIndia #BusinessGrowth #AIForBusiness #Entrepreneur #GrowthHacking #IndiaStartup #DigitalIndia #AIStrategy',
    cta: 'Link in bio → Try CEO AI free for 14 days',
  },
  {
    emoji: '💡', theme: 'AI Boardroom',
    caption: `What if your entire executive team worked 24/7?\n\nWith CEO AI's AI Boardroom, every major business decision goes through a virtual debate:\n\n🧠 Marketing AI vs Finance AI vs Sales AI\n⚖️ Conflicts resolved automatically\n✅ Best strategy wins — always\n\nStop guessing. Start deciding with data.`,
    hashtags: '#Leadership #BusinessStrategy #AIBoardroom #DecisionMaking #StartupLife #BusinessIntelligence #CEOAI #TechForGood #IndiaGrowth #FutureOfWork',
    cta: 'Comment "BOARDROOM" to get a free demo 💬',
  },
  {
    emoji: '📈', theme: 'Growth Simulator',
    caption: `We asked our Growth Simulator: "What if we doubled the sales team?"\n\nResult in 3 seconds:\n📊 Revenue Growth: +34%\n🎯 Lead Growth: +31%\n📉 CAC reduced by ₹1,750\n⚠️ Risk Level: Medium\n\nThis used to take us 2 weeks of spreadsheets. Now it's a slider. 🤯`,
    hashtags: '#GrowthHacking #RevenueGrowth #SalesStrategy #StartupIndia #AITools #BusinessSimulator #ScaleUp #CEOAI #DataDriven #B2BSaaS',
    cta: 'Try the simulator free → Link in bio',
  },
  {
    emoji: '🛡️', theme: 'Crisis Detector',
    caption: `Our AI Crisis Detector flagged a supply chain risk at 3:42 AM.\n\nBy 9:00 AM, our team had already activated the backup supplier.\n\n✅ Zero customer impact\n✅ ₹8.2L in potential losses avoided\n✅ Full audit trail generated automatically\n\nSleeping peacefully because AI never sleeps. 😌`,
    hashtags: '#CrisisManagement #RiskManagement #AIForBusiness #BusinessContinuity #StartupIndia #CEOAI #SupplyChain #OperationalExcellence #IndiaStartup #AIProtection',
    cta: 'See how CEO AI protects your business → Link in bio',
  },
]

/* ─────────────────────────────────────────────
   AI POST GENERATOR — smart keyword matching
───────────────────────────────────────────── */
interface GeneratedPost {
  emoji: string
  theme: string
  caption: string
  hashtags: string
  cta: string
}

function generatePostFromPrompt(prompt: string): GeneratedPost {
  const p = prompt.toLowerCase()

  // Detect tone/style keywords
  const isMotivational = p.includes('motivat') || p.includes('inspir') || p.includes('success')
  const isTech         = p.includes('ai') || p.includes('tech') || p.includes('software') || p.includes('digital')
  const isGrowth       = p.includes('growth') || p.includes('revenue') || p.includes('scale') || p.includes('sales')
  const isProduct      = p.includes('product') || p.includes('launch') || p.includes('feature') || p.includes('new')
  const isCrisis       = p.includes('crisis') || p.includes('risk') || p.includes('problem') || p.includes('issue')
  const isTeam         = p.includes('team') || p.includes('hire') || p.includes('people') || p.includes('culture')
  const isFinance      = p.includes('profit') || p.includes('cost') || p.includes('budget') || p.includes('rupee') || p.includes('₹') || p.includes('money')
  const isAwareness    = p.includes('brand') || p.includes('aware') || p.includes('story') || p.includes('journey')
  const isOffer        = p.includes('offer') || p.includes('discount') || p.includes('free') || p.includes('deal') || p.includes('promo')

  // Extract any numbers/percentages mentioned
  const numMatch  = prompt.match(/\d+[%₹LKk]?/g)
  const firstNum  = numMatch ? numMatch[0] : '40%'

  // Extract any topic words (3+ chars, not common words)
  const stopWords = new Set(['the','and','for','our','with','that','this','have','from','about','want','need','post','make','create','generate'])
  const topicWords = prompt.split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w.toLowerCase()))
  const topicHint  = topicWords.slice(0, 3).join(' ') || 'our business'

  // Build a contextual caption
  let emoji   = '✨'
  let theme   = 'Custom Post'
  let caption = ''
  let hashtags = ''
  let cta     = 'Follow for more insights → Link in bio'

  if (isOffer) {
    emoji   = '🎁'
    theme   = 'Special Offer'
    caption = `Big news! 🎉\n\n${prompt.length > 20 ? prompt : 'We have something special for you'}.\n\n🔥 Limited time only\n⚡ Act fast — spots are filling up!\n✅ ${firstNum} off for early birds\n\nDon't miss this. Your business deserves the best tools.`
    hashtags = '#SpecialOffer #LimitedTime #StartupIndia #BusinessTools #CEOAI #GrowthHacking #Entrepreneur #IndiaStartup #Discount #AIForBusiness'
    cta     = 'Claim your offer → Link in bio 🎁'
  } else if (isCrisis) {
    emoji   = '🛡️'
    theme   = 'Risk & Protection'
    caption = `"${topicHint}" — Every business faces this.\n\nBut smart founders don't just react. They predict.\n\nWith CEO AI:\n🔍 Risks detected before they escalate\n📋 Audit trail generated automatically\n⚡ Response time cut by ${firstNum}\n\nIs your business protected?`
    hashtags = '#RiskManagement #BusinessContinuity #StartupIndia #CEOAI #CrisisManagement #AIProtection #OperationalExcellence #IndiaStartup #BusinessStrategy #AIForBusiness'
    cta     = 'See how we protect your business → Link in bio'
  } else if (isGrowth) {
    emoji   = '📈'
    theme   = 'Growth Story'
    caption = `${topicHint.charAt(0).toUpperCase() + topicHint.slice(1)} changed everything for us.\n\nHere's what happened when we let AI drive growth:\n\n📊 Revenue up ${firstNum}\n🎯 Lead quality improved 2x\n⏱️ Decision time: from weeks → hours\n\nThis is what AI-first business looks like in 2026.`
    hashtags = '#RevenueGrowth #GrowthHacking #StartupIndia #CEOAI #SalesStrategy #ScaleUp #DataDriven #AITools #IndiaStartup #B2BSaaS'
    cta     = 'Try CEO AI Growth Simulator → Link in bio'
  } else if (isFinance) {
    emoji   = '💰'
    theme   = 'Financial Intelligence'
    caption = `Most founders look at P&L once a month.\n\nWith CEO AI Finance Engine, we see:\n\n💰 Real-time cash flow projections\n📉 Cost anomalies flagged instantly\n📊 Budget vs actuals — updated daily\n⚠️ ${topicHint} monitored 24/7\n\nFinancial clarity = better decisions.`
    hashtags = '#FinancialIntelligence #StartupFinance #IndiaStartup #CEOAI #CashFlow #BusinessIntelligence #FinTech #CFO #DataDriven #AIForBusiness'
    cta     = 'Get your financial AI report → Link in bio'
  } else if (isTeam) {
    emoji   = '👥'
    theme   = 'Team & Culture'
    caption = `The best teams aren't built with spreadsheets.\n\nAt ${topicHint}, we use AI to:\n\n👥 Match the right people to the right roles\n📊 Track productivity without micromanaging\n🧠 Spot burnout signals early\n✅ Build a culture of data-driven trust\n\nPeople + AI = unstoppable.`
    hashtags = '#TeamBuilding #WorkCulture #HRTech #StartupIndia #CEOAI #Leadership #AIForHR #EmployeeFirst #IndiaStartup #FutureOfWork'
    cta     = 'Build your AI-powered team → Link in bio'
  } else if (isProduct) {
    emoji   = '🆕'
    theme   = 'Product Launch'
    caption = `Something big just dropped. 🚀\n\n${topicHint.charAt(0).toUpperCase() + topicHint.slice(1)} is now live.\n\n✨ Built for Indian founders\n⚡ Setup in under 10 minutes\n🎯 ${firstNum} improvement in your first week\n\nWe've been working on this for months. Worth every second.`
    hashtags = '#ProductLaunch #NewFeature #StartupIndia #CEOAI #TechLaunch #IndiaStartup #Innovation #AIProduct #MakeInIndia #Founder'
    cta     = 'Try it free today → Link in bio 🚀'
  } else if (isAwareness || isMotivational) {
    emoji   = '💫'
    theme   = 'Brand Story'
    caption = `Every big company started small.\n\nOur story:\n📍 Started with: ${topicHint}\n😤 Problem: Manual decisions, slow growth\n💡 Solution: CEO AI — your executive team in the cloud\n🚀 Result: ${firstNum} growth in 90 days\n\nYour story can be next. 🙌`
    hashtags = '#BrandStory #StartupJourney #Entrepreneur #CEOAI #IndiaStartup #FounderLife #Motivation #StartupIndia #AIForBusiness #GrowthMindset'
    cta     = 'Start your AI journey → Link in bio'
  } else if (isTech) {
    emoji   = '🤖'
    theme   = 'Tech & AI'
    caption = `AI isn't the future anymore — it's the present.\n\n${topicHint.charAt(0).toUpperCase() + topicHint.slice(1)} is being transformed by AI right now.\n\n🤖 Agents that work while you sleep\n📊 Real-time intelligence at every level\n⚡ ${firstNum} faster execution\n\nAre you building with AI or falling behind?`
    hashtags = '#ArtificialIntelligence #AIAgents #TechStartup #CEOAI #IndiaAI #DigitalIndia #StartupIndia #AIForBusiness #MakeInIndia #Innovation'
    cta     = 'See CEO AI in action → Link in bio 🤖'
  } else {
    // Generic smart post
    emoji   = '✨'
    theme   = 'Business Insight'
    caption = `${topicHint.charAt(0).toUpperCase() + topicHint.slice(1)}.\n\nHere's why this matters for Indian founders in 2026:\n\n📌 Context is everything\n📊 Data beats gut feel — always\n⚡ The window to act is narrow\n✅ CEO AI helps you move faster\n\nWhat's your take? Drop it in the comments 👇`
    hashtags = '#BusinessInsight #Founder #StartupIndia #CEOAI #Entrepreneur #IndiaStartup #BusinessGrowth #AIForBusiness #Leadership #GrowthMindset'
    cta     = 'Follow for more insights → Link in bio ✨'
  }

  return { emoji, theme, caption, hashtags, cta }
}

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface PostRecord {
  id: string; caption: string; hashtags: string; theme: string; postedOn: string; status: 'posted' | 'pending' | 'skipped'
}

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  post?: GeneratedPost
  timestamp: string
}

function getNextSunday(): string {
  const d = new Date(); const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? 7 : 7 - day))
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const INITIAL_HISTORY: PostRecord[] = [
  { id: 'h1', caption: INSTA_POST_POOL[0].caption, hashtags: INSTA_POST_POOL[0].hashtags, theme: INSTA_POST_POOL[0].theme, postedOn: '2026-06-28', status: 'posted' },
  { id: 'h2', caption: INSTA_POST_POOL[1].caption, hashtags: INSTA_POST_POOL[1].hashtags, theme: INSTA_POST_POOL[1].theme, postedOn: '2026-06-21', status: 'posted' },
]

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export function MarketingPage() {
  // Campaign tab state
  const [audience, setAudience]   = useState('Urban Millennials (25–35)')
  const [budget, setBudget]       = useState('500000')
  const [language, setLanguage]   = useState('English')
  const [isSimulating, setIsSimulating] = useState(false)
  const [output, setOutput] = useState<any>({
    theme:    "India's Digital Growth Partner — Scale with AI",
    channels: 'Instagram Reels & YouTube Shorts (40%), WhatsApp Business Broadcasts (30%), Google UAC / Performance Max (20%), Influencer collabs on Moj & Josh (10%).',
    roi:      'Estimated 3.8× ROI based on India CPM benchmarks (₹80–₹120 per 1000 impressions).',
  })

  // Tab
  const [activeTab, setActiveTab] = useState<'campaign' | 'instagram'>('campaign')

  // Instagram weekly post state
  const [instaEnabled, setInstaEnabled] = useState(true)
  const [postTime, setPostTime]         = useState('10:00')
  const [postDay, setPostDay]           = useState('Sunday')
  const [currentPost, setCurrentPost]   = useState(INSTA_POST_POOL[2])
  const [showApproval, setShowApproval] = useState(true)
  const [history, setHistory]           = useState<PostRecord[]>(INITIAL_HISTORY)
  const [postApproved, setPostApproved] = useState(false)
  const [editCaption, setEditCaption]   = useState(false)
  const [editedCaption, setEditedCaption]   = useState(INSTA_POST_POOL[2].caption)
  const [editedHashtags, setEditedHashtags] = useState(INSTA_POST_POOL[2].hashtags)
  const [copied, setCopied]         = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  // Chat state
  const [chatInput, setChatInput]     = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'ai',
      text: "Hi! 👋 I'm your AI Post Generator. Tell me what you want to post about and I'll create a caption, hashtags, and CTA for your Instagram. Try something like:\n\n• \"Post about our AI product helping startups grow\"\n• \"Promotion for 20% discount this weekend\"\n• \"Motivational post about overcoming business challenges\"",
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setEditedCaption(currentPost.caption); setEditedHashtags(currentPost.hashtags) }, [currentPost])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  // ── Campaign handlers ──
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

  // ── Instagram handlers ──
  const handleApprove = () => {
    setPostApproved(true)
    const record: PostRecord = { id: Date.now().toString(), caption: editCaption ? editedCaption : currentPost.caption, hashtags: editedHashtags, theme: currentPost.theme, postedOn: new Date().toISOString().split('T')[0], status: 'pending' }
    setHistory(prev => [record, ...prev])
    setTimeout(() => setHistory(prev => prev.map(r => r.id === record.id ? { ...r, status: 'posted' } : r)), 2000)
  }

  const handleSkip = () => {
    setHistory(prev => [{ id: Date.now().toString(), caption: currentPost.caption, hashtags: currentPost.hashtags, theme: currentPost.theme, postedOn: new Date().toISOString().split('T')[0], status: 'skipped' }, ...prev])
    setShowApproval(false)
  }

  const handleRegenerate = () => {
    setRegenerating(true)
    setTimeout(() => {
      const pool = INSTA_POST_POOL.filter(p => p.theme !== currentPost.theme)
      setCurrentPost(pool[Math.floor(Math.random() * pool.length)])
      setPostApproved(false); setEditCaption(false); setRegenerating(false); setShowApproval(true)
    }, 1200)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${editCaption ? editedCaption : currentPost.caption}\n\n${editedHashtags}\n\n${currentPost.cta}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  // ── Chat handlers ──
  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isGenerating) return
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
    setChatMessages(prev => [...prev, userMsg])
    const prompt = chatInput
    setChatInput('')
    setIsGenerating(true)

    try {
      const response = await api.post<GeneratedPost>('/marketing/generate-post', {
        prompt: prompt,
      })
      if (response.data) {
        const generated = response.data
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: `Here's your Instagram post for **"${generated.theme}"** — tap **Use This Post** to send it to the approval queue! ✨`,
          post: generated,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        }
        setChatMessages(prev => [...prev, aiMsg])
      } else {
        const generated = generatePostFromPrompt(prompt)
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: `Here's your Instagram post for **"${generated.theme}"** — tap **Use This Post** to send it to the approval queue! ✨`,
          post: generated,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        }
        setChatMessages(prev => [...prev, aiMsg])
      }
    } catch (err) {
      const generated = generatePostFromPrompt(prompt)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: `Here's your Instagram post for **"${generated.theme}"** — tap **Use This Post** to send it to the approval queue! ✨`,
        post: generated,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }
      setChatMessages(prev => [...prev, aiMsg])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUsePost = (post: GeneratedPost) => {
    setCurrentPost(post)
    setPostApproved(false); setEditCaption(false); setShowApproval(true)
    setActiveTab('instagram')
    // Scroll to top gently
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div className="engine-page animate-fade-in" style={{
      '--eng-accent': 'linear-gradient(90deg, #ec4899, #f472b6)',
      '--eng-glow': 'rgba(236, 72, 153, 0.15)',
      '--eng-focus-color': '#f472b6',
      '--eng-focus-ring': 'rgba(236, 72, 153, 0.2)',
      '--eng-btn-bg': 'linear-gradient(135deg, #ec4899, #be185d)',
      '--eng-btn-shadow': 'rgba(236, 72, 153, 0.4)',
      '--eng-chip-bg': 'rgba(236, 72, 153, 0.12)',
      '--eng-chip-color': '#f472b6',
      '--eng-chip-border': 'rgba(236, 72, 153, 0.3)',
    } as React.CSSProperties}>

      <div className="engine-page-header">
        <h2 className="engine-page-title">📣 Marketing Engine</h2>
        <p className="engine-page-subtitle">Design 360° India-first campaigns, auto-schedule Instagram posts, and chat with AI to create content instantly.</p>
      </div>

      {/* Tab Switcher */}
      <div className="mkt-tabs">
        <button className={`mkt-tab ${activeTab === 'campaign' ? 'active' : ''}`} onClick={() => setActiveTab('campaign')}>📢 Campaign Engine</button>
        <button className={`mkt-tab ${activeTab === 'instagram' ? 'active' : ''}`} onClick={() => setActiveTab('instagram')}>
          <span className="insta-tab-icon">📸</span> Instagram Auto-Post
          {showApproval && !postApproved && <span className="mkt-tab-badge">1</span>}
        </button>
      </div>

      {/* ══════════════ CAMPAIGN TAB ══════════════ */}
      {activeTab === 'campaign' && (
        <div className="engine-grid">
          <div className="engine-form-panel">
            <span className="engine-form-panel-title">Campaign Configuration</span>
            <div className="eng-field">
              <label className="eng-label"><span className="eng-label-icon">👥</span>Target Audience</label>
              <div className="eng-select-wrapper"><select className="eng-select" value={audience} onChange={e => setAudience(e.target.value)}>{AUDIENCES.map(a => <option key={a}>{a}</option>)}</select></div>
              <div className="eng-chip-row"><span className="eng-chip">🎯 {audience}</span></div>
            </div>
            <div className="eng-field">
              <label className="eng-label"><span className="eng-label-icon">🗣️</span>Primary Language</label>
              <div className="eng-select-wrapper"><select className="eng-select" value={language} onChange={e => setLanguage(e.target.value)}>{LANGUAGES.map(l => <option key={l}>{l}</option>)}</select></div>
              <div className="eng-chip-row"><span className="eng-chip">🇮🇳 {language}</span></div>
            </div>
            <div className="eng-field">
              <label className="eng-label"><span className="eng-label-icon">💰</span>Campaign Budget (₹)</label>
              <div className="eng-number-wrapper"><span className="eng-number-prefix">₹</span><input type="number" className="eng-input" value={budget} onChange={e => setBudget(e.target.value)} /></div>
              {budget && <div className="eng-chip-row"><span className="eng-chip">₹{parseInt(budget||'0').toLocaleString('en-IN')} budget</span></div>}
            </div>
            <button className={`eng-cta-btn${isSimulating ? ' loading' : ''}`} onClick={handleSimulate} disabled={isSimulating}>
              <span className="eng-cta-btn-inner">{isSimulating ? '⬡ Modelling India Campaign...' : '📣 Generate 360° India Strategy'}</span>
            </button>
          </div>
          <div className="engine-output-panel">
            <div className="engine-output-title">📢 360° India Marketing Recommendations</div>
            {isSimulating ? (
              <div className="engine-loading"><div className="engine-loading-orb">📣</div><span className="engine-loading-text">Analysing India audience profiles…</span></div>
            ) : (
              <div className="engine-result-stack">
                <div className="engine-result-card"><span className="engine-result-label">🎨 Campaign Theme</span><p className="engine-result-value">{output.theme}</p></div>
                <div className="engine-result-card"><span className="engine-result-label">📱 India Channel Mix</span><p className="engine-result-value">{output.channels}</p></div>
                <div className="engine-result-card"><span className="engine-result-label">📈 Projected ROI</span><p className="engine-result-value">{output.roi}</p></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════ INSTAGRAM TAB ══════════════ */}
      {activeTab === 'instagram' && (
        <div className="insta-master-layout">

          {/* ── COL 1: Schedule + History ── */}
          <div className="insta-col-left">
            <div className="insta-schedule-card glass">
              <div className="insta-schedule-header">
                <div className="insta-schedule-icon">📸</div>
                <div><h3 className="insta-schedule-title">Instagram Weekly Auto-Post</h3><p className="insta-schedule-sub">AI generates & schedules one post per week</p></div>
                <div className={`insta-toggle ${instaEnabled ? 'on' : 'off'}`} onClick={() => setInstaEnabled(v => !v)}>
                  <span className="insta-toggle-knob" />
                </div>
              </div>
              {instaEnabled && (
                <div className="insta-schedule-body">
                  <div className="insta-sched-row"><label>📅 Post Day</label>
                    <select className="insta-sched-select" value={postDay} onChange={e => setPostDay(e.target.value)}>
                      {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="insta-sched-row"><label>⏰ Post Time</label><input type="time" className="insta-sched-input" value={postTime} onChange={e => setPostTime(e.target.value)} /></div>
                  <div className="insta-next-post"><span className="insta-next-label">🗓️ Next Post</span><span className="insta-next-val">{getNextSunday()} at {postTime}</span></div>
                  <div className="insta-status-chip"><span className="insta-live-dot" />Auto-posting active — Every {postDay}</div>
                </div>
              )}
              {!instaEnabled && <div className="insta-disabled-notice">Auto-posting is paused. Toggle to re-enable weekly scheduling.</div>}
            </div>

            <div className="insta-history-card glass">
              <h4 className="insta-history-title">📋 Post History</h4>
              <div className="insta-history-list">
                {history.map(h => (
                  <div key={h.id} className={`insta-hist-row ${h.status}`}>
                    <div className="insta-hist-meta"><span className="insta-hist-theme">{h.theme}</span><span className="insta-hist-date">{h.postedOn}</span></div>
                    <span className={`insta-hist-badge ${h.status}`}>{h.status === 'posted' ? '✓ Posted' : h.status === 'pending' ? '⏳ Queued' : '✕ Skipped'}</span>
                  </div>
                ))}
                {history.length === 0 && <p className="insta-hist-empty">No posts yet.</p>}
              </div>
            </div>
          </div>

          {/* ── COL 2: Approval Card ── */}
          <div className="insta-col-mid">
            {showApproval && !postApproved && (
              <div className="insta-approval-card glass">
                <div className="insta-approval-header">
                  <span className="insta-approval-badge"><span className="insta-live-dot" /> This Week's AI Post</span>
                  <span className="insta-approval-theme">{currentPost.theme}</span>
                </div>
                <div className="insta-phone-mockup">
                  <div className="insta-mock-header">
                    <div className="insta-mock-avatar">CA</div>
                    <div className="insta-mock-name"><span>ceo_ai_official</span><span className="insta-mock-sub">CEO AI • Sponsored</span></div>
                    <span className="insta-mock-dots">···</span>
                  </div>
                  <div className="insta-mock-image">
                    <span className="insta-mock-emoji">{currentPost.emoji}</span>
                    <span className="insta-mock-label">CEO AI</span>
                  </div>
                  <div className="insta-mock-actions"><span>🤍</span><span>💬</span><span>📤</span><span style={{marginLeft:'auto'}}>🔖</span></div>
                  <div className="insta-mock-caption">
                    <strong>ceo_ai_official</strong>{' '}{(editCaption ? editedCaption : currentPost.caption).split('\n')[0]}
                    <span className="insta-mock-more"> ...more</span>
                  </div>
                </div>
                <div className="insta-caption-section">
                  <div className="insta-caption-header">
                    <span className="insta-caption-label">✍️ Caption</span>
                    <button className="insta-edit-btn" onClick={() => setEditCaption(v => !v)}>{editCaption ? '👁 Preview' : '✏️ Edit'}</button>
                  </div>
                  {editCaption
                    ? <textarea className="insta-caption-textarea" value={editedCaption} onChange={e => setEditedCaption(e.target.value)} rows={6} />
                    : <p className="insta-caption-text">{currentPost.caption}</p>}
                  <div className="insta-hashtag-section">
                    <span className="insta-caption-label">🏷️ Hashtags</span>
                    <textarea className="insta-hashtag-textarea" value={editedHashtags} onChange={e => setEditedHashtags(e.target.value)} rows={2} />
                  </div>
                  <div className="insta-cta-text"><span className="insta-caption-label">📎 CTA</span><p className="insta-cta-value">{currentPost.cta}</p></div>
                </div>
                <div className="insta-approval-actions">
                  <button className="insta-btn-regen" onClick={handleRegenerate} disabled={regenerating}>{regenerating ? '⏳...' : '🔄 Regenerate'}</button>
                  <button className="insta-btn-copy" onClick={handleCopy}>{copied ? '✓ Copied!' : '📋 Copy'}</button>
                  <button className="insta-btn-skip" onClick={handleSkip}>✕ Skip</button>
                  <button className="insta-btn-approve" onClick={handleApprove}>✓ Approve & Schedule Post</button>
                </div>
              </div>
            )}
            {postApproved && (
              <div className="insta-success-card glass animate-fade-in">
                <div className="insta-success-icon">🎉</div>
                <h3>Post Approved & Scheduled!</h3>
                <p>Your Instagram post has been queued for <strong>{postDay} at {postTime}</strong>.</p>
                <p className="insta-success-sub">CEO AI will publish this automatically. No further action needed.</p>
                <div className="insta-success-detail">
                  <div className="insta-success-row"><span>📅 Scheduled for</span><strong>{getNextSunday()}</strong></div>
                  <div className="insta-success-row"><span>⏰ Post time</span><strong>{postTime} IST</strong></div>
                  <div className="insta-success-row"><span>🎨 Theme</span><strong>{currentPost.theme}</strong></div>
                </div>
                <button className="insta-btn-approve" style={{width:'100%',marginTop:'1rem'}} onClick={() => { handleRegenerate(); setPostApproved(false); setShowApproval(true) }}>✦ Preview Next Week's Post</button>
              </div>
            )}
            {!showApproval && !postApproved && (
              <div className="insta-success-card glass animate-fade-in">
                <div className="insta-success-icon">⏭️</div>
                <h3>Post Skipped</h3>
                <p>This week's post was skipped. CEO AI will generate a fresh post next week.</p>
                <button className="insta-btn-approve" style={{marginTop:'1rem'}} onClick={() => setShowApproval(true)}>↩ Review This Week's Post Again</button>
              </div>
            )}
          </div>

          {/* ── COL 3: AI Post Chat Generator ── */}
          <div className="insta-col-chat">
            <div className="chat-card glass">
              <div className="chat-header">
                <div className="chat-header-left">
                  <div className="chat-avatar-ai">🤖</div>
                  <div>
                    <span className="chat-header-title">AI Post Generator</span>
                    <span className="chat-header-sub">Describe your post → get caption, hashtags & CTA</span>
                  </div>
                </div>
                <div className="chat-online-dot" />
              </div>

              <div className="chat-messages">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`chat-msg ${msg.role}`}>
                    {msg.role === 'ai' && <div className="chat-msg-avatar">🤖</div>}
                    <div className="chat-msg-body">
                      <div className="chat-bubble">
                        <p>{msg.text}</p>
                        {msg.post && (
                          <div className="chat-generated-post">
                            <div className="chat-post-header">
                              <span className="chat-post-emoji">{msg.post.emoji}</span>
                              <span className="chat-post-theme">{msg.post.theme}</span>
                            </div>
                            <div className="chat-post-section">
                              <span className="chat-post-label">✍️ Caption</span>
                              <p className="chat-post-caption">{msg.post.caption}</p>
                            </div>
                            <div className="chat-post-section">
                              <span className="chat-post-label">🏷️ Hashtags</span>
                              <p className="chat-post-hashtags">{msg.post.hashtags}</p>
                            </div>
                            <div className="chat-post-section">
                              <span className="chat-post-label">📎 CTA</span>
                              <p className="chat-post-cta">{msg.post.cta}</p>
                            </div>
                            <button className="chat-use-btn" onClick={() => handleUsePost(msg.post!)}>
                              ✦ Use This Post
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="chat-time">{msg.timestamp}</span>
                    </div>
                    {msg.role === 'user' && <div className="chat-msg-avatar user">You</div>}
                  </div>
                ))}
                {isGenerating && (
                  <div className="chat-msg ai">
                    <div className="chat-msg-avatar">🤖</div>
                    <div className="chat-msg-body">
                      <div className="chat-bubble">
                        <div className="chat-typing"><span /><span /><span /></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form className="chat-input-row" onSubmit={handleChatSend}>
                <input
                  className="chat-input"
                  type="text"
                  placeholder="Describe your post… e.g. 'Post about our AI dashboard saving time'"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  disabled={isGenerating}
                />
                <button className="chat-send-btn" type="submit" disabled={isGenerating || !chatInput.trim()}>
                  {isGenerating ? <span className="chat-spinner" /> : '➤'}
                </button>
              </form>

              <div className="chat-suggestions">
                {[
                  '🚀 Launch announcement post',
                  '💰 20% weekend offer',
                  '📈 Revenue growth story',
                  '🛡️ Risk management tips',
                ].map(s => (
                  <button key={s} className="chat-suggestion-chip" onClick={() => { setChatInput(s); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default MarketingPage

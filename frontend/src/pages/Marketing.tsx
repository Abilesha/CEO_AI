import { useState } from 'react'
import './engine-forms.css'
import './Marketing.css'

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
          broadcasts, regional OTT, and performance-driven growth strategies.
        </p>
      </div>

      <div className="engine-grid">
        {/* Form */}
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

        {/* Output */}
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
    </div>
  )
}

export default MarketingPage

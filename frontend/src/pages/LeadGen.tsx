import { useState } from 'react'
import './LeadGen.css'

export function LeadGenPage() {
  const [leadgenInput, setLeadgenInput] = useState({ platform: 'WhatsApp Campaign', goal: 'Book Demo Meetings' })
  const [leadgenOutput, setLeadgenOutput] = useState<any>({
    outreachHook: 'Hi [Name], we mapped out a demo booking projection report specifically for your business operations. Can I send over the 3-line breakdown?',
    recommendation: 'Run a segmented 3-touch WhatsApp workflow using a soft feedback hook.',
  })
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSimulate = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setLeadgenOutput({
        outreachHook: `Hi [Name]! Based on our recent industry analysis, we highlighted 3 operations leaks in your sector. Here is a custom roadmap to fix it. Do you have 2 min?`,
        recommendation: `Follow up via a structured 3-part automated sequence. Add an interactive CTA link to let leads choose time slots instantly.`,
      })
    }, 1200)
  }

  return (
    <div className="leadgen-page animate-fade-in">
      <div className="leadgen-header">
        <h2 className="leadgen-title">Lead Gen Engine ⚡</h2>
        <p className="leadgen-subtitle">Acquire prospects and convert leads effectively using AI hooks and omnichannel outreach ideas.</p>
      </div>

      <div className="leadgen-grid">
        <div className="leadgen-form-panel glass">
          <h3>Lead Gen Parameters</h3>
          <div className="form-group">
            <label>Outreach Platform</label>
            <select
              className="form-input"
              value={leadgenInput.platform}
              onChange={(e) => setLeadgenInput({ ...leadgenInput, platform: e.target.value })}
            >
              <option value="WhatsApp Campaign">WhatsApp Campaign</option>
              <option value="Email Campaign">Cold Email Sequence</option>
              <option value="LinkedIn InMail Drip">LinkedIn InMail drip</option>
            </select>
          </div>
          <div className="form-group">
            <label>Outreach Goal / CTA</label>
            <input
              type="text"
              className="form-input"
              value={leadgenInput.goal}
              onChange={(e) => setLeadgenInput({ ...leadgenInput, goal: e.target.value })}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            {isSimulating ? 'Generating Outreach Strategy...' : 'Synthesize Campaign Hook'}
          </button>
        </div>

        <div className="leadgen-output-panel glass">
          <h3>⚡ Lead Acquisition & Campaign Plan</h3>
          {isSimulating ? (
            <div className="loading-state">
              <div className="spinner">⬡</div>
              <span>Drafting templates and copy...</span>
            </div>
          ) : (
            <div className="output-content">
              <div className="output-row">
                <strong>Suggested Copy / Hook:</strong>
                <pre className="code-block">{leadgenOutput.outreachHook}</pre>
              </div>
              <div className="output-row">
                <strong>Action Playbook:</strong>
                <p>{leadgenOutput.recommendation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadGenPage

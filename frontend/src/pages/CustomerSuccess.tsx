import { useState } from 'react'
import './CustomerSuccess.css'

interface Message {
  sender: 'user' | 'bot'
  text: string
}

export function CustomerSuccessPage() {
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { sender: 'bot', text: 'Welcome to CEO AI Customer Success portal. I can assist you with CRM configuration, integration setups, or support tickets. How can I help you today?' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const newMsg: Message = { sender: 'user', text: chatInput }
    setChatHistory((prev) => [...prev, newMsg])
    setChatInput('')

    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      let botResponse = "I've recorded that request. Our support system has generated ticket ID #CS-8930 and assigned it to a success manager."
      const text = chatInput.toLowerCase()
      if (text.includes('pricing') || text.includes('upgrade') || text.includes('cost')) {
        botResponse = 'For enterprise upgrades, we can scale your seats to 100+ with private VPC options. Our custom quote will be sent to subasree8606@gmail.com.'
      } else if (text.includes('integration') || text.includes('api') || text.includes('supabase')) {
        botResponse = 'The CEO AI API supports outbound webhooks. Go to settings > API to fetch your development keys.'
      }
      setChatHistory((prev) => [...prev, { sender: 'bot', text: botResponse }])
    }, 1000)
  }

  return (
    <div className="cs-page animate-fade-in">
      <div className="cs-header">
        <h2 className="cs-title">Customer Success Engine 🤝</h2>
        <p className="cs-subtitle">Manage customer tickets, link CRM systems, and test the active AI-powered chatbot co-pilot.</p>
      </div>

      <div className="cs-grid">
        <div className="cs-chat-panel glass">
          <h3>Interactive AI Chatbot Console</h3>
          <div className="chat-window">
            <div className="chat-history">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-bubble-container ${msg.sender}`}>
                  <div className={`chat-bubble ${msg.sender}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSimulating && (
                <div className="chat-bubble-container bot">
                  <div className="chat-bubble bot typing">
                    ● ● ●
                  </div>
                </div>
              )}
            </div>
            <form className="chat-form" onSubmit={handleSendChat}>
              <input
                type="text"
                placeholder="Type message (e.g. 'Integrate with Supabase', 'Enterprise Pricing')..."
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
            <strong>Auto-escalation Threshold:</strong>
            <p>Escalates to human manager if AI confidence drops below 80%.</p>
          </div>
          <div className="integration-row">
            <strong>Current Open Tickets:</strong>
            <p>0 tickets pending (AI resolved 14 tickets today).</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerSuccessPage

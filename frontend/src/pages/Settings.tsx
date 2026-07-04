import { useAppContext } from '@context/AppContext'
import './Settings.css'

export function SettingsPage() {
  const { theme, setTheme } = useAppContext()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="settings animate-fade-in">
      <div className="settings-grid">
        {/* Profile Card */}
        <div className="settings-card glass">
          <h3 className="card-title">Integration & DB Connection</h3>
          <div className="integration-status">
            <div className="status-row">
              <span className="status-label">Supabase Endpoint</span>
              <span className="badge badge-success">● Connected</span>
            </div>
            <div className="status-row">
              <span className="status-label">Backend REST Node</span>
              <span className="badge badge-success">● Active</span>
            </div>
            <div className="status-row">
              <span className="status-label">Environment File</span>
              <span className="status-text font-mono">.env.local loaded</span>
            </div>
          </div>
        </div>

        {/* Model Preferences */}
        <div className="settings-card glass">
          <h3 className="card-title">AI Core Model Profile</h3>
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Default Decision Orchestrator</label>
              <select className="form-select">
                <option>Claude 3.5 Sonnet (Directives & Logic)</option>
                <option>GPT-4o (Operations & Integrations)</option>
                <option>DeepSeek-R1 (Complex Quantitative Logic)</option>
              </select>
            </div>
            <div className="form-group">
              <label>System Temperature (Stiffness)</label>
              <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="form-range" />
              <div className="range-labels">
                <span>Deterministic</span>
                <span>Creative</span>
              </div>
            </div>
          </form>
        </div>

        {/* Platform Settings */}
        <div className="settings-card glass">
          <h3 className="card-title">Platform Preferences</h3>
          <div className="theme-switcher">
            <span className="theme-label">Active Theme Mode: <strong>{theme}</strong></span>
            <button className="btn btn-primary" onClick={toggleTheme}>
              ✦ Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

import { useState, useEffect } from 'react'
import api from '@services/api'
import './Team.css'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'executive' | 'viewer'
  status: 'active' | 'offline'
  avatarUrl?: string
}

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'executive' | 'viewer'>('viewer')
  const [inviteName, setInviteName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fetchTeam = async () => {
    try {
      const response = await api.get<TeamMember[]>('/team')
      if (response.data) {
        setMembers(response.data)
      }
    } catch (err) {
      console.error('Failed to load team roster', err)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim() || !inviteName.trim()) return
    setErrorMsg('')

    try {
      const response = await api.post<TeamMember>('/team', {
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
      })

      if (response.data) {
        setMembers((prev) => [...prev, response.data!])
        setInviteName('')
        setInviteEmail('')
        setInviteRole('viewer')
      } else {
        setErrorMsg(response.error || 'Failed to send roster invite.')
      }
    } catch (err) {
      setErrorMsg('Network error sending invite.')
    }
  }

  return (
    <div className="team animate-fade-in">
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.75rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', width: '100%' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="team-layout">
        {/* Members Grid */}
        <div className="team-list">
          <h3 className="panel-title">Executive Roster</h3>
          <div className="team-grid">
            {members.map((member) => (
              <div key={member.id} className="member-card glass" id={`member-${member.id}`}>
                <div className="member-card__header">
                  <div className="member-avatar">
                    {member.name[0]?.toUpperCase()}
                    <span className={`status-indicator ${member.status}`}></span>
                  </div>
                  <div className="member-meta">
                    <h4 className="member-name">{member.name}</h4>
                    <span className="member-email">{member.email}</span>
                  </div>
                </div>
                <div className="member-card__footer">
                  <span className="badge badge-primary">{member.role}</span>
                  <span className="presence-label">{member.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Sidebar widget */}
        <div className="team-invite glass">
          <h3 className="panel-title">Invite Team Member</h3>
          <form className="invite-form" onSubmit={handleInvite}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="email@ceo.ai"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Roster Role</label>
              <select
                className="form-select"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
              >
                <option value="viewer">Viewer</option>
                <option value="executive">Executive</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary invite-btn">
              + Send Roster Invite
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TeamPage

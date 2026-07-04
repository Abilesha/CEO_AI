import { useState } from 'react'
import './Team.css'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'executive' | 'viewer'
  status: 'active' | 'offline'
  avatarUrl?: string
}

const INITIAL_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Subhasri executive', email: 'subhasri@ceo.ai', role: 'admin', status: 'active' },
  { id: '2', name: 'Alexander Sterling', email: 'alex@ceo.ai', role: 'executive', status: 'active' },
  { id: '3', name: 'Sarah Vance', email: 'sarah@ceo.ai', role: 'executive', status: 'offline' },
  { id: '4', name: 'Michael Coyle', email: 'michael@ceo.ai', role: 'viewer', status: 'offline' },
]

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'executive' | 'viewer'>('viewer')
  const [inviteName, setInviteName] = useState('')

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim() || !inviteName.trim()) return

    const newMember: TeamMember = {
      id: (members.length + 1).toString(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'offline',
    }

    setMembers((prev) => [...prev, newMember])
    setInviteName('')
    setInviteEmail('')
    setInviteRole('viewer')
  }

  return (
    <div className="team animate-fade-in">
      <div className="team-layout">
        {/* Members Grid */}
        <div className="team-list">
          <h3 className="panel-title">Executive Roster</h3>
          <div className="team-grid">
            {members.map((member) => (
              <div key={member.id} className="member-card glass" id={`member-${member.id}`}>
                <div className="member-card__header">
                  <div className="member-avatar">
                    {member.name[0]}
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

import { useState, useEffect } from 'react'
import api from '@services/api'
import './Decisions.css'

interface DecisionItem {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export function DecisionsPage() {
  const [decisions, setDecisions] = useState<DecisionItem[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const fetchDecisions = async () => {
    try {
      const response = await api.get<DecisionItem[]>('/decisions')
      if (response.data) {
        setDecisions(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch decisions', err)
    }
  }

  useEffect(() => {
    fetchDecisions()
  }, [])

  const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setErrorMsg('')
    try {
      const response = await api.patch<DecisionItem>(`/decisions/${id}`, {
        status: newStatus,
      })

      if (response.data) {
        setDecisions((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        )
      } else {
        setErrorMsg(response.error || 'Failed to update decision.')
      }
    } catch (err) {
      setErrorMsg('Network error updating decision status.')
    }
  }

  const columns = [
    { id: 'pending', title: 'Pending Executive Approval', badge: 'badge-primary' },
    { id: 'approved', title: 'Approved & Running', badge: 'badge-success' },
    { id: 'rejected', title: 'Rejected / Shelved', badge: 'badge-danger' },
  ] as const

  return (
    <div className="decisions animate-fade-in">
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.75rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', width: '100%' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="decisions-columns">
        {columns.map((col) => {
          const colItems = decisions.filter((d) => d.status === col.id)
          return (
            <div key={col.id} className="decisions-column glass">
              <div className="col-header">
                <span className={`badge ${col.badge} col-header__badge`}>●</span>
                <h3 className="col-title">{col.title}</h3>
                <span className="col-count">{colItems.length}</span>
              </div>

              <div className="col-content">
                {colItems.map((item) => (
                  <div key={item.id} className="decision-card glass animate-fade-in">
                    <div className="decision-card__top">
                      <span className={`badge badge-${
                        item.impact === 'high' ? 'danger' : item.impact === 'medium' ? 'warning' : 'accent'
                      }`}>
                        {item.impact} impact
                      </span>
                      <span className="decision-card__date">{item.created_at}</span>
                    </div>

                    <h4 className="decision-card__title">{item.title}</h4>
                    <p className="decision-card__desc">{item.description}</p>

                    {item.status === 'pending' && (
                      <div className="decision-card__actions">
                        <button
                          onClick={() => updateStatus(item.id, 'rejected')}
                          className="btn btn-ghost action-btn reject"
                          id={`reject-${item.id}`}
                        >
                          ✕ Reject
                        </button>
                        <button
                          onClick={() => updateStatus(item.id, 'approved')}
                          className="btn btn-primary action-btn approve"
                          id={`approve-${item.id}`}
                        >
                          ✓ Approve
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {colItems.length === 0 && (
                  <div className="column-empty-state">
                    No decisions in this stage.
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DecisionsPage

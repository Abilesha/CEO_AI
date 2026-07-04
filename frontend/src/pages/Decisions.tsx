import { useState } from 'react'
import './Decisions.css'

interface DecisionItem {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const INITIAL_DECISONS: DecisionItem[] = [
  {
    id: 'dec-1',
    title: 'Diversify Component Assembly to APAC-B',
    description: 'Move 35% of parts staging to Vietnam base to bypass upcoming regional tariff adjustments.',
    impact: 'high',
    status: 'pending',
    created_at: '2026-07-04',
  },
  {
    id: 'dec-2',
    title: 'Deprecate API Legacy Cluster V1',
    description: 'Sunset the REST pipeline build v1.4.1. Estimated token savings: 18%.',
    impact: 'medium',
    status: 'pending',
    created_at: '2026-07-04',
  },
  {
    id: 'dec-3',
    title: 'Approve Cloud Infrastructure Expansion',
    description: 'Provision an additional multi-region cluster for database replication.',
    impact: 'high',
    status: 'approved',
    created_at: '2026-07-02',
  },
  {
    id: 'dec-4',
    title: 'Ad-hoc Social Campaign Launch',
    description: 'Deploy auto-generated AI advertising campaign across digital media.',
    impact: 'low',
    status: 'rejected',
    created_at: '2026-06-30',
  },
]

export function DecisionsPage() {
  const [decisions, setDecisions] = useState<DecisionItem[]>(INITIAL_DECISONS)

  const updateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setDecisions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )
  }

  const columns = [
    { id: 'pending', title: 'Pending Executive Approval', badge: 'badge-primary' },
    { id: 'approved', title: 'Approved & Running', badge: 'badge-success' },
    { id: 'rejected', title: 'Rejected / Shelved', badge: 'badge-danger' },
  ] as const

  return (
    <div className="decisions animate-fade-in">
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

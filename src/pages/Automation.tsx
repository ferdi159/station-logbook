import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../db'
import { STATION_LABELS, EFFORT_LABELS, BENEFIT_LABELS, STATUS_LABELS, STATION_COLORS, type EffortLevel, type BenefitLevel, getPriorityLabel, getPriorityColor } from '../types'
import { StationBadge } from '../components/StationBadge'
import { Trash2, ChevronRight, Plus, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function Automation() {
  const navigate = useNavigate()
  const [showMatrix, setShowMatrix] = useState(false)
  const items = useLiveQuery(() => db.automationIdeas.orderBy('priority').reverse().toArray()) ?? []

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Idee wirklich löschen?')) {
      await db.automationIdeas.delete(id)
      toast.success('Gelöscht')
    }
  }

  const effortMap: Record<EffortLevel, number> = { klein: 1, mittel: 2, gross: 3 }
  const benefitMap: Record<BenefitLevel, number> = { gering: 1, mittel: 2, hoch: 3 }

  const chartData = items.map(item => ({
    x: effortMap[item.effort],
    y: benefitMap[item.benefit],
    name: item.name,
    station: item.station,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Automatisierung</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowMatrix(m => !m)} className={`p-2 rounded-xl border border-[var(--color-border)] ${showMatrix ? 'bg-blue-500/15 text-blue-500' : 'text-[var(--color-text-secondary)]'}`}>
            <BarChart3 size={20} />
          </button>
          <button onClick={() => navigate('/automation/new')} className="p-2 rounded-xl bg-blue-500 text-white active:scale-95">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Effort/Benefit Matrix */}
      {showMatrix && items.length > 0 && (
        <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)]">
          <h2 className="font-semibold mb-3">Aufwand-Nutzen-Matrix</h2>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
              <XAxis
                type="number"
                dataKey="x"
                domain={[0.5, 3.5]}
                ticks={[1, 2, 3]}
                tickFormatter={v => ['', 'Klein', 'Mittel', 'Groß'][v] ?? ''}
                label={{ value: 'Aufwand →', position: 'bottom', offset: 10, style: { fill: 'var(--color-text-secondary)', fontSize: 12 } }}
                stroke="var(--color-border)"
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={[0.5, 3.5]}
                ticks={[1, 2, 3]}
                tickFormatter={v => ['', 'Gering', 'Mittel', 'Hoch'][v] ?? ''}
                label={{ value: 'Nutzen →', angle: -90, position: 'insideLeft', offset: 0, style: { fill: 'var(--color-text-secondary)', fontSize: 12 } }}
                stroke="var(--color-border)"
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null
                  const d = payload[0].payload as (typeof chartData)[number]
                  return (
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm shadow-lg">
                      <p className="font-medium">{d.name}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{STATION_LABELS[d.station]}</p>
                    </div>
                  )
                }}
              />
              <Scatter data={chartData}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={STATION_COLORS[entry.station]} r={8} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-2 p-2 rounded-lg bg-green-500/10 text-green-400 text-xs text-center">
            Oben-Links = Top-Priorität (hoher Nutzen, kleiner Aufwand)
          </div>
        </div>
      )}

      {/* Status summary */}
      {items.length > 0 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {(Object.entries(STATUS_LABELS) as [string, string][]).map(([key, label]) => {
            const count = items.filter(i => i.status === key).length
            return (
              <span key={key} className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] shrink-0">
                {label}: {count}
              </span>
            )
          })}
        </div>
      )}

      {/* Items */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          <p>Noch keine Automatisierungsideen.</p>
          <button onClick={() => navigate('/automation/new')} className="mt-2 text-blue-500 font-medium">Erste Idee erfassen</button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(`/automation/${item.id}`)}
              className="w-full text-left bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] active:scale-[0.99] flex items-center gap-3 group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <StationBadge station={item.station} />
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Aufwand: {EFFORT_LABELS[item.effort]} · Nutzen: {BENEFIT_LABELS[item.benefit]}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-secondary)]">{STATUS_LABELS[item.status]}</span>
                  <span className={`text-xs font-bold ${getPriorityColor(item.priority)}`}>Priorität: {getPriorityLabel(item.priority)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={e => handleDelete(item.id!, e)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-400">
                  <Trash2 size={16} />
                </button>
                <ChevronRight size={18} className="text-[var(--color-text-secondary)]" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

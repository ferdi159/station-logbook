import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { STATION_LABELS, STATION_COLORS, type Station, getPriorityLabel } from '../types'
import { StationBadge } from '../components/StationBadge'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Zap, Users, Lightbulb, HelpCircle, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

export function Dashboard() {
  const navigate = useNavigate()
  const logs = useLiveQuery(() => db.logEntries.orderBy('createdAt').reverse().toArray()) ?? []
  const automations = useLiveQuery(() => db.automationIdeas.toArray()) ?? []
  const contacts = useLiveQuery(() => db.contacts.toArray()) ?? []
  const lessons = useLiveQuery(() => db.lessonsLearned.toArray()) ?? []

  const stationCounts = (['fertigung', 'montage', 'konstruktion', 'projektmanagement'] as Station[]).map(s => ({
    station: s,
    count: logs.filter(l => l.station === s).length,
  }))

  const openQuestions = logs.filter(l => l.openQuestions.trim()).flatMap(l =>
    l.openQuestions.split('\n').filter(q => q.trim()).map(q => ({ question: q.trim(), date: l.date, station: l.station }))
  )

  const topAutomations = [...automations].sort((a, b) => b.priority - a.priority).slice(0, 3)
  const recentLogs = logs.slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: BookOpen, label: 'Einträge', value: logs.length, color: 'text-blue-500', onClick: () => navigate('/logbook') },
          { icon: Zap, label: 'Automatisierungen', value: automations.length, color: 'text-orange-500', onClick: () => navigate('/automation') },
          { icon: Users, label: 'Kontakte', value: contacts.length, color: 'text-green-500', onClick: () => navigate('/contacts') },
          { icon: Lightbulb, label: 'Lessons', value: lessons.length, color: 'text-purple-500', onClick: () => navigate('/lessons') },
        ].map(({ icon: Icon, label, value, color, onClick }) => (
          <button key={label} onClick={onClick} className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] text-left hover:bg-[var(--color-surface-hover)] active:scale-[0.98]">
            <Icon size={24} className={color} />
            <div className="text-2xl font-bold mt-2">{value}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">{label}</div>
          </button>
        ))}
      </div>

      {/* Station distribution */}
      <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)]">
        <h2 className="font-semibold mb-3">Einträge pro Station</h2>
        <div className="space-y-2">
          {stationCounts.map(({ station, count }) => (
            <div key={station} className="flex items-center gap-3">
              <span className="text-sm w-28 shrink-0 text-[var(--color-text-secondary)]">{STATION_LABELS[station]}</span>
              <div className="flex-1 h-6 bg-[var(--color-bg)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2"
                  style={{
                    width: logs.length ? `${Math.max((count / logs.length) * 100, count > 0 ? 12 : 0)}%` : '0%',
                    backgroundColor: STATION_COLORS[station],
                  }}
                >
                  {count > 0 && <span className="text-xs font-bold text-white">{count}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent entries */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)]">
          <h2 className="font-semibold mb-3">Letzte Einträge</h2>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">Noch keine Einträge. Erstelle deinen ersten!</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map(log => (
                <button
                  key={log.id}
                  onClick={() => navigate(`/logbook/${log.id}`)}
                  className="w-full text-left p-3 rounded-xl hover:bg-[var(--color-surface-hover)] active:scale-[0.99] flex items-start gap-3"
                >
                  <CalendarDays size={16} className="text-[var(--color-text-secondary)] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{format(new Date(log.date), 'dd. MMM', { locale: de })}</span>
                      <StationBadge station={log.station} />
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">{log.learned}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Open questions */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-semibold">Offene Fragen</h2>
            <span className="text-xs bg-yellow-500/15 text-yellow-500 px-2 py-0.5 rounded-full font-medium">{openQuestions.length}</span>
          </div>
          {openQuestions.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">Keine offenen Fragen.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
              {openQuestions.slice(0, 10).map((q, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg">
                  <HelpCircle size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm">{q.question}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{q.date} · {STATION_LABELS[q.station]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top automation ideas */}
      {topAutomations.length > 0 && (
        <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)]">
          <h2 className="font-semibold mb-3">Top Automatisierungsideen</h2>
          <div className="space-y-2">
            {topAutomations.map(a => (
              <button
                key={a.id}
                onClick={() => navigate(`/automation/${a.id}`)}
                className="w-full text-left p-3 rounded-xl hover:bg-[var(--color-surface-hover)] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StationBadge station={a.station} />
                    <span className="text-xs text-[var(--color-text-secondary)]">{a.status}</span>
                  </div>
                </div>
                <span className={`text-sm font-bold ${a.priority >= 6 ? 'text-green-400' : a.priority >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {getPriorityLabel(a.priority)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

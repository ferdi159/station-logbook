import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../db'
import { STATION_LABELS, type Station } from '../types'
import { StationBadge } from '../components/StationBadge'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Trash2, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

export function Logbook() {
  const navigate = useNavigate()
  const [stationFilter, setStationFilter] = useState<Station | ''>('')
  const logs = useLiveQuery(
    () => {
      let col = db.logEntries.orderBy('date').reverse()
      return col.toArray()
    }
  ) ?? []

  const filtered = stationFilter ? logs.filter(l => l.station === stationFilter) : logs

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Eintrag wirklich löschen?')) {
      await db.logEntries.delete(id)
      toast.success('Eintrag gelöscht')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Logbuch</h1>
        <span className="text-sm text-[var(--color-text-secondary)]">{filtered.length} Einträge</span>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          onClick={() => setStationFilter('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium shrink-0 ${!stationFilter ? 'bg-blue-500 text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'}`}
        >
          Alle
        </button>
        {(Object.entries(STATION_LABELS) as [Station, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStationFilter(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium shrink-0 ${stationFilter === key ? 'bg-blue-500 text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          <p>Noch keine Einträge.</p>
          <button onClick={() => navigate('/logbook/new')} className="mt-2 text-blue-500 font-medium">Ersten Eintrag erstellen</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(log => (
            <button
              key={log.id}
              onClick={() => navigate(`/logbook/${log.id}`)}
              className="w-full text-left bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] active:scale-[0.99] flex items-start gap-3 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-semibold text-sm">{format(new Date(log.date), 'EEEE, dd. MMMM yyyy', { locale: de })}</span>
                  <StationBadge station={log.station} />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-2">{log.learned}</p>
                {log.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {log.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg)] text-[var(--color-text-secondary)]">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={e => handleDelete(log.id!, e)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-400">
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

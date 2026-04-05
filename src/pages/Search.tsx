import { useState, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db } from '../db'
import { STATION_LABELS, LESSON_CATEGORY_LABELS, STATUS_LABELS } from '../types'
import { StationBadge } from '../components/StationBadge'
import { Search as SearchIcon, ArrowLeft, BookOpen, Zap, Users, Lightbulb } from 'lucide-react'

type ResultType = 'log' | 'automation' | 'contact' | 'lesson'

interface SearchResult {
  type: ResultType
  id: number
  title: string
  subtitle: string
  station: string
  path: string
}

export function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const logs = useLiveQuery(() => db.logEntries.toArray()) ?? []
  const automations = useLiveQuery(() => db.automationIdeas.toArray()) ?? []
  const contacts = useLiveQuery(() => db.contacts.toArray()) ?? []
  const lessons = useLiveQuery(() => db.lessonsLearned.toArray()) ?? []

  const results = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []

    const matches: SearchResult[] = []

    for (const log of logs) {
      const searchable = [log.learned, log.people, log.problems, log.ideas, log.openQuestions, ...log.tags].join(' ').toLowerCase()
      if (searchable.includes(q)) {
        matches.push({
          type: 'log',
          id: log.id!,
          title: log.date,
          subtitle: log.learned.slice(0, 100),
          station: log.station,
          path: `/logbook/${log.id}`,
        })
      }
    }

    for (const a of automations) {
      const searchable = [a.name, a.currentProcess, a.whyAutomatable, a.automationIdea].join(' ').toLowerCase()
      if (searchable.includes(q)) {
        matches.push({
          type: 'automation',
          id: a.id!,
          title: a.name,
          subtitle: `${STATUS_LABELS[a.status]} · ${a.automationIdea.slice(0, 80)}`,
          station: a.station,
          path: `/automation/${a.id}`,
        })
      }
    }

    for (const c of contacts) {
      const searchable = [c.name, c.role, c.notes, c.contactInfo].join(' ').toLowerCase()
      if (searchable.includes(q)) {
        matches.push({
          type: 'contact',
          id: c.id!,
          title: c.name,
          subtitle: c.role || STATION_LABELS[c.station],
          station: c.station,
          path: `/contacts/${c.id}`,
        })
      }
    }

    for (const l of lessons) {
      const searchable = [l.title, l.content].join(' ').toLowerCase()
      if (searchable.includes(q)) {
        matches.push({
          type: 'lesson',
          id: l.id!,
          title: l.title,
          subtitle: `${LESSON_CATEGORY_LABELS[l.category]} · ${l.content.slice(0, 80)}`,
          station: l.station,
          path: `/lessons/${l.id}`,
        })
      }
    }

    return matches
  }, [query, logs, automations, contacts, lessons])

  const typeIcon = { log: BookOpen, automation: Zap, contact: Users, lesson: Lightbulb }
  const typeLabel = { log: 'Logbuch', automation: 'Automatisierung', contact: 'Kontakt', lesson: 'Lesson' }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-[var(--color-surface-hover)] active:scale-95">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">Suche</h1>
      </div>

      <div className="relative">
        <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Suche in allen Bereichen..."
          autoFocus
          className="w-full pl-10 pr-3 py-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      {query && (
        <p className="text-sm text-[var(--color-text-secondary)]">{results.length} Ergebnis{results.length !== 1 ? 'se' : ''}</p>
      )}

      <div className="space-y-2">
        {results.map(r => {
          const Icon = typeIcon[r.type]
          return (
            <button
              key={`${r.type}-${r.id}`}
              onClick={() => navigate(r.path)}
              className="w-full text-left bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] active:scale-[0.99] flex items-start gap-3"
            >
              <Icon size={18} className="text-[var(--color-text-secondary)] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-secondary)]">{typeLabel[r.type]}</span>
                  <StationBadge station={r.station as any} />
                </div>
                <p className="font-medium text-sm">{r.title}</p>
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mt-0.5">{r.subtitle}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

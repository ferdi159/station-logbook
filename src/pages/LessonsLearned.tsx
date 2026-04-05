import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../db'
import { LESSON_CATEGORY_LABELS, type LessonCategory } from '../types'
import { StationBadge } from '../components/StationBadge'
import { Trash2, ChevronRight, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export function LessonsLearned() {
  const navigate = useNavigate()
  const [catFilter, setCatFilter] = useState<LessonCategory | ''>('')
  const lessons = useLiveQuery(() => db.lessonsLearned.orderBy('createdAt').reverse().toArray()) ?? []

  const filtered = catFilter ? lessons.filter(l => l.category === catFilter) : lessons

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Lesson wirklich löschen?')) {
      await db.lessonsLearned.delete(id)
      toast.success('Gelöscht')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lessons Learned</h1>
        <button onClick={() => navigate('/lessons/new')} className="p-2 rounded-xl bg-blue-500 text-white active:scale-95">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button onClick={() => setCatFilter('')} className={`px-3 py-1.5 rounded-full text-sm font-medium shrink-0 ${!catFilter ? 'bg-blue-500 text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'}`}>
          Alle
        </button>
        {(Object.entries(LESSON_CATEGORY_LABELS) as [LessonCategory, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setCatFilter(key)} className={`px-3 py-1.5 rounded-full text-sm font-medium shrink-0 ${catFilter === key ? 'bg-blue-500 text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          <p>Noch keine Lessons Learned.</p>
          <button onClick={() => navigate('/lessons/new')} className="mt-2 text-blue-500 font-medium">Erste Lesson erfassen</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(lesson => (
            <button
              key={lesson.id}
              onClick={() => navigate(`/lessons/${lesson.id}`)}
              className="w-full text-left bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] active:scale-[0.99] flex items-start gap-3 group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{lesson.title}</p>
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mt-1">{lesson.content}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <StationBadge station={lesson.station} />
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-text-secondary)]">{LESSON_CATEGORY_LABELS[lesson.category]}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={e => handleDelete(lesson.id!, e)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-400">
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

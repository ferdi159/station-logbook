import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../db'
import { STATION_LABELS, LESSON_CATEGORY_LABELS, type Station, type LessonCategory, type LessonLearned } from '../types'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyLesson: Omit<LessonLearned, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  content: '',
  category: 'prozess',
  station: 'fertigung',
  linkedLogEntryIds: [],
}

export function LessonForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form, setForm] = useState(emptyLesson)

  useEffect(() => {
    if (id) {
      db.lessonsLearned.get(Number(id)).then(l => {
        if (l) {
          const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = l
          setForm(rest)
        }
      })
    }
  }, [id])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const save = async () => {
    if (!form.title.trim()) {
      toast.error('Bitte Titel angeben')
      return
    }
    const now = Date.now()
    if (isEdit) {
      await db.lessonsLearned.update(Number(id), { ...form, updatedAt: now })
      toast.success('Lesson aktualisiert')
    } else {
      await db.lessonsLearned.add({ ...form, createdAt: now, updatedAt: now })
      toast.success('Lesson erstellt')
    }
    navigate('/lessons')
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
  const labelClass = 'block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]'

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/lessons')} className="p-2 rounded-xl hover:bg-[var(--color-surface-hover)] active:scale-95">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">{isEdit ? 'Lesson bearbeiten' : 'Neue Lesson Learned'}</h1>
      </div>

      <div>
        <label className={labelClass}>Titel *</label>
        <input value={form.title} onChange={e => set('title', e.target.value)} className={inputClass} placeholder="z.B. Immer Feuchtigkeit messen vor dem Verleimen" />
      </div>

      <div>
        <label className={labelClass}>Erkenntnis</label>
        <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={5} className={inputClass} placeholder="Beschreibe die Lesson im Detail..." />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Kategorie</label>
          <select value={form.category} onChange={e => set('category', e.target.value as LessonCategory)} className={inputClass}>
            {(Object.entries(LESSON_CATEGORY_LABELS) as [LessonCategory, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Station</label>
          <select value={form.station} onChange={e => set('station', e.target.value as Station)} className={inputClass}>
            {(Object.entries(STATION_LABELS) as [Station, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <button onClick={save} className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-blue-600">
        <Save size={18} />
        {isEdit ? 'Speichern' : 'Lesson erstellen'}
      </button>
    </div>
  )
}

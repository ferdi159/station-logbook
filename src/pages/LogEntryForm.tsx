import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../db'
import { STATION_LABELS, type Station, type LogEntry } from '../types'
import { TagInput } from '../components/TagInput'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const emptyEntry: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'> = {
  date: format(new Date(), 'yyyy-MM-dd'),
  station: 'fertigung',
  learned: '',
  people: '',
  problems: '',
  ideas: '',
  openQuestions: '',
  tags: [],
}

export function LogEntryForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form, setForm] = useState(emptyEntry)

  useEffect(() => {
    if (id) {
      db.logEntries.get(Number(id)).then(entry => {
        if (entry) {
          const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = entry
          setForm(rest)
        }
      })
    }
  }, [id])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const save = async () => {
    if (!form.learned.trim()) {
      toast.error('Bitte beschreibe was du gelernt hast')
      return
    }
    const now = Date.now()
    if (isEdit) {
      await db.logEntries.update(Number(id), { ...form, updatedAt: now })
      toast.success('Eintrag aktualisiert')
    } else {
      await db.logEntries.add({ ...form, createdAt: now, updatedAt: now })
      toast.success('Eintrag erstellt')
    }

    // Auto-add contacts mentioned in people field
    if (form.people.trim()) {
      const names = form.people.split(/[,;\n]/).map(n => n.trim()).filter(Boolean)
      for (const name of names) {
        const existing = await db.contacts.where('name').equalsIgnoreCase(name).first()
        if (!existing) {
          await db.contacts.add({
            name,
            station: form.station,
            role: '',
            contactInfo: '',
            notes: `Erwähnt im Logbuch am ${form.date}`,
            createdAt: now,
            updatedAt: now,
          })
        }
      }
    }

    navigate('/logbook')
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
  const labelClass = 'block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]'

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/logbook')} className="p-2 rounded-xl hover:bg-[var(--color-surface-hover)] active:scale-95">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">{isEdit ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Datum</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Station</label>
          <select value={form.station} onChange={e => set('station', e.target.value as Station)} className={inputClass}>
            {(Object.entries(STATION_LABELS) as [Station, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Was habe ich heute gelernt? *</label>
        <textarea value={form.learned} onChange={e => set('learned', e.target.value)} rows={4} className={inputClass} placeholder="Beschreibe deine Learnings..." />
      </div>

      <div>
        <label className={labelClass}>Beteiligte Personen / Ansprechpartner</label>
        <input value={form.people} onChange={e => set('people', e.target.value)} className={inputClass} placeholder="Namen mit Komma getrennt..." />
      </div>

      <div>
        <label className={labelClass}>Probleme / Engpässe beobachtet</label>
        <textarea value={form.problems} onChange={e => set('problems', e.target.value)} rows={3} className={inputClass} placeholder="Welche Probleme sind dir aufgefallen?" />
      </div>

      <div>
        <label className={labelClass}>Eigene Ideen / Verbesserungsvorschläge</label>
        <textarea value={form.ideas} onChange={e => set('ideas', e.target.value)} rows={3} className={inputClass} placeholder="Deine Ideen und Vorschläge..." />
      </div>

      <div>
        <label className={labelClass}>Offene Fragen</label>
        <textarea value={form.openQuestions} onChange={e => set('openQuestions', e.target.value)} rows={2} className={inputClass} placeholder="Was musst du noch klären?" />
      </div>

      <div>
        <label className={labelClass}>Tags</label>
        <TagInput selected={form.tags} onChange={tags => set('tags', tags)} />
      </div>

      <button onClick={save} className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-blue-600">
        <Save size={18} />
        {isEdit ? 'Speichern' : 'Eintrag erstellen'}
      </button>
    </div>
  )
}

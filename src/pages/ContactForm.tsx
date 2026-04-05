import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../db'
import { STATION_LABELS, type Station, type Contact } from '../types'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  station: 'fertigung',
  role: '',
  contactInfo: '',
  notes: '',
}

export function ContactForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form, setForm] = useState(emptyContact)

  useEffect(() => {
    if (id) {
      db.contacts.get(Number(id)).then(c => {
        if (c) {
          const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = c
          setForm(rest)
        }
      })
    }
  }, [id])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Bitte Namen angeben')
      return
    }
    const now = Date.now()
    if (isEdit) {
      await db.contacts.update(Number(id), { ...form, updatedAt: now })
      toast.success('Kontakt aktualisiert')
    } else {
      await db.contacts.add({ ...form, createdAt: now, updatedAt: now })
      toast.success('Kontakt erstellt')
    }
    navigate('/contacts')
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
  const labelClass = 'block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]'

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/contacts')} className="p-2 rounded-xl hover:bg-[var(--color-surface-hover)] active:scale-95">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">{isEdit ? 'Kontakt bearbeiten' : 'Neuer Kontakt'}</h1>
      </div>

      <div>
        <label className={labelClass}>Name *</label>
        <input value={form.name} onChange={e => set('name', e.target.value)} className={inputClass} placeholder="Vor- und Nachname" />
      </div>

      <div>
        <label className={labelClass}>Abteilung / Station</label>
        <select value={form.station} onChange={e => set('station', e.target.value as Station)} className={inputClass}>
          {(Object.entries(STATION_LABELS) as [Station, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Zuständigkeit / Rolle</label>
        <input value={form.role} onChange={e => set('role', e.target.value)} className={inputClass} placeholder="z.B. CNC-Programmierer, Teamleiter..." />
      </div>

      <div>
        <label className={labelClass}>Kontaktinfo</label>
        <input value={form.contactInfo} onChange={e => set('contactInfo', e.target.value)} className={inputClass} placeholder="Telefon, E-Mail..." />
      </div>

      <div>
        <label className={labelClass}>Notizen</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} className={inputClass} placeholder="Besonderheiten, Zuständigkeiten..." />
      </div>

      <button onClick={save} className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-blue-600">
        <Save size={18} />
        {isEdit ? 'Speichern' : 'Kontakt erstellen'}
      </button>
    </div>
  )
}

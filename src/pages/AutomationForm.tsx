import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../db'
import { STATION_LABELS, EFFORT_LABELS, BENEFIT_LABELS, STATUS_LABELS, calculatePriority, type Station, type EffortLevel, type BenefitLevel, type AutomationStatus, type AutomationIdea } from '../types'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'

const emptyIdea: Omit<AutomationIdea, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  station: 'fertigung',
  currentProcess: '',
  whyAutomatable: '',
  automationIdea: '',
  effort: 'mittel',
  benefit: 'mittel',
  priority: calculatePriority('mittel', 'mittel'),
  status: 'idee',
}

export function AutomationForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form, setForm] = useState(emptyIdea)

  useEffect(() => {
    if (id) {
      db.automationIdeas.get(Number(id)).then(item => {
        if (item) {
          const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = item
          setForm(rest)
        }
      })
    }
  }, [id])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'effort' || key === 'benefit') {
        next.priority = calculatePriority(
          key === 'effort' ? (value as EffortLevel) : prev.effort,
          key === 'benefit' ? (value as BenefitLevel) : prev.benefit
        )
      }
      return next
    })
  }

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Bitte Prozessname angeben')
      return
    }
    const now = Date.now()
    if (isEdit) {
      await db.automationIdeas.update(Number(id), { ...form, updatedAt: now })
      toast.success('Aktualisiert')
    } else {
      await db.automationIdeas.add({ ...form, createdAt: now, updatedAt: now })
      toast.success('Idee erstellt')
    }
    navigate('/automation')
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500'
  const labelClass = 'block text-sm font-medium mb-1.5 text-[var(--color-text-secondary)]'

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/automation')} className="p-2 rounded-xl hover:bg-[var(--color-surface-hover)] active:scale-95">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">{isEdit ? 'Idee bearbeiten' : 'Neue Automatisierungsidee'}</h1>
      </div>

      <div>
        <label className={labelClass}>Prozessname *</label>
        <input value={form.name} onChange={e => set('name', e.target.value)} className={inputClass} placeholder="z.B. Stücklisten-Abgleich" />
      </div>

      <div>
        <label className={labelClass}>Station</label>
        <select value={form.station} onChange={e => set('station', e.target.value as Station)} className={inputClass}>
          {(Object.entries(STATION_LABELS) as [Station, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div>
        <label className={labelClass}>Aktueller Ablauf (Ist-Zustand)</label>
        <textarea value={form.currentProcess} onChange={e => set('currentProcess', e.target.value)} rows={3} className={inputClass} placeholder="Wie wird es aktuell gemacht?" />
      </div>

      <div>
        <label className={labelClass}>Warum automatisierbar?</label>
        <textarea value={form.whyAutomatable} onChange={e => set('whyAutomatable', e.target.value)} rows={3} className={inputClass} placeholder="Was ist repetitiv, fehleranfällig, zeitintensiv?" />
      </div>

      <div>
        <label className={labelClass}>Automatisierungsidee</label>
        <textarea value={form.automationIdea} onChange={e => set('automationIdea', e.target.value)} rows={3} className={inputClass} placeholder="Wie könnte man es lösen? (RPA, Script, Tool...)" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Aufwand</label>
          <select value={form.effort} onChange={e => set('effort', e.target.value as EffortLevel)} className={inputClass}>
            {(Object.entries(EFFORT_LABELS) as [EffortLevel, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Nutzen</label>
          <select value={form.benefit} onChange={e => set('benefit', e.target.value as BenefitLevel)} className={inputClass}>
            {(Object.entries(BENEFIT_LABELS) as [BenefitLevel, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value as AutomationStatus)} className={inputClass}>
            {(Object.entries(STATUS_LABELS) as [AutomationStatus, string][]).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className={`p-3 rounded-xl text-center text-sm font-medium ${form.priority >= 6 ? 'bg-green-500/15 text-green-400' : form.priority >= 4 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'}`}>
        Berechnete Priorität: {form.priority >= 6 ? 'Top' : form.priority >= 4 ? 'Mittel' : 'Niedrig'} ({form.priority}/9)
      </div>

      <button onClick={save} className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-blue-600">
        <Save size={18} />
        {isEdit ? 'Speichern' : 'Idee erstellen'}
      </button>
    </div>
  )
}

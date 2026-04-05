import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../db'
import { STATION_LABELS, type Station } from '../types'
import { StationBadge } from '../components/StationBadge'
import { Trash2, ChevronRight, Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export function Contacts() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [stationFilter, setStationFilter] = useState<Station | ''>('')
  const contacts = useLiveQuery(() => db.contacts.orderBy('name').toArray()) ?? []

  const filtered = contacts
    .filter(c => !stationFilter || c.station === stationFilter)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Kontakt wirklich löschen?')) {
      await db.contacts.delete(id)
      toast.success('Kontakt gelöscht')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kontakte</h1>
        <button onClick={() => navigate('/contacts/new')} className="p-2 rounded-xl bg-blue-500 text-white active:scale-95">
          <Plus size={20} />
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Kontakt suchen..."
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button onClick={() => setStationFilter('')} className={`px-3 py-1.5 rounded-full text-sm font-medium shrink-0 ${!stationFilter ? 'bg-blue-500 text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'}`}>
          Alle
        </button>
        {(Object.entries(STATION_LABELS) as [Station, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setStationFilter(key)} className={`px-3 py-1.5 rounded-full text-sm font-medium shrink-0 ${stationFilter === key ? 'bg-blue-500 text-white' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          <p>{contacts.length === 0 ? 'Noch keine Kontakte.' : 'Keine Treffer.'}</p>
          {contacts.length === 0 && <button onClick={() => navigate('/contacts/new')} className="mt-2 text-blue-500 font-medium">Ersten Kontakt anlegen</button>}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(contact => (
            <button
              key={contact.id}
              onClick={() => navigate(`/contacts/${contact.id}`)}
              className="w-full text-left bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] active:scale-[0.99] flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/15 text-blue-500 flex items-center justify-center text-sm font-bold shrink-0">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{contact.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StationBadge station={contact.station} />
                  {contact.role && <span className="text-xs text-[var(--color-text-secondary)] truncate">{contact.role}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={e => handleDelete(contact.id!, e)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-400">
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

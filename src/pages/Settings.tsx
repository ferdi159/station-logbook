import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { exportAllData, importAllData } from '../db'
import { ArrowLeft, Moon, Sun, Download, Upload, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '../db'

export function Settings() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const fileRef = useRef<HTMLInputElement>(null)
  const [importing, setImporting] = useState(false)

  const handleExport = async () => {
    const json = await exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `station-logbook-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Backup heruntergeladen')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    try {
      const text = await file.text()
      await importAllData(text)
      toast.success('Daten importiert')
    } catch {
      toast.error('Import fehlgeschlagen – ungültiges Format')
    } finally {
      setImporting(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleClearAll = async () => {
    if (!confirm('ALLE Daten unwiderruflich löschen? Erstelle vorher ein Backup!')) return
    if (!confirm('Bist du WIRKLICH sicher?')) return
    await Promise.all([
      db.logEntries.clear(),
      db.automationIdeas.clear(),
      db.contacts.clear(),
      db.lessonsLearned.clear(),
      db.tags.clear(),
    ])
    toast.success('Alle Daten gelöscht')
  }

  const btnClass = 'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] active:scale-[0.99] text-sm font-medium text-left'

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-[var(--color-surface-hover)] active:scale-95">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">Einstellungen</h1>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-[var(--color-text-secondary)] px-1">Darstellung</h2>
        <button onClick={toggle} className={btnClass}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="flex-1">{theme === 'dark' ? 'Hell-Modus aktivieren' : 'Dunkel-Modus aktivieren'}</span>
          <span className="text-xs text-[var(--color-text-secondary)]">{theme === 'dark' ? 'Dunkel' : 'Hell'}</span>
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-[var(--color-text-secondary)] px-1">Daten</h2>
        <button onClick={handleExport} className={btnClass}>
          <Download size={20} className="text-blue-500" />
          <div>
            <p>Daten exportieren (Backup)</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Alle Einträge als JSON-Datei herunterladen</p>
          </div>
        </button>
        <button onClick={() => fileRef.current?.click()} className={btnClass} disabled={importing}>
          <Upload size={20} className="text-green-500" />
          <div>
            <p>{importing ? 'Importiere...' : 'Daten importieren'}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">JSON-Backup wiederherstellen (überschreibt aktuelle Daten)</p>
          </div>
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-red-400 px-1">Gefahrenzone</h2>
        <button onClick={handleClearAll} className={`${btnClass} !border-red-500/30 hover:!bg-red-500/10`}>
          <Trash2 size={20} className="text-red-400" />
          <div>
            <p className="text-red-400">Alle Daten löschen</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Unwiderruflich – erstelle vorher ein Backup!</p>
          </div>
        </button>
      </div>

      <div className="text-center text-xs text-[var(--color-text-secondary)] pt-4">
        Station Logbook v1.0 · Daten lokal gespeichert (IndexedDB)
      </div>
    </div>
  )
}

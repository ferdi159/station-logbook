import { X, Download } from 'lucide-react'
import { useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

export function InstallBanner() {
  const { canInstall, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white px-4 py-3 flex items-center justify-between gap-3 safe-top">
      <div className="flex items-center gap-2 min-w-0">
        <Download size={18} className="shrink-0" />
        <span className="text-sm font-medium truncate">App installieren für Offline-Nutzung</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={install} className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold active:scale-95">
          Installieren
        </button>
        <button onClick={() => setDismissed(true)} className="p-1 rounded hover:bg-blue-500">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

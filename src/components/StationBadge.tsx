import { STATION_LABELS, STATION_BG_LIGHT, STATION_TEXT, type Station } from '../types'

export function StationBadge({ station, className = '' }: { station: Station; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATION_BG_LIGHT[station]} ${STATION_TEXT[station]} ${className}`}>
      {STATION_LABELS[station]}
    </span>
  )
}

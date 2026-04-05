export type Station = 'fertigung' | 'montage' | 'konstruktion' | 'projektmanagement';

export const STATION_LABELS: Record<Station, string> = {
  fertigung: 'Fertigung',
  montage: 'Montage / Werft',
  konstruktion: 'Konstruktion',
  projektmanagement: 'Projektmanagement',
};

export const STATION_COLORS: Record<Station, string> = {
  fertigung: '#3b82f6',
  montage: '#f97316',
  konstruktion: '#22c55e',
  projektmanagement: '#a855f7',
};

export const STATION_BG: Record<Station, string> = {
  fertigung: 'bg-blue-500',
  montage: 'bg-orange-500',
  konstruktion: 'bg-green-500',
  projektmanagement: 'bg-purple-500',
};

export const STATION_BG_LIGHT: Record<Station, string> = {
  fertigung: 'bg-blue-500/15',
  montage: 'bg-orange-500/15',
  konstruktion: 'bg-green-500/15',
  projektmanagement: 'bg-purple-500/15',
};

export const STATION_TEXT: Record<Station, string> = {
  fertigung: 'text-blue-400',
  montage: 'text-orange-400',
  konstruktion: 'text-green-400',
  projektmanagement: 'text-purple-400',
};

export const DEFAULT_TAGS = [
  'Material', 'Prozess', 'Werkzeug', 'Kommunikation',
  'Qualität', 'Zeitmanagement', 'Sicherheit', 'Logistik',
];

export interface LogEntry {
  id?: number;
  date: string;
  station: Station;
  learned: string;
  people: string;
  problems: string;
  ideas: string;
  openQuestions: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export type EffortLevel = 'klein' | 'mittel' | 'gross';
export type BenefitLevel = 'gering' | 'mittel' | 'hoch';
export type AutomationStatus = 'idee' | 'vorgeschlagen' | 'in_umsetzung' | 'umgesetzt';

export const EFFORT_LABELS: Record<EffortLevel, string> = {
  klein: 'Klein',
  mittel: 'Mittel',
  gross: 'Groß',
};

export const BENEFIT_LABELS: Record<BenefitLevel, string> = {
  gering: 'Gering',
  mittel: 'Mittel',
  hoch: 'Hoch',
};

export const STATUS_LABELS: Record<AutomationStatus, string> = {
  idee: 'Idee',
  vorgeschlagen: 'Vorgeschlagen',
  in_umsetzung: 'In Umsetzung',
  umgesetzt: 'Umgesetzt',
};

export interface AutomationIdea {
  id?: number;
  name: string;
  station: Station;
  currentProcess: string;
  whyAutomatable: string;
  automationIdea: string;
  effort: EffortLevel;
  benefit: BenefitLevel;
  priority: number;
  status: AutomationStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Contact {
  id?: number;
  name: string;
  station: Station;
  role: string;
  contactInfo: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export type LessonCategory = 'prozess' | 'technisch' | 'kommunikation' | 'fehler' | 'best_practice';

export const LESSON_CATEGORY_LABELS: Record<LessonCategory, string> = {
  prozess: 'Prozess-Wissen',
  technisch: 'Technisches Wissen',
  kommunikation: 'Kommunikation',
  fehler: 'Typische Fehler',
  best_practice: 'Best Practices',
};

export interface LessonLearned {
  id?: number;
  title: string;
  content: string;
  category: LessonCategory;
  station: Station;
  linkedLogEntryIds: number[];
  createdAt: number;
  updatedAt: number;
}

export function calculatePriority(effort: EffortLevel, benefit: BenefitLevel): number {
  const effortScore: Record<EffortLevel, number> = { klein: 3, mittel: 2, gross: 1 };
  const benefitScore: Record<BenefitLevel, number> = { gering: 1, mittel: 2, hoch: 3 };
  return effortScore[effort] * benefitScore[benefit];
}

export function getPriorityLabel(priority: number): string {
  if (priority >= 6) return 'Top';
  if (priority >= 4) return 'Mittel';
  return 'Niedrig';
}

export function getPriorityColor(priority: number): string {
  if (priority >= 6) return 'text-green-400';
  if (priority >= 4) return 'text-yellow-400';
  return 'text-red-400';
}

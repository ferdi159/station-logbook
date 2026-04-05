import Dexie, { type Table } from 'dexie';
import type { LogEntry, AutomationIdea, Contact, LessonLearned } from './types';

export class StationLogbookDB extends Dexie {
  logEntries!: Table<LogEntry>;
  automationIdeas!: Table<AutomationIdea>;
  contacts!: Table<Contact>;
  lessonsLearned!: Table<LessonLearned>;
  tags!: Table<{ id?: number; name: string }>;

  constructor() {
    super('StationLogbook');
    this.version(1).stores({
      logEntries: '++id, date, station, *tags, createdAt',
      automationIdeas: '++id, station, status, effort, benefit, priority, createdAt',
      contacts: '++id, name, station',
      lessonsLearned: '++id, category, station, *linkedLogEntryIds',
      tags: '++id, &name',
    });
  }
}

export const db = new StationLogbookDB();

export async function exportAllData(): Promise<string> {
  const [logEntries, automationIdeas, contacts, lessonsLearned, tags] = await Promise.all([
    db.logEntries.toArray(),
    db.automationIdeas.toArray(),
    db.contacts.toArray(),
    db.lessonsLearned.toArray(),
    db.tags.toArray(),
  ]);
  return JSON.stringify({ logEntries, automationIdeas, contacts, lessonsLearned, tags, exportedAt: new Date().toISOString() }, null, 2);
}

export async function importAllData(json: string): Promise<void> {
  const data = JSON.parse(json);
  await db.transaction('rw', [db.logEntries, db.automationIdeas, db.contacts, db.lessonsLearned, db.tags], async () => {
    await db.logEntries.clear();
    await db.automationIdeas.clear();
    await db.contacts.clear();
    await db.lessonsLearned.clear();
    await db.tags.clear();
    if (data.logEntries) await db.logEntries.bulkAdd(data.logEntries);
    if (data.automationIdeas) await db.automationIdeas.bulkAdd(data.automationIdeas);
    if (data.contacts) await db.contacts.bulkAdd(data.contacts);
    if (data.lessonsLearned) await db.lessonsLearned.bulkAdd(data.lessonsLearned);
    if (data.tags) await db.tags.bulkAdd(data.tags);
  });
}

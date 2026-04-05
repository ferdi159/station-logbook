import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { db } from '../db'
import { DEFAULT_TAGS } from '../types'

interface Props {
  selected: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ selected, onChange }: Props) {
  const [customTags, setCustomTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    db.tags.toArray().then(tags => setCustomTags(tags.map(t => t.name)))
  }, [])

  const allTags = [...new Set([...DEFAULT_TAGS, ...customTags])]

  const toggle = (tag: string) => {
    onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag])
  }

  const addCustom = async () => {
    const trimmed = newTag.trim()
    if (!trimmed || allTags.includes(trimmed)) return
    await db.tags.add({ name: trimmed })
    setCustomTags(prev => [...prev, trimmed])
    onChange([...selected, trimmed])
    setNewTag('')
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {allTags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
              selected.includes(tag)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-blue-400'
            }`}
          >
            {tag}
            {selected.includes(tag) && <X size={12} className="inline ml-1 -mr-0.5" />}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Neuer Tag..."
          className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]"
        />
        <button type="button" onClick={addCustom} className="p-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]">
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}

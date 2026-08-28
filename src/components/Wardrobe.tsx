import { useState } from 'react'
import { EXAMPLE_CLOTHES } from '../lib/exampleClothes'
import { useAppStore } from '../store/useAppStore'
import { CATEGORY_LABELS } from '../types'
import { ItemUploader } from './ItemUploader'

export function Wardrobe() {
  const items = useAppStore((state) => state.items)
  const worn = useAppStore((state) => state.worn)
  const wearItem = useAppStore((state) => state.wearItem)
  const addItem = useAppStore((state) => state.addItem)
  const toggleUnavailable = useAppStore((state) => state.toggleUnavailable)
  const deleteItem = useAppStore((state) => state.deleteItem)
  const wornIds = new Set(Object.values(worn).filter(Boolean))
  const [loadingExamples, setLoadingExamples] = useState(false)

  async function loadExamples() {
    setLoadingExamples(true)
    try {
      for (const example of EXAMPLE_CLOTHES) {
        const response = await fetch(example.file)
        const imageBlob = await response.blob()
        await addItem({
          name: example.name,
          category: example.category,
          accessorySubtype: example.accessorySubtype,
          imageBlob,
        })
      }
    } finally {
      setLoadingExamples(false)
    }
  }

  return (
    <div className="mt-4 space-y-3 border-t border-[#e0d6c8] pt-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl text-[#1f1a14]">Wardrobe</h2>
          <p className="text-sm text-[#7a7168]">
            Upload your clothes, then tap a piece to put it on.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadExamples()}
          disabled={loadingExamples}
          className="shrink-0 rounded-full border border-[#9c4a2e] px-3 py-2 text-xs font-semibold text-[#9c4a2e] disabled:opacity-50"
        >
          {loadingExamples ? 'Adding…' : 'Add examples'}
        </button>
      </div>
      <ItemUploader />
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9cfc0] px-4 py-8 text-center">
          <p className="text-sm text-[#7a7168]">
            No pieces yet. Photograph a top, shoes, or accessory to start.
          </p>
          <button
            type="button"
            onClick={() => void loadExamples()}
            disabled={loadingExamples}
            className="mt-3 rounded-full bg-[#9c4a2e] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loadingExamples ? 'Adding examples…' : 'Add example clothes'}
          </button>
          <p className="mt-2 text-[11px] text-[#9a9086]">
            Sample photos from Unsplash (tee, jeans, dress, sneakers, cap).
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((item) => {
            const wearing = wornIds.has(item.id)
            return (
              <li
                key={item.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                  item.unavailable
                    ? 'border-[#eadfd0] opacity-55'
                    : 'border-[#e0d6c8]'
                } ${wearing ? 'ring-2 ring-[#3d5c4a]' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => wearItem(item.id)}
                  className="block w-full"
                >
                  <div className="relative aspect-square bg-[#f3eee6]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-contain p-2"
                    />
                    {item.unavailable ? (
                      <span className="absolute left-2 top-2 rounded-full bg-[#1f1a14]/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Unavailable
                      </span>
                    ) : null}
                  </div>
                </button>
                <div className="space-y-2 px-2.5 pb-2.5 pt-2">
                  <div>
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-[11px] uppercase tracking-wide text-[#9a9086]">
                      {CATEGORY_LABELS[item.category]}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleUnavailable(item.id)}
                      className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[#9c4a2e] hover:bg-[#f6eae3]"
                    >
                      {item.unavailable ? 'Available' : 'Not available'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="rounded-lg px-2 py-1.5 text-[11px] font-semibold text-[#7a7168] hover:bg-[#f3eee6]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

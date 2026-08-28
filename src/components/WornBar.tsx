import { useAppStore } from '../store/useAppStore'
import { CATEGORIES, CATEGORY_LABELS, type Category } from '../types'

export function WornBar() {
  const items = useAppStore((state) => state.items)
  const worn = useAppStore((state) => state.worn)
  const generate = useAppStore((state) => state.generate)
  const clearSlot = useAppStore((state) => state.clearSlot)
  const message = useAppStore((state) => state.message)
  const clearMessage = useAppStore((state) => state.clearMessage)

  const slots: Category[] = [...CATEGORIES]

  return (
    <div className="border-t border-[#e0d6c8] bg-[#faf7f2] px-1 py-4 sm:px-2">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg text-[#1f1a14]">Worn now</h2>
        <button
          type="button"
          onClick={generate}
          className="rounded-full bg-[#3d5c4a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#334e3f]"
        >
          Generate outfit
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {slots.map((slot) => {
          const id = worn[slot]
          const item = items.find((entry) => entry.id === id)
          return (
            <button
              key={slot}
              type="button"
              onClick={() => item && clearSlot(slot)}
              className="flex w-20 shrink-0 flex-col items-center gap-1"
              title={item ? `Remove ${item.name}` : CATEGORY_LABELS[slot]}
            >
              <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-[#e0d6c8] bg-white">
                {item ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <span className="px-1 text-center text-[10px] uppercase tracking-wide text-[#b0a79c]">
                    {CATEGORY_LABELS[slot]}
                  </span>
                )}
              </div>
              <span className="truncate text-[11px] text-[#7a7168]">
                {item?.name ?? 'Empty'}
              </span>
            </button>
          )
        })}
      </div>
      {message ? (
        <p className="mt-2 flex items-start justify-between gap-2 text-xs text-[#3d5c4a]">
          <span>{message}</span>
          <button
            type="button"
            onClick={clearMessage}
            className="font-semibold text-[#7a7168]"
          >
            Dismiss
          </button>
        </p>
      ) : null}
    </div>
  )
}

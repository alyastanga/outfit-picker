import { useAppStore } from '../store/useAppStore'

function bodyLabel(value: number) {
  if (value < 0.25) return 'Slim'
  if (value < 0.5) return 'Lean'
  if (value < 0.75) return 'Average'
  return 'Plus'
}

export function CharacterControls() {
  const heightCm = useAppStore((state) => state.character.heightCm)
  const bodyType = useAppStore((state) => state.character.bodyType)
  const setHeight = useAppStore((state) => state.setHeight)
  const setBodyType = useAppStore((state) => state.setBodyType)

  return (
    <div className="grid gap-4 border-t border-[#e0d6c8] bg-[#f7f1e8] px-1 py-4 sm:grid-cols-2 sm:px-2">
      <label className="flex flex-col gap-1.5">
        <span className="flex justify-between text-sm font-semibold text-[#3b3329]">
          Height
          <span className="font-normal text-[#7a7168]">{heightCm} cm</span>
        </span>
        <input
          type="range"
          min={140}
          max={200}
          step={1}
          value={heightCm}
          onChange={(event) => setHeight(Number(event.target.value))}
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="flex justify-between text-sm font-semibold text-[#3b3329]">
          Body type
          <span className="font-normal text-[#7a7168]">{bodyLabel(bodyType)}</span>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={bodyType}
          onChange={(event) => setBodyType(Number(event.target.value))}
        />
        <span className="flex justify-between text-[11px] uppercase tracking-wide text-[#9a9086]">
          <span>Slim</span>
          <span>Plus</span>
        </span>
      </label>
    </div>
  )
}

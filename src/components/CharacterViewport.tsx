import { useAppStore } from '../store/useAppStore'
import { Mannequin } from './Mannequin'

export function CharacterViewport() {
  const heightCm = useAppStore((state) => state.character.heightCm)
  const bodyType = useAppStore((state) => state.character.bodyType)
  const items = useAppStore((state) => state.items)
  const worn = useAppStore((state) => state.worn)

  const find = (id: string | null) => items.find((item) => item.id === id)
  const top = find(worn.top)
  const bottom = find(worn.bottom)
  const dress = find(worn.dress)
  const shoes = find(worn.shoes)
  const accessory = find(worn.accessory)
  const hasClothes = Boolean(top || bottom || dress || shoes || accessory)

  return (
    <div className="relative flex w-full justify-center overflow-visible rounded-2xl bg-[radial-gradient(ellipse_at_50%_20%,#f4eee6_0%,#ebe4d8_55%,#e0d6c8_100%)] px-2 py-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-2xl bg-gradient-to-t from-[#d8cbb8]/40 to-transparent"
      />
      <Mannequin
        heightCm={heightCm}
        bodyType={bodyType}
        layers={{
          top: top?.imageUrl,
          bottom: bottom?.imageUrl,
          dress: dress?.imageUrl,
          shoes: shoes?.imageUrl,
          accessory: accessory
            ? {
                url: accessory.imageUrl,
                subtype: accessory.accessorySubtype,
              }
            : undefined,
        }}
      />
      {!hasClothes ? (
        <p className="pointer-events-none absolute bottom-3 left-1/2 max-w-[16rem] -translate-x-1/2 text-center text-xs text-[#7a7168]">
          Tap wardrobe items to dress the mannequin.
        </p>
      ) : null}
    </div>
  )
}

import type { CSSProperties } from 'react'
import type { AccessorySubtype } from '../types'

type Layers = {
  top?: string
  bottom?: string
  dress?: string
  shoes?: string
  accessory?: { url: string; subtype: AccessorySubtype }
}

type MannequinProps = {
  heightCm: number
  bodyType: number
  layers: Layers
}

type SlotStyle = {
  top: string
  left: string
  width: string
  height: string
  zIndex: number
}

const SLOT: Record<
  'top' | 'bottom' | 'dress' | 'shoes' | 'hat' | 'bag' | 'other',
  SlotStyle
> = {
  top: { top: '18%', left: '28%', width: '44%', height: '28%', zIndex: 3 },
  bottom: { top: '48%', left: '28%', width: '44%', height: '36%', zIndex: 2 },
  dress: { top: '18%', left: '26%', width: '48%', height: '52%', zIndex: 3 },
  shoes: { top: '86%', left: '24%', width: '52%', height: '10%', zIndex: 4 },
  hat: { top: '1%', left: '34%', width: '32%', height: '10%', zIndex: 5 },
  bag: { top: '38%', left: '6%', width: '20%', height: '16%', zIndex: 5 },
  other: { top: '28%', left: '70%', width: '20%', height: '12%', zIndex: 5 },
}

function StickMan({ strokeWidth }: { strokeWidth: number }) {
  return (
    <svg
      viewBox="0 0 200 480"
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      aria-hidden
    >
      <circle
        cx="100"
        cy="48"
        r="28"
        fill="#ebe4d8"
        stroke="#5c5348"
        strokeWidth={strokeWidth}
      />
      <g
        stroke="#5c5348"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      >
        <line x1="100" y1="76" x2="100" y2="100" />
        <line x1="100" y1="100" x2="100" y2="250" strokeWidth={strokeWidth + 2} />
        <line x1="100" y1="120" x2="40" y2="200" />
        <line x1="100" y1="120" x2="160" y2="200" />
        <line x1="70" y1="250" x2="130" y2="250" />
        <line x1="85" y1="250" x2="60" y2="420" />
        <line x1="115" y1="250" x2="140" y2="420" />
        <line x1="60" y1="420" x2="40" y2="430" />
        <line x1="140" y1="420" x2="160" y2="430" />
      </g>
    </svg>
  )
}

function Garment({
  url,
  slot,
  alt,
}: {
  url: string
  slot: SlotStyle
  alt: string
}) {
  const style: CSSProperties = {
    top: slot.top,
    left: slot.left,
    width: slot.width,
    height: slot.height,
    zIndex: slot.zIndex,
  }

  return (
    <img
      src={url}
      alt={alt}
      draggable={false}
      className="pointer-events-none absolute object-contain drop-shadow-md"
      style={style}
    />
  )
}

export function Mannequin({ heightCm, bodyType, layers }: MannequinProps) {
  const heightScale = 0.88 + ((heightCm - 140) / 60) * 0.24
  const widthScale = 0.9 + bodyType * 0.22
  const strokeWidth = 5.5 + bodyType * 2.5
  const showSeparates = !layers.dress
  const accessorySlot =
    layers.accessory?.subtype === 'hat'
      ? SLOT.hat
      : layers.accessory?.subtype === 'bag'
        ? SLOT.bag
        : SLOT.other

  return (
    <div className="flex w-full items-end justify-center">
      <div
        className="relative aspect-[200/480] h-[min(48vh,380px)] w-auto max-w-full origin-bottom transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${heightScale * widthScale}, ${heightScale})`,
        }}
        role="img"
        aria-label="2D stick-man mannequin"
      >
        <StickMan strokeWidth={strokeWidth} />

        {showSeparates && layers.top ? (
          <Garment url={layers.top} slot={SLOT.top} alt="Top" />
        ) : null}

        {layers.dress ? (
          <Garment url={layers.dress} slot={SLOT.dress} alt="Dress" />
        ) : null}

        {showSeparates && layers.bottom ? (
          <Garment url={layers.bottom} slot={SLOT.bottom} alt="Bottom" />
        ) : null}

        {layers.shoes ? (
          <Garment url={layers.shoes} slot={SLOT.shoes} alt="Shoes" />
        ) : null}

        {layers.accessory ? (
          <Garment
            url={layers.accessory.url}
            slot={accessorySlot}
            alt="Accessory"
          />
        ) : null}
      </div>
    </div>
  )
}

import type { WardrobeItem, WornSlots } from '../types'
import { EMPTY_WORN } from '../types'

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined
  return items[Math.floor(Math.random() * items.length)]
}

export function generateOutfit(items: WardrobeItem[]): WornSlots {
  const available = items.filter((item) => !item.unavailable)
  const of = (category: WardrobeItem['category']) =>
    available.filter((item) => item.category === category)

  const dresses = of('dress')
  const tops = of('top')
  const bottoms = of('bottom')
  const shoes = of('shoes')
  const accessories = of('accessory')

  const worn: WornSlots = { ...EMPTY_WORN }
  const wearDress =
    dresses.length > 0 &&
    (Math.random() < 0.5 || (tops.length === 0 && bottoms.length === 0))

  if (wearDress) {
    worn.dress = pickRandom(dresses)?.id ?? null
  } else {
    worn.top = pickRandom(tops)?.id ?? null
    worn.bottom = pickRandom(bottoms)?.id ?? null
    if (!worn.top && !worn.bottom) {
      worn.dress = pickRandom(dresses)?.id ?? null
    }
  }

  worn.shoes = pickRandom(shoes)?.id ?? null
  if (accessories.length > 0 && Math.random() < 0.75) {
    worn.accessory = pickRandom(accessories)?.id ?? null
  }

  return worn
}

export function applyWear(
  worn: WornSlots,
  item: WardrobeItem,
): WornSlots {
  const slot = item.category
  if (worn[slot] === item.id) {
    return { ...worn, [slot]: null }
  }

  if (slot === 'dress') {
    return { ...worn, dress: item.id, top: null, bottom: null }
  }

  if (slot === 'top' || slot === 'bottom') {
    return { ...worn, [slot]: item.id, dress: null }
  }

  return { ...worn, [slot]: item.id }
}

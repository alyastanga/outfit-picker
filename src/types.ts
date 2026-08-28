export const CATEGORIES = [
  'top',
  'bottom',
  'dress',
  'shoes',
  'accessory',
] as const

export type Category = (typeof CATEGORIES)[number]

export const ACCESSORY_SUBTYPES = ['bag', 'hat', 'other'] as const

export type AccessorySubtype = (typeof ACCESSORY_SUBTYPES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  top: 'Top',
  bottom: 'Bottom',
  dress: 'Dress',
  shoes: 'Shoes',
  accessory: 'Accessory',
}

export const ACCESSORY_LABELS: Record<AccessorySubtype, string> = {
  bag: 'Bag',
  hat: 'Hat',
  other: 'Other',
}

export type WardrobeItem = {
  id: string
  name: string
  category: Category
  accessorySubtype: AccessorySubtype
  imageUrl: string
  imageBlob: Blob
  unavailable: boolean
  createdAt: number
}

export type WardrobeRecord = {
  id: string
  name: string
  category: Category
  accessorySubtype: AccessorySubtype
  imageBlob: Blob
  unavailable: boolean
  createdAt: number
}

export type Character = {
  heightCm: number
  bodyType: number
}

export type WornSlots = {
  top: string | null
  bottom: string | null
  dress: string | null
  shoes: string | null
  accessory: string | null
}

export const DEFAULT_CHARACTER: Character = {
  heightCm: 170,
  bodyType: 0.4,
}

export const EMPTY_WORN: WornSlots = {
  top: null,
  bottom: null,
  dress: null,
  shoes: null,
  accessory: null,
}

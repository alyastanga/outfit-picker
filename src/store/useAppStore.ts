import { create } from 'zustand'
import {
  createItemUrl,
  deleteItemRecord,
  loadCharacter,
  loadItems,
  loadWorn,
  saveCharacter,
  saveItem,
  saveWorn,
} from '../lib/db'
import { applyWear, generateOutfit } from '../lib/generateOutfit'
import {
  DEFAULT_CHARACTER,
  EMPTY_WORN,
  type AccessorySubtype,
  type Category,
  type Character,
  type WardrobeItem,
  type WornSlots,
} from '../types'

type AddItemInput = {
  name: string
  category: Category
  accessorySubtype: AccessorySubtype
  imageBlob: Blob
}

type AppState = {
  hydrated: boolean
  character: Character
  items: WardrobeItem[]
  worn: WornSlots
  message: string | null
  hydrate: () => Promise<void>
  setHeight: (heightCm: number) => void
  setBodyType: (bodyType: number) => void
  addItem: (input: AddItemInput) => Promise<void>
  toggleUnavailable: (id: string) => void
  deleteItem: (id: string) => void
  wearItem: (id: string) => void
  clearSlot: (slot: Category) => void
  generate: () => void
  clearMessage: () => void
}

function persistWorn(worn: WornSlots) {
  void saveWorn(worn)
}

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  character: { ...DEFAULT_CHARACTER },
  items: [],
  worn: { ...EMPTY_WORN },
  message: null,

  hydrate: async () => {
    try {
      const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
        Promise.race([
          promise,
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('storage timeout')), ms),
          ),
        ])

      const [items, character, worn] = await withTimeout(
        Promise.all([loadItems(), loadCharacter(), loadWorn()]),
        2500,
      )
      const ids = new Set(items.map((item) => item.id))
      const nextWorn: WornSlots = {
        top: worn.top && ids.has(worn.top) ? worn.top : null,
        bottom: worn.bottom && ids.has(worn.bottom) ? worn.bottom : null,
        dress: worn.dress && ids.has(worn.dress) ? worn.dress : null,
        shoes: worn.shoes && ids.has(worn.shoes) ? worn.shoes : null,
        accessory:
          worn.accessory && ids.has(worn.accessory) ? worn.accessory : null,
      }
      set({ items, character, worn: nextWorn, hydrated: true })
    } catch (error) {
      console.warn('Wardrobe storage unavailable; starting empty.', error)
      set({
        items: [],
        character: { ...DEFAULT_CHARACTER },
        worn: { ...EMPTY_WORN },
        hydrated: true,
      })
    }
  },

  setHeight: (heightCm) => {
    const character = { ...get().character, heightCm }
    set({ character })
    void saveCharacter(character)
  },

  setBodyType: (bodyType) => {
    const character = { ...get().character, bodyType }
    set({ character })
    void saveCharacter(character)
  },

  addItem: async (input) => {
    const id = crypto.randomUUID()
    const item: WardrobeItem = {
      id,
      name: input.name.trim() || input.category,
      category: input.category,
      accessorySubtype: input.accessorySubtype,
      imageBlob: input.imageBlob,
      imageUrl: createItemUrl(id, input.imageBlob),
      unavailable: false,
      createdAt: Date.now(),
    }
    await saveItem(item)
    set({ items: [item, ...get().items], message: `Added ${item.name}` })
  },

  toggleUnavailable: (id) => {
    const items = get().items.map((item) =>
      item.id === id ? { ...item, unavailable: !item.unavailable } : item,
    )
    const updated = items.find((item) => item.id === id)
    if (updated) void saveItem(updated)
    set({ items })
  },

  deleteItem: (id) => {
    const worn = { ...get().worn }
    for (const key of Object.keys(worn) as (keyof WornSlots)[]) {
      if (worn[key] === id) worn[key] = null
    }
    void deleteItemRecord(id)
    persistWorn(worn)
    set({
      items: get().items.filter((item) => item.id !== id),
      worn,
    })
  },

  wearItem: (id) => {
    const item = get().items.find((entry) => entry.id === id)
    if (!item) return
    const worn = applyWear(get().worn, item)
    persistWorn(worn)
    set({ worn })
  },

  clearSlot: (slot) => {
    const worn = { ...get().worn, [slot]: null }
    persistWorn(worn)
    set({ worn })
  },

  generate: () => {
    const { items } = get()
    const available = items.filter((item) => !item.unavailable)
    if (available.length === 0) {
      set({
        message:
          items.length === 0
            ? 'Upload some clothes first, then generate an outfit.'
            : 'Every item is flagged unavailable. Turn some back on to generate.',
      })
      return
    }
    const worn = generateOutfit(items)
    persistWorn(worn)
    set({ worn, message: 'Outfit generated from available pieces.' })
  },

  clearMessage: () => set({ message: null }),
}))

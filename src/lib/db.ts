import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import {
  DEFAULT_CHARACTER,
  EMPTY_WORN,
  type Character,
  type WardrobeItem,
  type WardrobeRecord,
  type WornSlots,
} from '../types'

const DB_NAME = 'outfit-picker'
const DB_VERSION = 1

interface OutfitPickerDB extends DBSchema {
  items: {
    key: string
    value: WardrobeRecord
  }
  meta: {
    key: string
    value: Character | WornSlots
  }
}

const objectUrls = new Map<string, string>()

export function createItemUrl(id: string, blob: Blob): string {
  const previous = objectUrls.get(id)
  if (previous) URL.revokeObjectURL(previous)
  const url = URL.createObjectURL(blob)
  objectUrls.set(id, url)
  return url
}

export function revokeItemUrl(id: string) {
  const url = objectUrls.get(id)
  if (url) {
    URL.revokeObjectURL(url)
    objectUrls.delete(id)
  }
}

function toItem(record: WardrobeRecord): WardrobeItem {
  return {
    ...record,
    accessorySubtype: record.accessorySubtype ?? 'other',
    imageUrl: createItemUrl(record.id, record.imageBlob),
  }
}

let dbPromise: Promise<IDBPDatabase<OutfitPickerDB>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<OutfitPickerDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta')
        }
      },
    })
  }
  return dbPromise
}

export async function loadItems(): Promise<WardrobeItem[]> {
  const db = await getDb()
  const records = await db.getAll('items')
  records.sort((a, b) => b.createdAt - a.createdAt)
  return records.map(toItem)
}

export async function saveItem(item: WardrobeItem): Promise<void> {
  const db = await getDb()
  const record: WardrobeRecord = {
    id: item.id,
    name: item.name,
    category: item.category,
    accessorySubtype: item.accessorySubtype,
    imageBlob: item.imageBlob,
    unavailable: item.unavailable,
    createdAt: item.createdAt,
  }
  await db.put('items', record)
}

export async function deleteItemRecord(id: string): Promise<void> {
  const db = await getDb()
  await db.delete('items', id)
  revokeItemUrl(id)
}

export async function loadCharacter(): Promise<Character> {
  const db = await getDb()
  const saved = await db.get('meta', 'character')
  if (saved && 'heightCm' in saved) return saved
  return { ...DEFAULT_CHARACTER }
}

export async function saveCharacter(character: Character): Promise<void> {
  const db = await getDb()
  await db.put('meta', character, 'character')
}

export async function loadWorn(): Promise<WornSlots> {
  const db = await getDb()
  const saved = await db.get('meta', 'worn')
  if (saved && 'top' in saved) return saved
  return { ...EMPTY_WORN }
}

export async function saveWorn(worn: WornSlots): Promise<void> {
  const db = await getDb()
  await db.put('meta', worn, 'worn')
}

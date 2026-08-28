import { useState, type FormEvent } from 'react'
import { removeImageBackground, resizeImage } from '../lib/backgroundRemoval'
import { useAppStore } from '../store/useAppStore'
import {
  ACCESSORY_LABELS,
  ACCESSORY_SUBTYPES,
  CATEGORIES,
  CATEGORY_LABELS,
  type AccessorySubtype,
  type Category,
} from '../types'

export function ItemUploader() {
  const addItem = useAppStore((state) => state.addItem)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('top')
  const [accessorySubtype, setAccessorySubtype] =
    useState<AccessorySubtype>('other')
  const [cutout, setCutout] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fileInput = form.elements.namedItem('photo') as HTMLInputElement
    const file = fileInput.files?.[0]
    if (!file) {
      setError('Choose a photo of the item first.')
      return
    }

    setBusy(true)
    setError(null)
    try {
      let blob: Blob = file
      if (cutout) {
        blob = await removeImageBackground(file)
      }
      blob = await resizeImage(blob)
      await addItem({
        name,
        category,
        accessorySubtype: category === 'accessory' ? accessorySubtype : 'other',
        imageBlob: blob,
      })
      setName('')
      fileInput.value = ''
    } catch (caught) {
      console.error(caught)
      setError('Could not add that photo. Try another image.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border border-[#e0d6c8] bg-white/70 p-3"
    >
      <div className="grid grid-cols-2 gap-2">
        <label className="col-span-2 flex flex-col gap-1 text-xs font-semibold text-[#5c5348]">
          Photo
          <input
            name="photo"
            type="file"
            accept="image/*"
            capture="environment"
            className="rounded-lg border border-[#ddd3c5] bg-white px-2 py-2 text-sm font-normal file:mr-3 file:rounded-md file:border-0 file:bg-[#9c4a2e] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[#5c5348]">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Blue jeans"
            className="rounded-lg border border-[#ddd3c5] bg-white px-2 py-2 text-sm font-normal outline-none focus:border-[#9c4a2e]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-[#5c5348]">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
            className="rounded-lg border border-[#ddd3c5] bg-white px-2 py-2 text-sm font-normal outline-none focus:border-[#9c4a2e]"
          >
            {CATEGORIES.map((entry) => (
              <option key={entry} value={entry}>
                {CATEGORY_LABELS[entry]}
              </option>
            ))}
          </select>
        </label>
        {category === 'accessory' ? (
          <label className="col-span-2 flex flex-col gap-1 text-xs font-semibold text-[#5c5348]">
            Accessory type
            <select
              value={accessorySubtype}
              onChange={(event) =>
                setAccessorySubtype(event.target.value as AccessorySubtype)
              }
              className="rounded-lg border border-[#ddd3c5] bg-white px-2 py-2 text-sm font-normal"
            >
              {ACCESSORY_SUBTYPES.map((entry) => (
                <option key={entry} value={entry}>
                  {ACCESSORY_LABELS[entry]}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      <label className="flex items-center gap-2 text-sm text-[#3b3329]">
        <input
          type="checkbox"
          checked={cutout}
          onChange={(event) => setCutout(event.target.checked)}
          className="size-4 accent-[#9c4a2e]"
        />
        Cut out background
      </label>
      {busy ? (
        <p className="text-xs text-[#7a7168]">
          {cutout
            ? 'Cutting out the background… the first time can take a minute.'
            : 'Saving to your wardrobe…'}
        </p>
      ) : null}
      {error ? <p className="text-xs text-[#9c4a2e]">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-[#1f1a14] px-3 py-2.5 text-sm font-semibold text-[#faf7f2] disabled:opacity-50"
      >
        {busy ? 'Adding…' : 'Add to wardrobe'}
      </button>
    </form>
  )
}

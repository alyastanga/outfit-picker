import { useEffect } from 'react'
import { CharacterControls } from './components/CharacterControls'
import { CharacterViewport } from './components/CharacterViewport'
import { Wardrobe } from './components/Wardrobe'
import { WornBar } from './components/WornBar'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const hydrated = useAppStore((state) => state.hydrated)
  const hydrate = useAppStore((state) => state.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#ebe4d8] px-4 text-[#7a7168]">
        Loading your wardrobe…
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#ebe4d8]">
      <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4 sm:px-6">
        <header className="mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9c4a2e]">
            Virtual try-on
          </p>
          <h1 className="text-3xl text-[#1f1a14] sm:text-4xl">Outfit Picker</h1>
          <p className="mt-1 max-w-md text-sm text-[#7a7168]">
            Upload clothes you do not own. See them on a 2D mannequin.
          </p>
        </header>

        <CharacterViewport />
        <CharacterControls />
        <WornBar />
        <Wardrobe />
      </div>
    </div>
  )
}

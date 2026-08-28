export async function resizeImage(blob: Blob, maxSize = 1024): Promise<Blob> {
  const bitmap = await createImageBitmap(blob)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return blob
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const next = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/png')
  })
  return next ?? blob
}

export async function removeImageBackground(source: Blob): Promise<Blob> {
  try {
    const { removeBackground } = await import('@imgly/background-removal')
    return await removeBackground(source)
  } catch (error) {
    console.warn('Background removal failed, using original photo', error)
    return source
  }
}

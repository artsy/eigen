import { useScreenDimensions } from "./useScreenDimensions"

interface Size {
  width: number
  height: number
}

export const sizeToFit = (toBeContained: Size, container: Size): Size => {
  if (toBeContained.width <= container.width && toBeContained.height <= container.height) {
    return toBeContained
  }

  const aspectRatio = toBeContained.width / toBeContained.height

  if (toBeContained.width > container.width && toBeContained.height > container.height) {
    const containerAspectRatio = container.width / container.height
    return aspectRatio > containerAspectRatio
      ? { width: container.width, height: container.width / aspectRatio }
      : { width: container.height * aspectRatio, height: container.height }
  }

  if (toBeContained.width > container.width) {
    return { width: container.width, height: container.width / aspectRatio }
  }

  if (toBeContained.height > container.height) {
    return { width: container.height * aspectRatio, height: container.height }
  }

  return { width: -1, height: -1 }
}

export const useSizeToFitScreen = (toBeContained: Size): Size => {
  const screenDimensions = useScreenDimensions()
  return sizeToFit(toBeContained, screenDimensions)
}

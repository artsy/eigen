/**
 *
 * Get image accurate square dimensions while keeping the same aspect ratio
 */
export const getImageSquareDimensions = (
  height: number | null | undefined,
  width: number | null | undefined,
  containerHeight: number
) => {
  if (height && width) {
    if (height > width) {
      return {
        height: containerHeight,
        width: (width * containerHeight) / height,
      }
    }
    return {
      height: (height * containerHeight) / width,
      width: containerHeight,
    }
  }
  return {
    height: containerHeight,
    width: containerHeight,
  }
}

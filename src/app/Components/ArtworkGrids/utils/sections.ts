export function getSectionDimensions(
  sectionMargin: number,
  sectionCount: number,
  artworkPadding: number,
  gridWidth: number | null | undefined
) {
  // Setting the dimension to 1 for tests to avoid adjusting the screen width
  if (__TEST__) {
    return 1
  }

  if (gridWidth) {
    // This is the sum of all margins in between sections, so do not count to the right of last column.
    const sectionMargins = sectionMargin * (sectionCount - 1)

    return (gridWidth - sectionMargins - artworkPadding) / sectionCount!
  }
  return 0
}

export function getSectionedItems<T extends { image: { aspectRatio: number } | null }>(
  items: T[],
  columnCount: number
) {
  const sectionRatioSums: number[] = []
  const sectionedArtworksArray: T[][] = []

  for (let i = 0; i < columnCount; i++) {
    sectionedArtworksArray.push([])
    sectionRatioSums.push(0)
  }

  const itemsClone = [...items]

  itemsClone.forEach((item) => {
    let lowestRatioSum = Number.MAX_VALUE // Start higher, so we always find a
    let sectionIndex: number | null = null
    for (let j = 0; j < sectionRatioSums.length; j++) {
      const ratioSum = sectionRatioSums[j]
      if (ratioSum < lowestRatioSum) {
        sectionIndex = j
        lowestRatioSum = ratioSum
      }
    }

    if (sectionIndex != null) {
      const section = sectionedArtworksArray[sectionIndex]
      section.push(item)

      // Keep track of total section aspect ratio
      const aspectRatio = item.image?.aspectRatio || 1 // Ensure we never divide by null/0
      // Invert the aspect ratio so that a lower value means a shorter section.
      sectionRatioSums[sectionIndex] += 1 / aspectRatio
    }
  })

  return sectionedArtworksArray
}

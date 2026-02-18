import { useSpace } from "@artsy/palette-mobile"
import { CHIP_WIDTH } from "app/Scenes/CollectionsByCategory/Components/CollectionsChips"
import { Dimensions } from "react-native"
import { isTablet } from "react-native-device-info"

const { width } = Dimensions.get("window")

export const useCollectionsChips = <T>(elements: ReadonlyArray<T> | null) => {
  const space = useSpace()

  const numRows = !isTablet() ? 3 : 2
  const numColumns = elements === null ? 0 : Math.ceil(elements.length / numRows)
  const rows = getRows<T>(elements, numRows)
  const snapToOffsets = getSnapToOffsets(numColumns, space(1), space(1))

  return {
    rows,
    snapToOffsets,
  }
}

export function getRows<T>(data: ReadonlyArray<T> | null, numRows: number): T[][] {
  if (!data) {
    return []
  }

  const rows: T[][] = []
  for (let i = 0; i < data.length; i += numRows) {
    rows.push(data.slice(i, i + numRows))
  }
  return rows
}

export const getSnapToOffsets = (
  numColumns: number,
  gap: number,
  padding: number,
  chipWidth = CHIP_WIDTH
) => {
  if (!isTablet()) {
    // first and last elements are cornered
    const firstOffset = chipWidth + gap + chipWidth / 2 - (width / 2 - padding)
    const lastOffset = chipWidth * (numColumns - 1)
    // the middle elements are centered, the logic here is
    // first element offset + chipWidth + gap multiplied by the index to keep it increasing
    const middleOffsets = Array.from({ length: numColumns - 2 }).map((_, index) => {
      const offset = (chipWidth + gap) * (index + 1)
      return firstOffset + offset
    })
    return [firstOffset, ...middleOffsets, lastOffset]
  }

  return [CHIP_WIDTH * numColumns - 2]
}

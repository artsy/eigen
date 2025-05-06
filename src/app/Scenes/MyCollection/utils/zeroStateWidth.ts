import { useScreenDimensions, useSpace } from "@artsy/palette-mobile"

/**
 * Returns the width of the zero state based on the screen width.
 * @returns {width: number}
 */
export const useZeroStateDimensions = () => {
  const space = useSpace()
  const { width: screenWidth } = useScreenDimensions()

  const screenWidthMinusPadding = screenWidth - 2 * space(2)

  // If the screen width minus padding isn't too wide, use that width
  if (screenWidthMinusPadding < 600) {
    return {
      width: screenWidthMinusPadding,
    }
  }

  // Otherwise, limit the width to 600
  return {
    width: 600,
  }
}

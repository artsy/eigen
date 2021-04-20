import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"

export type ScreenOrientation = "landscape" | "portrait"

export interface ScreenDimensions {
  width: number
  height: number
  orientation: ScreenOrientation
}

export interface ScreenDimensionsWithSafeAreas extends ScreenDimensions {
  safeAreaInsets: SafeAreaInsets
  fullWidth: number
  fullHeight: number
}

/**
 * Call during render to be notified whenever `screenDimensions` changes
 */
export const useScreenDimensions = (): ScreenDimensionsWithSafeAreas => {
  const insets = useSafeAreaInsets()
  const frame = useSafeAreaFrame()

  return {
    safeAreaInsets: insets,
    width: frame.width,
    height: frame.height,

    get fullWidth() {
      return this.width + this.safeAreaInsets.left + this.safeAreaInsets.right
    },
    get fullHeight() {
      return this.height + this.safeAreaInsets.top + this.safeAreaInsets.bottom
    },
    get orientation() {
      return this.fullWidth > this.fullHeight ? "landscape" : "portrait"
    },
  }
}

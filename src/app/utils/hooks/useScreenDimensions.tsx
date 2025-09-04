import { createContext, useContext, useEffect, useState } from "react"
import { Dimensions } from "react-native"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"

export type ScreenOrientation = "landscape" | "portrait"

export type SafeAreaInsets = EdgeInsets

export interface ScreenDimensions {
  width: number
  height: number
  orientation: ScreenOrientation
  size: "small" | "standard" | "large"
  isSmallScreen: boolean
}

export interface ScreenDimensionsWithSafeAreas extends ScreenDimensions {
  safeAreaInsets: SafeAreaInsets
}

export const ScreenDimensionsContext = createContext<ScreenDimensionsWithSafeAreas>(
  null as any /* STRICTNESS_MIGRATION */
)

function getCurrentDimensions(): ScreenDimensions {
  const { width, height } = Dimensions.get("window")
  return {
    width,
    height,
    orientation: width > height ? "landscape" : "portrait",
    size: height < 667 ? "small" : height <= 812 ? "standard" : "large",
    get isSmallScreen() {
      return this.size === "small"
    },
  }
}

export const ProvideScreenDimensions: React.FC<React.PropsWithChildren> = ({ children }) => {
  const safeAreaInsets = useSafeAreaInsets()
  const [dimensions, setDimensions] = useState<ScreenDimensions>(getCurrentDimensions())

  useEffect(() => {
    const onChange = () => {
      setDimensions(getCurrentDimensions())
    }
    const dimensionsEventSubscription = Dimensions.addEventListener("change", onChange)
    return () => dimensionsEventSubscription.remove()
  }, [])

  return (
    <ScreenDimensionsContext.Provider value={{ ...dimensions, safeAreaInsets }}>
      {children}
    </ScreenDimensionsContext.Provider>
  )
}

/**
 * Call during render to be notified whenever `screenDimensions` changes
 */
export function useScreenDimensions() {
  return useContext(ScreenDimensionsContext)
}

/**
 * The following components have slightly different sizing dimensions based on the iPhone model
 * This file passes in the correct values based on the screen size
 *
 * Large:
 * iPhone XS Max/iphone XR: screenSize = 896
 *
 * Small:
 * iphone SE/iphone 5s: screenSize = 568
 *
 * Standard:
 * iPhone X/iphone XS: screenSize = 812
 * iPhone 6/iPhone 6 Plus/iPhone 6s/iPhone 6s Plus/iPhone 7/iphone 8/iphone 8 Plus: screenSize = 667
 *
 */

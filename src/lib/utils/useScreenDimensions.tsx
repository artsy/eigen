import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { createContext, useContext, useEffect, useState } from "react"
import React from "react"
import { Dimensions } from "react-native"
import { SafeAreaConsumer, SafeAreaProvider } from "react-native-safe-area-context"

export type ScreenOrientation = "landscape" | "portrait"

export interface ScreenDimensions {
  width: number
  height: number
  orientation: ScreenOrientation
}

export interface ScreenDimensionsWithSafeAreas extends ScreenDimensions {
  safeAreaInsets: SafeAreaInsets
}

export const ScreenDimensionsContext = createContext<ScreenDimensionsWithSafeAreas>(
  null as any /* STRICTNESS_MIGRATION */
)

function getCurrentDimensions(): ScreenDimensions {
  const { width, height } = Dimensions.get("screen")
  return {
    width,
    height,
    orientation: width > height ? "landscape" : "portrait",
  }
}

export const ProvideScreenDimensions: React.FC = ({ children }) => {
  const [dimensions, setDimensions] = useState<ScreenDimensions>(getCurrentDimensions())

  useEffect(() => {
    const onChange = () => {
      setDimensions(getCurrentDimensions())
    }
    Dimensions.addEventListener("change", onChange)
    return () => {
      Dimensions.removeEventListener("change", onChange)
    }
  }, [])

  return (
    <SafeAreaProvider>
      <SafeAreaConsumer>
        {safeAreaInsets => {
          safeAreaInsets = safeAreaInsets || { top: 20, bottom: 0, left: 0, right: 0 }
          return (
            <ScreenDimensionsContext.Provider value={{ ...dimensions, safeAreaInsets }}>
              {children}
            </ScreenDimensionsContext.Provider>
          )
        }}
      </SafeAreaConsumer>
    </SafeAreaProvider>
  )
}

/**
 * Call during render to be notified whenever `screenDimensions` changes
 */
export function useScreenDimensions() {
  return useContext(ScreenDimensionsContext)
}

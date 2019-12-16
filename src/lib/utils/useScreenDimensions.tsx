import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { isEqual } from "lodash"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import React from "react"
import { NativeEventEmitter, NativeModules } from "react-native"

export type ScreenOrientation = "landscape" | "portrait"

export interface ScreenDimensions {
  width: number
  height: number
  orientation: ScreenOrientation
  safeAreaInsets: SafeAreaInsets
}

const ScreenDimensionsContext = createContext<ScreenDimensions>(null)

const changes = new NativeEventEmitter(NativeModules.ARDynamicScreenDimensions)

let screenDimensions: ScreenDimensions = {
  width: NativeModules.ARDynamicScreenDimensions.width,
  height: NativeModules.ARDynamicScreenDimensions.height,
  orientation: NativeModules.ARDynamicScreenDimensions.orientation,
  safeAreaInsets: NativeModules.ARDynamicScreenDimensions.safeAreaInsets,
}

export const getCurrentScreenDimensions = () => screenDimensions

changes.addListener("change", nextScreenDimensions => {
  screenDimensions = nextScreenDimensions
})

export const ProvideScreenDimensions: React.FC = ({ children }) => {
  const [dimensions, setDimensions] = useState<ScreenDimensions>(screenDimensions)

  const onChange = useCallback(
    nextScreenDimensions => {
      // just guarantee that this happens before any renders
      screenDimensions = nextScreenDimensions
      if (!isEqual(dimensions, nextScreenDimensions)) {
        setDimensions(nextScreenDimensions)
      }
    },
    [dimensions]
  )

  useEffect(
    () => {
      changes.addListener("change", onChange)
      return () => {
        changes.removeListener("change", onChange)
      }
    },
    [onChange]
  )

  return <ScreenDimensionsContext.Provider value={dimensions}>{children}</ScreenDimensionsContext.Provider>
}

/**
 * Call during render to be notified whenever `screenDimensions` changes
 */
export function useScreenDimensions() {
  return useContext(ScreenDimensionsContext)
}

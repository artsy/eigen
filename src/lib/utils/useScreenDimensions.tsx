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

const ScreenDimenionsContext = createContext<ScreenDimensions>(null)

const changes = new NativeEventEmitter(NativeModules.RNDynamicScreenDimensions)

let screenDimensions: ScreenDimensions = {
  width: NativeModules.RNDynamicScreenDimensions.width,
  height: NativeModules.RNDynamicScreenDimensions.height,
  orientation: NativeModules.RNDynamicScreenDimensions.orientation,
  safeAreaInsets: NativeModules.RNDynamicScreenDimensions.safeAreaInsets,
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

  return <ScreenDimenionsContext.Provider value={dimensions}>{children}</ScreenDimenionsContext.Provider>
}

/**
 * Call during render to be notified whenever `screenDimensions` changes
 */
export function useScreenDimensions() {
  return useContext(ScreenDimenionsContext)
}

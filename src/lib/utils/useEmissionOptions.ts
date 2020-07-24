import { isEqual } from "lodash"
import { useEffect, useState } from "react"
import { EmissionOptions, NativeEventEmitter, NativeModules } from "react-native"

const { Emission } = NativeModules

const emitter = new NativeEventEmitter(Emission as any)

/**
 * Keeping track of the latest emission options (lab options and echo features)
 */
let latestOptions = Emission.options

const setLatestIfChanged = (freshAndPossiblyChanged: typeof latestOptions) => {
  if (!isEqual(latestOptions, freshAndPossiblyChanged)) {
    latestOptions = freshAndPossiblyChanged
  }
}

/**
 * We keep one listener in total, no matter how many times we use the hook.
 * If the event fires **after** RN is initiated, then the listener callback will execute.
 */
emitter.addListener("featuresDidChange", fresh => setLatestIfChanged(fresh))

/**
 * If the event fires **before** RN is initiated, then we never will get this event on
 * the RN side, so we need to assume that we need to get the fresh options at start.
 * This is not a big cost, as it's exactly one time calling from RN to native code and
 * getting back an answer.
 */
Emission.getFreshOptions((_error, fresh) => setLatestIfChanged(fresh))

export const useEmissionOptions = () => {
  const [opts, setOpts] = useState(latestOptions)

  // refresh if we get new data from the emitter
  useEffect(() => {
    if (!isEqual(opts, latestOptions)) {
      setOpts(latestOptions)
    }
  }, [latestOptions])

  return opts
}

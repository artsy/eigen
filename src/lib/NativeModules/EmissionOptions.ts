import { isEqual } from "lodash"
import { useEffect, useState } from "react"
import { NativeEventEmitter, NativeModules } from "react-native"

const { Emission } = NativeModules

const emitter = new NativeEventEmitter(Emission as any)

// Keeping track of the latest emission options (lab options and echo features)
let fresh = Emission.options

/**
 * The way we keep track of the latest features is by listening to the event below.
 * If this event happens after RN is initiated, then we set `needsRefresh` to true,
 * and the `useEffect` will take care of refreshing the options.
 * If this event happens before RN is initiated, then we never will get this event on
 * the RN side, so we need to assume that we need to refresh at the start.
 * This is not a big cost, as it's exactly one time calling from RN to native code and
 * getting back an answer.
 */
let needsRefresh = true
emitter.addListener("featuresDidChange", () => {
  needsRefresh = true
})

export const useEmissionOptions = () => {
  const [opts, setOpts] = useState(fresh)

  // If `fresh` changes, make sure to reflect that in the `opts` this hook return.
  useEffect(() => {
    setOpts(fresh)
  }, [fresh])

  // If we need to refresh, do that here
  useEffect(() => {
    if (needsRefresh) {
      Emission.getFreshOptions((_error, freshOptions) => {
        if (!isEqual(fresh, freshOptions)) {
          fresh = freshOptions
        }
        needsRefresh = false
      })
    }
  }, [needsRefresh])

  return opts
}

import { isEqual } from "lodash"
import { useEffect, useState } from "react"
import { NativeEventEmitter, NativeModules } from "react-native"

const { Emission } = NativeModules

const emitter = new NativeEventEmitter(Emission as any)

/**
 * The way we keep track of the latest features is by listening to the event below.
 * If this event happens after RN is initiated, then we set `needsRefresh` to true,
 * and the `useEffect` will take care of refreshing the options.
 * If this event happens before RN is initiated, then we never will get this event on
 * the RN side, so we need to assume that we need to refresh at the start.
 * This is not a big cost, as it's exactly one time calling from RN to native code and
 * getting back an answer.
 */
export const useEmissionOption = () => {
  const [opts, setOpts] = useState(Emission.options)

  const getFresh = () => {
    Emission.getFreshOptions((_error, freshOptions) => {
      console.log({ wowow1: freshOptions.AREnableViewingRooms })
      if (!isEqual(opts, freshOptions)) {
        setOpts(freshOptions)
      }
    })
  }

  // always pull the fresh ones from native on the beginning
  useEffect(getFresh, []) ///// check xcode,  when is that called?

  useEffect(() => {
    const listener = emitter.addListener("featuresDidChange", getFresh)
    return () => listener.remove()
  }, [])

  console.log({ wowow: opts.AREnableViewingRooms })
  return opts
}

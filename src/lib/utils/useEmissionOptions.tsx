import { isEqual } from "lodash"
import React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { NativeEventEmitter, NativeModules } from "react-native"

const { Emission } = NativeModules

const emitter = new NativeEventEmitter(Emission as any)

const useEmissionOptionsInner = () => {
  const [opts, setOpts] = useState(Emission.options)

  const getFresh = () => {
    Emission.getFreshOptions((_error, freshOptions) => {
      console.log({ wowow1: freshOptions.AREnableViewingRooms })
      if (!isEqual(opts, freshOptions)) {
        setOpts(freshOptions)
      }
    })
  }

  // in case the event is fired **after** RN is initiated
  useEffect(() => {
    const listener = emitter.addListener("featuresDidChange", getFresh)
    return () => listener.remove()
  }, [])

  // in case the event is fired **before** RN is initiated,
  // so we go get them from the bridge
  useEffect(getFresh, []) ///// check xcode,  when is that called?

  console.log({ wowow: opts.AREnableViewingRooms })
  return opts
}

// wrapping the above hook in context, so we only call `getFresh` to go over the bridge once,
// and only have one listener. By itself, the above hook would go over the bridge once per hook.
const EmissionOptionsContext = createContext(Emission.options)

export const ProvideEmissionOptions: React.FC = props => {
  // const opts = useEmissionOptionsInner()

  const [opts, setOpts] = useState(Emission.options)

  const getFresh = () => {
    console.log("wowow will get")
    Emission.getFreshOptions((_error, freshOptions) => {
      console.log({ wowow1: freshOptions.AREnableViewingRooms })
      if (!isEqual(opts, freshOptions)) {
        setOpts(freshOptions)
      }
    })
  }

  // in case the event is fired **after** RN is initiated
  useEffect(() => {
    const listener = emitter.addListener("featuresDidChange", getFresh)
    return () => listener.remove()
  }, [])

  // in case the event is fired **before** RN is initiated,
  // so we go get them from the bridge
  useEffect(getFresh, []) ///// check xcode,  when is that called?

  console.log({ wowow: opts.AREnableViewingRooms })
  // return opts

  return <EmissionOptionsContext.Provider {...props} value={opts} />
}

export const useEmissionOptions = () => {
  console.log("wowow hook")
  return useContext(EmissionOptionsContext)
}

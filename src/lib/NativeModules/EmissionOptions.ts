import { isEqual } from "lodash"
import { useEffect, useState } from "react"
import { NativeEventEmitter, NativeModules } from "react-native"

const { Emission } = NativeModules

const emitter = new NativeEventEmitter(Emission as any)

let needsRefreshing = false

export const useEmissionOptions = () => {
  const [refreshedOptions, setRefreshedOptions] = useState(Emission.options)

  useEffect(() => {
    const listener = emitter.addListener("featuresDidChange", data => {
      console.log("wowowowow1")
      console.log({ arenableview1: data.AREnableViewingRooms })

      if (!isEqual(refreshedOptions, data)) {
        setRefreshedOptions(data)
      }

      return () => listener.remove()
    })
  })

  Emission.getFreshOptions((error, freshOptions) => {
    console.log("wowowowow2")
    console.log({ arenableview2: freshOptions.AREnableViewingRooms })
    if (!isEqual(refreshedOptions, freshOptions)) {
      setRefreshedOptions(freshOptions)
    }
  })

  console.log({ arenableview: refreshedOptions.AREnableViewingRooms })
  return refreshedOptions
}

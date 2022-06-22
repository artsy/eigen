// @ts-expect-error untyped package
import { ActionCable, Cable } from "@kesha-antonov/react-native-action-cable"
import { useIsStaging } from "app/store/GlobalStore"
import React, { createContext, useContext, useEffect, useState } from "react"
import Config from "react-native-config"

interface GravityWebsocketContextValueType {
  cable: any
  channelsHolder: any
}

const WebsocketContext = createContext<GravityWebsocketContextValueType>(null!)

export const GravityWebsocketContextProvider: React.FC = ({ children }) => {
  const [actionCable, setActionCable] = useState<any>(null)
  const [channelsHolder, setChannelsHolder] = useState<any>(null)

  const isStaging = useIsStaging()
  const wssUrl = isStaging ? Config.GRAVITY_STAGING_WEBSOCKET_URL : Config.GRAVITY_WEBSOCKET_URL

  useEffect(() => {
    if (__DEV__) {
      ActionCable.startDebugging()
    }

    try {
      const cable = ActionCable.createConsumer(wssUrl)
      setChannelsHolder(new Cable({}))
      setActionCable(cable)
    } catch (e) {
      console.log("actioncable error:", e)
    }

    return () => {
      actionCable?.disconnect()

      if (__DEV__) {
        ActionCable.stopDebugging()
      }
    }
  }, [wssUrl])

  return (
    <WebsocketContext.Provider value={{ cable: actionCable, channelsHolder }}>
      {children}
    </WebsocketContext.Provider>
  )
}

export const useCable = () => {
  const context = useContext(WebsocketContext)
  if (!context) {
    throw new Error("useCable must be used within a WebsocketContext")
  }
  return context
}

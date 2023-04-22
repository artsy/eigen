// @ts-expect-error untyped package
import { ActionCable, Cable } from "@kesha-antonov/react-native-action-cable"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import React, { createContext, useContext, useEffect, useState } from "react"
import Config from "react-native-config"

interface GravityWebsocketContextValueType {
  cable: any | null
  channelsHolder: any | null
}

const initialValues = {
  cable: null,
  channelsHolder: null,
}

const WebsocketContext = createContext<GravityWebsocketContextValueType>(initialValues)

export const GravityWebsocketContextProvider: React.FC = ({ children }) => {
  const [actionCable, setActionCable] = useState<any | null>(null)
  const [channelsHolder, setChannelsHolder] = useState<any | null>(null)

  const isStaging = useIsStaging()
  const wssUrl = isStaging ? Config.GRAVITY_STAGING_WEBSOCKET_URL : Config.GRAVITY_WEBSOCKET_URL

  useEffect(() => {
    if (!actionCable) {
      const cable = ActionCable.createConsumer(wssUrl)
      setChannelsHolder(new Cable({}))
      setActionCable(cable)
      if (__DEV__) {
        ActionCable.startDebugging()
      }
    }
    return () => {
      actionCable?.disconnect()
      if (__DEV__) {
        ActionCable.stopDebugging()
      }
    }
  }, [isStaging])

  return (
    <WebsocketContext.Provider value={{ cable: actionCable, channelsHolder }}>
      {children}
    </WebsocketContext.Provider>
  )
}

export const useCable = () => {
  const websocketContext = useContext(WebsocketContext) ?? {}
  return websocketContext
}

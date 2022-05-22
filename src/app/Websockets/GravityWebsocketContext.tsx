import { Consumer, createConsumer, Mixin, Subscription } from "@rails/actioncable"
import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import Config from "react-native-config"

interface ReceivedData {
  [key: string]: string
}

interface GravityWebsocketContextProps {
  data: ReceivedData
}

interface ConnectionCallbacks {
  received?: (data: ReceivedData) => void
  initialized?: () => void
  connected?: () => void
  disconnected?: () => void
}

interface GravityWebsocketContextProviderProps {
  enabled: boolean
  channelInfo: {
    channel: string
    [id: string]: string | undefined
  }
  callbacks: ConnectionCallbacks
}

const initialValues = {
  data: {} as ReceivedData,
}

const WebsocketContext = createContext<GravityWebsocketContextProps>(initialValues)

export const GravityWebsocketContextProvider: React.FC<GravityWebsocketContextProviderProps> = ({
  channelInfo,
  enabled,
  children,
  callbacks = {},
}) => {
  const [receivedData, setReceivedData] = useState(initialValues)

  const channelRef = useRef<Subscription<Consumer> & Mixin & ConnectionCallbacks>()

  const cable = createConsumer(Config.GRAVITY_WEBSOCKET_URL)

  useEffect(() => {
    if (!enabled) {
      return
    }
    // unsubscribe first if channel info changes
    unsubscribe()

    subscribe()

    return () => {
      unsubscribe()
    }
  }, [channelInfo, enabled])

  const subscribe = () => {
    const channel = cable.subscriptions.create(
      { ...channelInfo },
      {
        received: (data: ReceivedData) => {
          setReceivedData({ data })
          callbacks.received?.(data)
        },
        initialized: () => {
          callbacks.initialized?.()
        },
        connected: () => {
          callbacks.connected?.()
        },
        disconnected: () => {
          callbacks.disconnected?.()
        },
      }
    )

    channelRef.current = channel
  }

  const unsubscribe = () => {
    if (channelRef.current) {
      channelRef.current.unsubscribe()
    }
  }

  return <WebsocketContext.Provider value={receivedData}>{children}</WebsocketContext.Provider>
}

export const useGravityWebsocketContext = () => {
  const websocketContext = useContext(WebsocketContext) ?? {}
  return websocketContext
}

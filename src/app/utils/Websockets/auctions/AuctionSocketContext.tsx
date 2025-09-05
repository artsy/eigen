import { GlobalStore } from "app/store/GlobalStore"
import { useCable } from "app/utils/Websockets/GravityWebsocketContext"
import React, { createContext, useContext, useEffect, useState } from "react"

interface ReceivedData {
  [key: string]: string
}

interface AuctionWebsocketContextProps {
  data: ReceivedData
}

interface ConnectionCallbacks {
  received?: (data: ReceivedData) => void
  rejected?: () => void
  connected?: () => void
  disconnected?: () => void
}

export interface AuctionWebsocketChannelInfo {
  channel: string
  [id: string]: string | undefined
}

export interface AuctionWebsocketContextProviderProps {
  enabled: boolean
  channelInfo: AuctionWebsocketChannelInfo
  callbacks?: ConnectionCallbacks
}

const initialValues = {
  data: {} as ReceivedData,
}

const WebsocketContext = createContext<AuctionWebsocketContextProps>(initialValues)

export const AuctionWebsocketContextProvider: React.FC<
  React.PropsWithChildren<AuctionWebsocketContextProviderProps>
> = ({ channelInfo, enabled, children, callbacks = {} }) => {
  const [receivedData, setReceivedData] = useState(initialValues)
  const [channelKey, setChannelKey] = useState<string | undefined>(undefined)

  const xappToken = GlobalStore.useAppState((state) => state.auth.xAppToken)

  const { cable, channelsHolder } = useCable()

  useEffect(() => {
    if (!enabled) {
      return
    }

    subscribe()

    return () => {
      unsubscribe()
    }
  }, [enabled])

  const subscribe = () => {
    const theChannelKey = `sales:${channelInfo.sale_id}`
    const channel = channelsHolder?.setChannel(
      theChannelKey,
      cable?.subscriptions.create({
        ...channelInfo,
        xapp_token: xappToken,
      })
    )
    if (channel) {
      channel
        .on("received", onReceived)
        .on("connected", onConnected)
        .on("disconnected", onDisconnected)
        .on("rejected", onRejected)
    }

    setChannelKey(theChannelKey)
  }

  const unsubscribe = () => {
    if (channelKey) {
      const channel = cable.channel(channelKey)
      if (channel) {
        channel
          .removeListener("received", onReceived)
          .removeListener("connected", onConnected)
          .removeListener("rejected", onRejected)
          .removeListener("disconnected", onDisconnected)
        channel.unsubscribe()
        delete cable.channels[channelKey]
      }
    }
  }

  const onReceived = (data: ReceivedData) => {
    setReceivedData({ data })
    callbacks.received?.(data)
  }

  const onConnected = () => {
    callbacks.connected?.()
  }

  const onDisconnected = () => {
    callbacks.disconnected?.()
  }

  const onRejected = () => {
    callbacks.rejected?.()
  }

  return <WebsocketContext.Provider value={receivedData}>{children}</WebsocketContext.Provider>
}

export const useAuctionWebsocketContext = () => {
  const websocketContext = useContext(WebsocketContext) ?? {}
  return websocketContext
}

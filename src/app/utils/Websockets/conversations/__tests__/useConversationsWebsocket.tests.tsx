import { renderHook } from "@testing-library/react-native"
import { GlobalStoreProvider, __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useCable } from "app/utils/Websockets/GravityWebsocketContext"
import {
  ConversationsWebsocketEvent,
  useConversationsWebsocket,
} from "app/utils/Websockets/conversations/useConversationsWebsocket"

jest.mock("app/utils/Websockets/GravityWebsocketContext", () => ({
  useCable: jest.fn(),
}))

describe("useConversationsWebsocket", () => {
  const mockUseCable = useCable as jest.Mock

  let channelListeners: { [event: string]: (data?: any) => void }
  let mockChannel: any
  let mockCable: any
  let mockChannelsHolder: any
  let mockSubscription: any

  beforeEach(() => {
    jest.clearAllMocks()

    channelListeners = {}
    mockChannel = {
      on: jest.fn((event: string, handler: (data?: any) => void) => {
        channelListeners[event] = handler
        return mockChannel
      }),
      removeListener: jest.fn(() => mockChannel),
      unsubscribe: jest.fn(),
    }
    mockSubscription = { unsubscribe: jest.fn() }
    mockCable = {
      subscriptions: { create: jest.fn(() => mockSubscription) },
    }
    mockChannelsHolder = {
      setChannel: jest.fn((key: string) => {
        mockChannelsHolder.channels[key] = mockChannel
        return mockChannel
      }),
      channels: {},
    }
    mockUseCable.mockReturnValue({ cable: mockCable, channelsHolder: mockChannelsHolder })

    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationsRealtime: true })
    __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "user-access-token" } })
  })

  const renderTheHook = (
    params: {
      subscriptionKey?: string
      enabled?: boolean
      onEvent?: jest.Mock
      onConnected?: jest.Mock
    } = {}
  ) => {
    const onEvent = params.onEvent ?? jest.fn()
    const onConnected = params.onConnected
    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <GlobalStoreProvider>{children}</GlobalStoreProvider>
    }
    const utils = renderHook(
      (props: { subscriptionKey: string }) => {
        return useConversationsWebsocket({
          subscriptionKey: props.subscriptionKey,
          enabled: params.enabled,
          onEvent,
          onConnected,
        })
      },
      { wrapper, initialProps: { subscriptionKey: params.subscriptionKey ?? "inbox" } }
    )
    return { ...utils, onEvent, onConnected }
  }

  it("subscribes to the ConversationsChannel with the user's access token", () => {
    renderTheHook()

    expect(mockCable.subscriptions.create).toHaveBeenCalledWith({
      channel: "ConversationsChannel",
      access_token: "user-access-token",
      key: "inbox",
    })
    expect(mockChannelsHolder.setChannel).toHaveBeenCalledWith(
      "conversations:inbox",
      expect.anything()
    )
  })

  it("invokes onEvent when a message event is received", () => {
    const { onEvent } = renderTheHook()

    const event: ConversationsWebsocketEvent = {
      type: "message.sent",
      conversation_id: "conversation-1",
      message_id: "message-1",
    }
    channelListeners.received(event)

    expect(onEvent).toHaveBeenCalledWith(event)
  })

  it("invokes onConnected on reconnects but not on the initial connection", () => {
    const onConnected = jest.fn()
    renderTheHook({ onConnected })

    channelListeners.connected()
    expect(onConnected).not.toHaveBeenCalled()

    channelListeners.connected()
    expect(onConnected).toHaveBeenCalledTimes(1)
  })

  it("unsubscribes from the channel on unmount", () => {
    const { unmount } = renderTheHook()

    expect(mockChannelsHolder.channels["conversations:inbox"]).toBe(mockChannel)

    unmount()

    expect(mockChannel.removeListener).toHaveBeenCalledWith("received", expect.any(Function))
    expect(mockChannel.removeListener).toHaveBeenCalledWith("connected", expect.any(Function))
    expect(mockChannel.unsubscribe).toHaveBeenCalled()
    expect(mockChannelsHolder.channels["conversations:inbox"]).toBeUndefined()
  })

  it("resubscribes when the subscriptionKey changes", () => {
    const { rerender } = renderTheHook({ subscriptionKey: "inbox" })

    rerender({ subscriptionKey: "conversation:123" })

    expect(mockChannel.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mockChannelsHolder.channels["conversations:inbox"]).toBeUndefined()
    expect(mockChannelsHolder.setChannel).toHaveBeenLastCalledWith(
      "conversations:conversation:123",
      expect.anything()
    )
  })

  it("unsubscribes the created subscription when setChannel returns nothing", () => {
    mockChannelsHolder.setChannel = jest.fn(() => undefined)

    renderTheHook()

    expect(mockSubscription.unsubscribe).toHaveBeenCalled()
  })

  it("does not subscribe when disabled", () => {
    renderTheHook({ enabled: false })

    expect(mockCable.subscriptions.create).not.toHaveBeenCalled()
  })

  it("does not subscribe when the feature flag is off", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationsRealtime: false })

    renderTheHook()

    expect(mockCable.subscriptions.create).not.toHaveBeenCalled()
  })

  it("does not subscribe without a user access token", () => {
    __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: null } })

    renderTheHook()

    expect(mockCable.subscriptions.create).not.toHaveBeenCalled()
  })
})

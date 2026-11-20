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

  const renderTheHook = async (
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
    const utils = await renderHook(
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

  it("subscribes to the ConversationsChannel with the user's access token", async () => {
    await renderTheHook()

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

  it("invokes onEvent when a message event is received", async () => {
    const { onEvent } = await renderTheHook()

    const event: ConversationsWebsocketEvent = {
      type: "message.sent",
      conversation_id: "conversation-1",
      message_id: "message-1",
    }
    channelListeners.received(event)

    expect(onEvent).toHaveBeenCalledWith(event)
  })

  it("invokes onConnected on reconnects but not on the initial connection", async () => {
    const onConnected = jest.fn()
    await renderTheHook({ onConnected })

    channelListeners.connected()
    expect(onConnected).not.toHaveBeenCalled()

    channelListeners.connected()
    expect(onConnected).toHaveBeenCalledTimes(1)
  })

  it("invokes onConnected on the first connection after a resubscribe", async () => {
    const onConnected = jest.fn()
    const { rerender } = await renderTheHook({ subscriptionKey: "inbox", onConnected })

    // Initial connection is skipped — the consumer fetches on mount.
    channelListeners.connected()
    expect(onConnected).not.toHaveBeenCalled()

    // Resubscribing (e.g. `enabled` toggled with screen focus) should
    // surface the new subscription's first `connected` as a catch-up.
    await rerender({ subscriptionKey: "conversation:123" })
    channelListeners.connected()
    expect(onConnected).toHaveBeenCalledTimes(1)
  })

  it("unsubscribes from the channel on unmount", async () => {
    const { unmount } = await renderTheHook()

    expect(mockChannelsHolder.channels["conversations:inbox"]).toBe(mockChannel)

    await unmount()

    expect(mockChannel.removeListener).toHaveBeenCalledWith("received", expect.any(Function))
    expect(mockChannel.removeListener).toHaveBeenCalledWith("connected", expect.any(Function))
    expect(mockChannel.unsubscribe).toHaveBeenCalled()
    expect(mockChannelsHolder.channels["conversations:inbox"]).toBeUndefined()
  })

  it("resubscribes when the subscriptionKey changes", async () => {
    const { rerender } = await renderTheHook({ subscriptionKey: "inbox" })

    await rerender({ subscriptionKey: "conversation:123" })

    expect(mockChannel.unsubscribe).toHaveBeenCalledTimes(1)
    expect(mockChannelsHolder.channels["conversations:inbox"]).toBeUndefined()
    expect(mockChannelsHolder.setChannel).toHaveBeenLastCalledWith(
      "conversations:conversation:123",
      expect.anything()
    )
  })

  it("unsubscribes the created subscription when setChannel returns nothing", async () => {
    mockChannelsHolder.setChannel = jest.fn(() => undefined)

    await renderTheHook()

    expect(mockSubscription.unsubscribe).toHaveBeenCalled()
  })

  it("does not subscribe when disabled", async () => {
    await renderTheHook({ enabled: false })

    expect(mockCable.subscriptions.create).not.toHaveBeenCalled()
  })

  it("does not subscribe when the feature flag is off", async () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationsRealtime: false })

    await renderTheHook()

    expect(mockCable.subscriptions.create).not.toHaveBeenCalled()
  })

  it("does not subscribe without a user access token", async () => {
    __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: null } })

    await renderTheHook()

    expect(mockCable.subscriptions.create).not.toHaveBeenCalled()
  })
})

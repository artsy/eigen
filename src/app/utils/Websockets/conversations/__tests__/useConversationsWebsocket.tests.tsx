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
    mockCable = {
      subscriptions: { create: jest.fn(() => ({})) },
      channels: {},
    }
    mockChannelsHolder = {
      setChannel: jest.fn(() => mockChannel),
    }
    mockUseCable.mockReturnValue({ cable: mockCable, channelsHolder: mockChannelsHolder })

    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationsRealtime: true })
    __globalStoreTestUtils__?.injectState({ auth: { userAccessToken: "user-access-token" } })
  })

  const renderTheHook = (
    params: { subscriptionKey?: string; enabled?: boolean; onEvent?: jest.Mock } = {}
  ) => {
    const onEvent = params.onEvent ?? jest.fn()
    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return <GlobalStoreProvider>{children}</GlobalStoreProvider>
    }
    const utils = renderHook(
      () => {
        return useConversationsWebsocket({
          subscriptionKey: params.subscriptionKey ?? "inbox",
          enabled: params.enabled,
          onEvent,
        })
      },
      { wrapper }
    )
    return { ...utils, onEvent }
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

  it("unsubscribes from the channel on unmount", () => {
    const { unmount } = renderTheHook()

    unmount()

    expect(mockChannel.removeListener).toHaveBeenCalledWith("received", expect.any(Function))
    expect(mockChannel.unsubscribe).toHaveBeenCalled()
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

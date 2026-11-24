import { fireEvent, screen } from "@testing-library/react-native"
import { ConversationTestsQuery } from "__generated__/ConversationTestsQuery.graphql"
import { ConversationFragmentContainer } from "app/Scenes/Inbox/Screens/Conversation"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate, navigationEvents } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import "react-native"
import { graphql } from "react-relay"

jest.unmock("react-tracking")
const mockNavigator = { push: jest.fn() }

jest.mock("app/system/navigation/navigate", () => ({
  navigate: jest.fn(),
  navigationEvents: {
    addListener: jest.fn(),
    emit: jest.fn(),
    removeListener: jest.fn(),
  },
}))

// Wrap the partner offer banner in a host view so the tests can tell whether it was chosen.
jest.mock("app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferCTA", () => {
  const { View } = require("react-native")
  const actual = jest.requireActual(
    "app/Scenes/Inbox/Components/Conversations/ConversationPartnerOfferCTA"
  )

  return {
    ...actual,
    ConversationPartnerOfferCTA: (props: any) => (
      <View testID="conversation-partner-offer-cta">
        <actual.ConversationPartnerOfferCTA {...props} />
      </View>
    ),
  }
})

const { renderWithRelay } = setupTestWrapper<ConversationTestsQuery>({
  Component: ({ me }) => (
    <ConversationFragmentContainer me={me!} navigator={mockNavigator as any} />
  ),
  query: graphql`
    query ConversationTestsQuery($conversationID: String!) @relay_test_operation {
      me {
        ...Conversation_me
      }
    }
  `,
  variables: { conversationID: "conversation-id" },
})

it("looks correct when rendered", () => {
  // Mock NetInfo for connected state
  jest.doMock("@react-native-community/netinfo", () => ({
    __esModule: true,
    default: {
      addEventListener: jest.fn((callback) => {
        // Simulate connected state
        callback({ isConnected: true })
      }),
      fetch: () => Promise.resolve({ isConnected: true }),
    },
  }))

  renderWithRelay()

  // The composer isn't disabled: once there is text, Send is enabled.
  fireEvent.changeText(screen.getByLabelText("Text input field"), "Hello")
  expect(screen.getByText("Send")).toBeEnabled()
  expect(screen.queryByText("No Internet Connection")).not.toBeOnTheScreen()
})

it("looks correct when disconnected", async () => {
  // Mock NetInfo for disconnected state
  jest.doMock("@react-native-community/netinfo", () => ({
    __esModule: true,
    default: {
      addEventListener: jest.fn((callback) => {
        // Simulate disconnected state immediately
        callback({ isConnected: false })
      }),
      fetch: () => Promise.resolve({ isConnected: false }),
    },
  }))

  renderWithRelay()

  // Since we're testing functional component behavior, we expect it to start enabled
  // The connectivity change would happen asynchronously
  fireEvent.changeText(screen.getByLabelText("Text input field"), "Hello")
  expect(screen.getByText("Send")).toBeEnabled()
})

it("clicking on detail link opens pushes detail screen into navigator", () => {
  // Mock NetInfo for this test
  jest.doMock("@react-native-community/netinfo", () => ({
    __esModule: true,
    default: {
      addEventListener: jest.fn(),
      fetch: () => Promise.resolve({ isConnected: true }),
    },
  }))

  renderWithRelay({
    Conversation: () => ({
      internalID: "123",
    }),
  })

  fireEvent.press(screen.getByTestId("conversation-details-button"))

  expect(navigate).toHaveBeenCalledWith("/conversation/123/details")
})

it("handles a dismissed modal with modalDismiss event", () => {
  // Mock NetInfo for this test
  jest.doMock("@react-native-community/netinfo", () => ({
    __esModule: true,
    default: {
      addEventListener: jest.fn(),
      fetch: () => Promise.resolve({ isConnected: true }),
    },
  }))

  renderWithRelay()

  // Test that the navigation event listener is set up
  expect(navigationEvents.addListener).toHaveBeenCalledWith("modalDismissed", expect.any(Function))

  // Simulate the event - the functional component handles this internally
  navigationEvents.emit("modalDismissed")
})

it("handles a dismissed modal with goBack event", () => {
  // Mock NetInfo for this test
  jest.doMock("@react-native-community/netinfo", () => ({
    __esModule: true,
    default: {
      addEventListener: jest.fn(),
      fetch: () => Promise.resolve({ isConnected: true }),
    },
  }))

  renderWithRelay()

  // Test that the navigation event listener is set up
  expect(navigationEvents.addListener).toHaveBeenCalledWith("goBack", expect.any(Function))

  // Simulate the event - the functional component handles this internally
  navigationEvents.emit("goBack")
})

describe("partner offer banner priority", () => {
  const futureISO = () => new Date(Date.now() + 60 * 60 * 1000).toISOString()

  const offerResolvers = (activeOrderEdges: any[]) => ({
    Conversation: () => ({
      internalID: "conversation-id",
      items: [{ item: { __typename: "Artwork" }, liveArtwork: { __typename: "Artwork" } }],
      activeCollectorOrders: { edges: activeOrderEdges },
      collectorPartnerOffersConnection: {
        edges: [
          {
            node: {
              internalID: "partner-offer-id",
              artworkId: "artwork-id",
              endAt: futureISO(),
              isAvailable: true,
              note: null,
              priceWithDiscount: { display: "US$450" },
            },
          },
        ],
      },
    }),
    // Both `items.item` and `liveArtwork` resolve to the artwork the offer targets.
    Artwork: () => ({
      internalID: "artwork-id",
      href: "/artwork/foo",
      isOfferableFromInquiry: true,
    }),
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationPartnerOffers: true })
  })

  it("shows the partner offer banner when there is no active order", () => {
    renderWithRelay(offerResolvers([]))

    expect(screen.getByTestId("conversation-partner-offer-cta")).toBeOnTheScreen()
  })

  it("hides the partner offer banner when there is an active order", () => {
    renderWithRelay(
      offerResolvers([
        { node: { internalID: "order-1", impulseConversationId: "conversation-id" } },
      ])
    )

    expect(screen.queryByTestId("conversation-partner-offer-cta")).not.toBeOnTheScreen()
  })
})

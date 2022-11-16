import { screen } from "@testing-library/react-native"
import { InboxScreenTestQuery } from "__generated__/InboxScreenTestQuery.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ReactNode } from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { InboxContainer, InboxPlaceholder } from "./Inbox"

jest.unmock("react-relay")

// impossible to test react-native-scrollable-tab-view without a mock
jest.mock("react-native-scrollable-tab-view", () => {
  return {
    __esModule: true, // needed to mock the default export
    default: (props: { children: ReactNode[] }) => {
      // Just render first child
      return props.children
    },
    DefaultTabBar: () => null,
  }
})

describe("renders Inbox component", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRendered = () => (
    <QueryRenderer<InboxScreenTestQuery>
      environment={mockEnvironment}
      query={graphql`
        query InboxScreenTestQuery @relay_test_operation {
          me {
            ...Inbox_me
          }
        }
      `}
      variables={{}}
      render={renderWithPlaceholder({
        // this is due to broken types with renderWithPlaceholder which is a legacy component
        // @ts-ignore
        Container: (props) => <InboxContainer {...props} isVisible />,
        renderPlaceholder: () => <InboxPlaceholder />,
      })}
    />
  )

  describe("Checking user bids", () => {
    it("Renders the placeholder 👹", async () => {
      renderWithWrappers(<TestRendered />)
      expect(screen.getByTestId("inbox-placeholder")).toBeTruthy()
    })

    it("NO active bids -> Inquiries tab is active", async () => {
      renderWithWrappers(<TestRendered />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          myBids: {
            active: [],
          },
        }),
      })
      await flushPromiseQueue()
      expect(screen.queryByTestId("tabWrapper-inquiries")).toHaveProp("isActiveTab", true)
      expect(screen.queryByTestId("tabWrapper-bids")).toHaveProp("isActiveTab", false)
    })

    it("Active bids -> Bids tab is active", async () => {
      renderWithWrappers(<TestRendered />)
      resolveMostRecentRelayOperation(mockEnvironment, {
        Me: () => ({
          myBids: {
            active: [{ sale: { internalID: "123" }, saleArtworks: { internalID: "456" } }],
          },
        }),
      })
      await flushPromiseQueue()
      expect(screen.queryByTestId("tabWrapper-bids")).toHaveProp("isActiveTab", true)
      expect(screen.queryByTestId("tabWrapper-inquiries")).toHaveProp("isActiveTab", false)
    })
  })
})

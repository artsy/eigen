import { screen } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { InboxTabs } from "./Inbox"

jest.unmock("react-relay")

describe("renders Tabs", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const tabs = ["Bids", "Inquiries"]
  const TestRendered = () => (
    <QueryRenderer
      environment={mockEnvironment}
      query={graphql`
        query InboxScreenTestQuery @relay_test_operation {
          me {
            ...Inbox_me
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props) {
          return <InboxTabs tabs={tabs} isVisible />
        }
        if (error) {
          console.log(error)
        }
      }}
    />
  )

  it("renders Tabs", async () => {
    renderWithWrappers(<TestRendered />)
    resolveMostRecentRelayOperation(mockEnvironment, {})
    await flushPromiseQueue()
    screen.debug()
  })
})

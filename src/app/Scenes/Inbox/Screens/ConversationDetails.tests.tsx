import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import React from "react"
import "react-native"
import { graphql } from "react-relay"
import { ConversationDetailsFragmentContainer } from "./ConversationDetails"

jest.unmock("react-relay")

describe("ConversationDetailsFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: ({ me }: any) => (
      <Theme>
        <ConversationDetailsFragmentContainer me={me} />
      </Theme>
    ),
    query: graphql`
      query ConversationDetails_Test_Query($conversationID: String!) {
        me {
          ...ConversationDetails_me
        }
      }
    `,
    variables: {
      conversationID: "test-conversation",
    },
  })

  it("render all elements", () => {
    const { getByText } = renderWithRelay()

    expect(getByText(/Order No/)).toBeDefined()
    expect(getByText("Ship to")).toBeDefined()
    expect(getByText("Payment Method")).toBeDefined()
    expect(getByText("Attachments")).toBeDefined()
    expect(getByText("Support")).toBeDefined()
    expect(getByText("Inquiries FAQ")).toBeDefined()
  })

  it("does not render order information given no order/offer present", () => {
    const { queryByText } = renderWithRelay({
      Conversation: () => ({
        orderConnection: {
          edges: [{ node: null }],
        },
      }),
    })

    expect(queryByText(/Order No/)).toBeNull()
    expect(queryByText("Ship to")).toBeNull()
    expect(queryByText("Payment Method")).toBeNull()
  })
})

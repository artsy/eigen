import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"
import { ItemInfoFragmentContainer } from "./ItemInfo"

jest.unmock("react-relay")

describe("ItemInfoFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: ({ me }: any) => (
      <Theme>
        <ItemInfoFragmentContainer item={me.conversation.items[0].item} />
      </Theme>
    ),
    query: graphql`
      query ItemInfo_Test_Query {
        me {
          conversation(id: "test-id") {
            items {
              item {
                ...ItemInfo_item
              }
            }
          }
        }
      }
    `,
  })

  it("render Artwork", () => {
    const { getByText } = renderWithRelay({
      Conversation: () => ({
        items: [
          {
            item: {
              __typename: "Artwork",
            },
          },
        ],
      }),
    })

    expect(getByText("Artwork")).toBeDefined()
  })

  it("render Show", () => {
    const { getByText } = renderWithRelay({
      Conversation: () => ({
        items: [
          {
            item: {
              __typename: "Show",
            },
          },
        ],
      }),
    })

    expect(getByText("Show")).toBeDefined()
  })

  it("throw error given unsupported __typename", () => {
    expect(() =>
      renderWithRelay({
        Conversation: () => ({
          items: [
            {
              item: {
                __typename: "Unsupported",
              },
            },
          ],
        }),
      })
    ).toThrowError("ConversationDetails ItemInfo: type not supported")
  })
})

import { ItemInfoFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/ItemInfo"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ItemInfoFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ me }: any) => <ItemInfoFragmentContainer item={me.conversation.items[0].item} />,
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

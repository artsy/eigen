import { screen } from "@testing-library/react-native"
import { AttachmentList_Test_Query } from "__generated__/AttachmentList_Test_Query.graphql"
import { AttachmentListFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/AttachmentList"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("AttachmentListFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper<AttachmentList_Test_Query>({
    Component: ({ me }) => <AttachmentListFragmentContainer conversation={me?.conversation!} />,
    query: graphql`
      query AttachmentList_Test_Query {
        me {
          conversation(id: "test-conversation") {
            ...AttachmentList_conversation
          }
        }
      }
    `,
  })

  it("render attachments", () => {
    renderWithRelay({
      Conversation: () => ({
        messagesConnection: {
          edges: [
            {
              node: {
                attachments: [
                  {
                    fileName: "testfile1.webp",
                    contentType: "image",
                  },
                  {
                    fileName: "testfile2.webp",
                    contentType: "image",
                  },
                ],
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("Attachments")).toBeDefined()
    expect(screen.getByText("testfile1.webp")).toBeDefined()
    expect(screen.getByText("testfile2.webp")).toBeDefined()
  })

  it("does not render given no attachment", () => {
    renderWithRelay({
      Conversation: () => ({
        messagesConnection: {
          edges: [{ node: null }],
        },
      }),
    })

    expect(screen.queryAllByText(/./)).toHaveLength(0)
  })
})

import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import React from "react"
import "react-native"
import { graphql } from "react-relay"
import { AttachmentListFragmentContainer } from "./AttachmentList"

jest.unmock("react-relay")

describe("AttachmentListFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: ({ me }) => (
      <Theme>
        <AttachmentListFragmentContainer conversation={me.conversation} />
      </Theme>
    ),
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
    const { getByText } = renderWithRelay({
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

    expect(getByText("Attachments")).toBeDefined()
    expect(getByText("testfile1.webp")).toBeDefined()
    expect(getByText("testfile2.webp")).toBeDefined()
  })

  it("does not render given no attachment", () => {
    const { queryAllByText } = renderWithRelay({
      Conversation: () => ({
        messagesConnection: {
          edges: [{ node: null }],
        },
      }),
    })

    expect(queryAllByText(/./g)).toHaveLength(0)
  })
})

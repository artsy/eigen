import { AttachmentList_messageConnection } from "__generated__/AttachmentList_messageConnection.graphql"
import { AttachmentListTestsQuery } from "__generated__/AttachmentListTestsQuery.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { AttachmentListFragmentContainer } from "../AttachmentList"
import { FileDownload } from "../FileDownload"

jest.unmock("react-relay")

describe("AttachmentListFragmentContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<AttachmentListTestsQuery>
      environment={env}
      query={graphql`
        query AttachmentListTestsQuery($conversationID: String!) @relay_test_operation {
          me {
            conversation(id: $conversationID) {
              messagesConnection {
                ...AttachmentList_messageConnection
              }
            }
          }
        }
      `}
      variables={{ conversationID: "1" }}
      render={({ props, error }) => {
        if (props) {
          return <AttachmentListFragmentContainer messageConnection={props.me?.conversation?.messagesConnection!} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("renders a FileDownload for each non-image ", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: meMock,
      })
    })
    const downloads = tree.root.findAllByType(FileDownload)
    expect(downloads.length).toBe(2)
    expect(downloads[0].props.tiny).toBe(true)
    expect(downloads[0].props.attachment.downloadURL).toBe("http://example.com/happylittleaccident.txt")
  })
})

const messageMock: Omit<
  NonNullable<NonNullable<NonNullable<AttachmentList_messageConnection["edges"]>[0]>["node"]>["attachments"],
  " $refType" | " $fragmentRefs"
> = {
  attachments: [
    {
      id: "1",
      fileName: "happylittleaccident.txt",
      downloadURL: "http://example.com/happylittleaccident.txt",
      contentType: "txt",
    },
    {
      id: "2",
      fileName: "happybigaccident.png",
      downloadURL: "http://example.com/happylittleaccident.png",
      contentType: "image",
    },
  ],
}

const meMock = {
  me: {
    conversation: {
      messagesConnection: {
        edges: [{ node: messageMock }, { node: messageMock }],
      },
    },
  },
}

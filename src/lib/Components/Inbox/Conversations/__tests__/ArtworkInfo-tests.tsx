import { ArtworkInfoTestsQuery } from "__generated__/ArtworkInfoTestsQuery.graphql"

import { ArtworkInfo_artwork } from "__generated__/ArtworkInfo_artwork.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { ArtworkInfoFragmentContainer } from "../ArtworkInfo"

jest.unmock("react-relay")

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
  presentModalViewController: jest.fn(),
}))

describe("ArtworkInfoFragmentContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<ArtworkInfoTestsQuery>
      environment={env}
      query={graphql`
        query ArtworkInfoTestsQuery($conversationID: String!) @relay_test_operation {
          me {
            conversation(id: $conversationID) {
              items {
                item {
                  __typename
                  ... on Artwork {
                    ...ArtworkInfo_artwork
                  }
                }
              }
            }
          }
        }
      `}
      variables={{ conversationID: "1" }}
      render={({ props, error }) => {
        if (props) {
          const item = props.me?.conversation?.items?.[0]?.item
          return item?.__typename === "Artwork" && <ArtworkInfoFragmentContainer artwork={item} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  beforeEach(() => {
    env = createMockEnvironment()
  })

  it("doesn't throw when rendered", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: meMock,
      })
    })
    expect(extractText(tree.root)).toBe("Bob Rosshappy little accident, 1982Bob Ross Gallery$10,000")
  })
})

const artworkMock: Partial<ArtworkInfo_artwork> = {
  title: "happy little accident",
  artistNames: "Bob Ross",
  partner: {
    name: "Bob Ross Gallery",
  },
  date: "1982",
  saleMessage: "$10,000",
}

const meMock = {
  me: {
    conversation: {
      items: [
        {
          item: { __typename: "Artwork", ...artworkMock },
        },
      ],
    },
  },
}

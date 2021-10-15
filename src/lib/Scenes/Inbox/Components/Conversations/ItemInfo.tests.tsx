import { ItemInfoTestsQuery } from "__generated__/ItemInfoTestsQuery.graphql"

import { ItemInfo_item } from "__generated__/ItemInfo_item.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { ItemInfoFragmentContainer } from "../ItemInfo"

jest.unmock("react-relay")

describe("ItemInfoFragmentContainer", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<ItemInfoTestsQuery>
      environment={env}
      query={graphql`
        query ItemInfoTestsQuery($conversationID: String!) @relay_test_operation {
          me {
            conversation(id: $conversationID) {
              items {
                item {
                  __typename
                  ... on Artwork {
                    ...ItemInfo_item
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
          return item?.__typename === "Artwork" && <ItemInfoFragmentContainer item={item} />
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

const artworkMock: Partial<ItemInfo_item> = {
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

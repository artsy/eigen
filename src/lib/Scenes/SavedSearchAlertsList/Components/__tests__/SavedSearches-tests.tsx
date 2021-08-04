import { SavedSearchesTestsQuery } from "__generated__/SavedSearchesTestsQuery.graphql"
import { extractText } from 'lib/tests/extractText'
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { AlertListItem } from '../AlertListItem'
import { SavedSearchesContainer as SavedSearches } from "../SavedSearches"

jest.unmock("react-relay")

describe("SavedSearches", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<SavedSearchesTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query SavedSearchesTestsQuery @relay_test_operation {
            me {
              ...SavedSearches_me
            }
          }
        `}
        render={({ props }) => {
          if (props?.me) {
            return <SavedSearches me={props.me} />
          }

          return null
        }}
        variables={{}}
      />
    )
  }

  it("renders correctly", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      ArtworkConnection: () => ({
        edges: [
          {
            node: {
              slug: "one",
            }
          },
          {
            node: {
              slug: "two",
            }
          }
        ],
      }),
    })

    const items = tree.root.findAllByType(AlertListItem)

    expect(items.length).toBe(2)
    expect(extractText(items[0])).toBe("one")
    expect(extractText(items[1])).toBe("two")
  })
})

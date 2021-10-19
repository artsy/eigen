import { SavedSearchesListTestsQuery } from "__generated__/SavedSearchesListTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { EmptyMessage } from "./EmptyMessage"
import { SavedSearchesListContainer as SavedSearchesList } from "./SavedSearchesList"
import { SavedSearchListItem } from "./SavedSearchListItem"

jest.unmock("react-relay")

describe("SavedSearches", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <QueryRenderer<SavedSearchesListTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query SavedSearchesListTestsQuery @relay_test_operation {
            me {
              ...SavedSearchesList_me
            }
          }
        `}
        render={({ props }) => {
          if (props?.me) {
            return <SavedSearchesList me={props.me} />
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
      SearchCriteriaConnection: () => ({
        edges: [
          {
            node: {
              userAlertSettings: {
                name: "one",
              },
            },
          },
          {
            node: {
              userAlertSettings: {
                name: "two",
              },
            },
          },
        ],
      }),
    })

    const items = tree.root.findAllByType(SavedSearchListItem)

    expect(items.length).toBe(2)
    expect(extractText(items[0])).toBe("one")
    expect(extractText(items[1])).toBe("two")
  })

  it("renders an empty message if there are no saved search alerts", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteriaConnection: () => ({
        edges: [],
      }),
    })

    expect(tree.root.findAllByType(EmptyMessage)).toHaveLength(1)
  })

  it("renders an empty message if there is no name for saved search alert", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteriaConnection: () => ({
        edges: [
          {
            node: {
              userAlertSettings: {
                name: "one",
              },
            },
          },
          {
            node: {
              userAlertSettings: {
                name: null,
              },
            },
          },
        ],
      }),
    })

    const items = tree.root.findAllByType(SavedSearchListItem)

    expect(items.length).toBe(2)
    expect(extractText(items[0])).toBe("one")
    expect(extractText(items[1])).toBe("Untitled Alert")
  })
})

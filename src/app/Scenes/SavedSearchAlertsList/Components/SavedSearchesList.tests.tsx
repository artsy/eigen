import { fireEvent, waitFor } from "@testing-library/react-native"
import { SavedSearchesListTestsQuery } from "__generated__/SavedSearchesListTestsQuery.graphql"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SavedSearchesListPaginationContainer as SavedSearchesList } from "./SavedSearchesList"

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
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
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

    expect(getByText("one")).toBeTruthy()
    expect(getByText("two")).toBeTruthy()
  })

  it("renders an empty message if there are no saved search alerts", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      SearchCriteriaConnection: () => ({
        edges: [],
      }),
    })

    expect(getByText("Create an alert to get notified about new works.")).toBeTruthy()
  })

  it("renders the default name placeholder if there is no name for saved search alert", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
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

    expect(getByText("one")).toBeTruthy()
    expect(getByText("Untitled Alert")).toBeTruthy()
  })

  it("should display Sort By button", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment)

    expect(getByText("Sort By")).toBeTruthy()
  })

  it("should display sort options when Sort By button is pressed", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment)

    fireEvent.press(getByText("Sort By"))

    expect(getByText("Recently Added")).toBeTruthy()
    expect(getByText("Name (A-Z)")).toBeTruthy()
  })

  it("should pass selected sort option to query variables", async () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment)

    fireEvent.press(getByText("Sort By"))
    fireEvent.press(getByText("Name (A-Z)"))

    await waitFor(() => {
      const operation = mockEnvironment.mock.getMostRecentOperation()
      expect(operation.fragment.variables.sort).toBe("NAME_ASC")
    })
  })
})

import { fireEvent } from "@testing-library/react-native"
import { SavedSearchesListTestsQuery } from "__generated__/SavedSearchesListTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
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

    expect(getByText("one")).toBeTruthy()
    expect(getByText("two")).toBeTruthy()
  })

  it("renders an empty message if there are no saved search alerts", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      SearchCriteriaConnection: () => ({
        edges: [],
      }),
    })

    expect(getByText("Create an alert to get notified about new works.")).toBeTruthy()
  })

  it("renders the default name placeholder if there is no name for saved search alert", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

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

    expect(getByText("one")).toBeTruthy()
    expect(getByText("Untitled Alert")).toBeTruthy()
  })

  describe("Sort By", () => {
    it("should hide Sort By button when feature flag is disabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSortByOnAlertsList: false })
      const { queryByText } = renderWithWrappersTL(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment)

      expect(queryByText("Sort By")).toBeFalsy()
    })

    it("should display Sort By button when feature flag is enabled", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSortByOnAlertsList: true })
      const { getByText } = renderWithWrappersTL(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment)

      expect(getByText("Sort By")).toBeTruthy()
    })

    it("should display sort options", () => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSortByOnAlertsList: true })
      const { getByText } = renderWithWrappersTL(<TestRenderer />)

      mockEnvironmentPayload(mockEnvironment)

      fireEvent.press(getByText("Sort By"))

      expect(getByText("Recently Added")).toBeTruthy()
      expect(getByText("Name (A-Z)")).toBeTruthy()
    })
  })
})

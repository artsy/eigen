import { fireEvent, waitFor } from "@testing-library/react-native"
import { SavedSearchesListTestsQuery } from "__generated__/SavedSearchesListTestsQuery.graphql"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { SavedSearchesListPaginationContainer as SavedSearchesList } from "./SavedSearchesList"

describe("SavedSearches", () => {
  const { renderWithRelay } = setupTestWrapper<SavedSearchesListTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return <SavedSearchesList me={props.me} />
      }
      return null
    },
    query: graphql`
      query SavedSearchesListTestsQuery @relay_test_operation {
        me {
          ...SavedSearchesList_me
        }
      }
    `,
  })

  it("renders correctly", () => {
    const { getByText } = renderWithRelay({
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
    const { getByText } = renderWithRelay({
      SearchCriteriaConnection: () => ({
        edges: [],
      }),
    })

    expect(getByText("Create an alert to get notified about new works.")).toBeTruthy()
  })

  it("renders the default name placeholder if there is no name for saved search alert", () => {
    const { getByText } = renderWithRelay({
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
    const { getByText } = renderWithRelay()

    expect(getByText("Sort By")).toBeTruthy()
  })

  it("should display sort options when Sort By button is pressed", () => {
    const { getByText } = renderWithRelay()

    fireEvent.press(getByText("Sort By"))

    expect(getByText("Recently Added")).toBeTruthy()
    expect(getByText("Name (A-Z)")).toBeTruthy()
  })

  it("should pass selected sort option to query variables", async () => {
    const { getByText, env } = renderWithRelay()

    fireEvent.press(getByText("Sort By"))
    fireEvent.press(getByText("Name (A-Z)"))

    await waitFor(() => {
      const operation = env.mock.getMostRecentOperation()
      expect(operation.fragment.variables.sort).toBe("NAME_ASC")
    })
  })
})

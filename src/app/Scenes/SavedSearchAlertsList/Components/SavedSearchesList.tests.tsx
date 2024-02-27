import { fireEvent, screen, waitFor } from "@testing-library/react-native"
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
    renderWithRelay({
      Me: () => ({
        alertsConnection: {
          edges: [
            {
              node: {
                displayName: "one",
              },
            },
            {
              node: {
                displayName: "two",
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("one")).toBeTruthy()
    expect(screen.getByText("two")).toBeTruthy()
  })

  it("renders an empty message if there are no saved search alerts", () => {
    renderWithRelay({
      Me: () => ({
        alertsConnection: {
          edges: [],
        },
      }),
    })

    expect(screen.getByText("Get notifications when there’s a match.")).toBeTruthy()
  })

  it("renders the default name placeholder if there is no name for saved search alert", () => {
    renderWithRelay({
      Me: () => ({
        alertsConnection: {
          edges: [
            {
              node: {
                displayName: "one",
              },
            },
            {
              node: {
                displayName: null,
              },
            },
          ],
        },
      }),
    })

    expect(screen.getByText("one")).toBeTruthy()
    expect(screen.getByText("Untitled Alert")).toBeTruthy()
  })

  it("should display Sort By button", () => {
    renderWithRelay()

    expect(screen.getByText("Sort By")).toBeTruthy()
  })

  it("should display sort options when Sort By button is pressed", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText("Sort By"))

    expect(screen.getByText("Recently Added")).toBeTruthy()
    expect(screen.getByText("Name (A-Z)")).toBeTruthy()
  })

  it("should pass selected sort option to query variables", async () => {
    const { env } = renderWithRelay()

    fireEvent.press(screen.getByText("Sort By"))
    fireEvent.press(screen.getByText("Name (A-Z)"))

    await waitFor(() => {
      const operation = env.mock.getMostRecentOperation()
      expect(operation.fragment.variables.sort).toBe("NAME_ASC")
    })
  })
})

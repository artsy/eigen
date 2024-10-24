import { Spinner } from "@artsy/palette-mobile"
import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { EntitySearchResultsQuery } from "__generated__/EntitySearchResultsQuery.graphql"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { EntitySearchResultsScreen } from "app/Scenes/Search/components/EntitySearchResults"
import { ARTIST_PILL } from "app/Scenes/Search/constants"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("EntitySearchResults", () => {
  const initialProps = {
    query: "Banksy",
    selectedPill: ARTIST_PILL,
  }

  const { renderWithRelay } = setupTestWrapper<EntitySearchResultsQuery>({
    Component: () => (
      <SearchContext.Provider
        value={{ inputRef: { current: { blur: jest.fn() } as any }, queryRef: { current: "" } }}
      >
        <EntitySearchResultsScreen {...initialProps} />,
      </SearchContext.Provider>
    ),
  })

  it("renders results component without throwing an error", async () => {
    renderWithRelay({
      Query: () => ({
        searchConnection: {
          totalCount: 10,
          ...mockEdges,
        },
      }),
    })

    expect(screen.getByTestId("SingleIndexSearchPlaceholder")).toBeTruthy()

    await waitForElementToBeRemoved(() => screen.queryByTestId("SingleIndexSearchPlaceholder"), {
      timeout: 10000,
    })

    expect(screen.getByLabelText("Artist search results list")).toBeTruthy()

    mockEdges.edges.forEach((edge) => {
      expect(screen.getByLabelText(`Search Result for ${edge.node.displayLabel}`)).toBeTruthy()
      expect(
        screen.getByLabelText(`Search Result for ${edge.node.displayLabel}`)
      ).toHaveTextContent(edge.node.displayLabel)
    })

    expect(screen.queryByTestId("SingleIndexEmptyResultsMessage")).toBeFalsy()
    expect(screen.UNSAFE_queryByType(Spinner)).toBeFalsy()
  })

  it("renders the empty message when no results", async () => {
    renderWithRelay({
      Query: () => ({
        searchConnection: {
          totalCount: 0,
          edges: [],
        },
      }),
    })

    expect(screen.getByTestId("SingleIndexSearchPlaceholder")).toBeTruthy()

    await waitForElementToBeRemoved(() => screen.queryByTestId("SingleIndexSearchPlaceholder"), {
      timeout: 10000,
    })

    expect(screen.getByLabelText("Artist search results list")).toBeTruthy()

    expect(screen.queryByText("Sorry, we couldn’t find an Artist for “Banksy.”"))
    expect(screen.queryByText("Please try searching again with a different spelling."))
  })
})

const mockEdges = {
  edges: [
    {
      node: {
        displayLabel: "Banksy",
      },
    },
    {
      node: {
        displayLabel: "Hanksy",
      },
    },
    {
      node: {
        displayLabel: "Not Banksy",
      },
    },
    {
      node: {
        displayLabel: "Banksy X Banksy of England",
      },
    },
    {
      node: {
        displayLabel: "Banksy X Bristol Riots",
      },
    },
    {
      node: {
        displayLabel: "Banksy Hates Me",
      },
    },
    {
      node: {
        displayLabel: "Banksy X Third Planet",
      },
    },
    {
      node: {
        displayLabel: "Banksy X Third Planet International",
      },
    },
    {
      node: {
        displayLabel: "Banksy X DMS new",
      },
    },
    {
      node: {
        displayLabel: "Banksy X Andy Warhol",
      },
    },
  ],
}

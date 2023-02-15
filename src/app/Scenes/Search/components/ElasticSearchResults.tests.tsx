import { Spinner } from "@artsy/palette-mobile"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { ElasticSearchResultsQuery } from "__generated__/ElasticSearchResultsQuery.graphql"
import { SearchContext } from "app/Scenes/Search/SearchContext"
import { ElasticSearchResults2Screen } from "app/Scenes/Search/components/ElasticSearchResults"
import { ARTIST_PILL } from "app/Scenes/Search/constants"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const eventData = {
  nativeEvent: {
    contentOffset: {
      y: 500,
    },
    contentSize: {
      // Dimensions of the scrollable content
      height: 500,
      width: 100,
    },
    layoutMeasurement: {
      // Dimensions of the device
      height: 100,
      width: 100,
    },
  },
}

describe("ElasticSearchResults", () => {
  const initialProps = {
    query: "Banksy",
    selectedPill: ARTIST_PILL,
  }

  const { renderWithRelay } = setupTestWrapper<ElasticSearchResultsQuery>({
    Component: () => (
      <SearchContext.Provider
        value={{ inputRef: { current: { blur: jest.fn() } as any }, queryRef: { current: "" } }}
      >
        <ElasticSearchResults2Screen {...initialProps} />,
      </SearchContext.Provider>
    ),
  })

  it("renders without throwing an error", async () => {
    renderWithRelay({
      Query: () => ({
        searchConnection: {
          totalCount: 10,
          ...mockEdges,
        },
      }),
    })

    expect(screen.getByTestId("SingleIndexSearchPlaceholder")).toBeTruthy()

    await waitForElementToBeRemoved(() => screen.getByTestId("SingleIndexSearchPlaceholder"))

    expect(screen.queryByLabelText("Artist search results list")).toBeTruthy()

    mockEdges.edges.forEach((edge) => {
      expect(screen.queryByLabelText(`Search Result for ${edge.node.displayLabel}`)).toBeTruthy()
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

    await waitForElementToBeRemoved(() => screen.getByTestId("SingleIndexSearchPlaceholder"))

    expect(screen.queryByLabelText("Artist search results list")).toBeTruthy()

    expect(screen.queryByText("Sorry, we couldn’t find an Artist for “Banksy.”"))
    expect(screen.queryByText("Please try searching again with a different spelling."))
  })

  it("renders the spinner when fetching more results, and hides it when done", async () => {
    const { env } = renderWithRelay({
      Query: () => ({
        searchConnection: {
          totalCount: 16,
          ...mockEdges,
          pageInfo: {
            hasNextPage: true,
          },
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByTestId("SingleIndexSearchPlaceholder"))

    expect(screen.queryByLabelText("Artist search results list")).toBeTruthy()

    expect(screen.UNSAFE_queryByType(Spinner)).toBeFalsy()

    fireEvent.scroll(screen.getByLabelText("Artist search results list"), eventData)

    expect(screen.UNSAFE_queryByType(Spinner)).toBeTruthy()

    resolveMostRecentRelayOperation(env, {
      Query: () => ({
        searchConnection: {
          totalCount: 16,
          ...extraMockEdges,
          pageInfo: {
            hasNextPage: false,
          },
        },
      }),
    })

    expect(screen.UNSAFE_queryByType(Spinner)).toBeFalsy()
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

const extraMockEdges = {
  edges: [
    {
      node: {
        displayLabel: "Extra Banksy",
      },
    },
    {
      node: {
        displayLabel: "Extra Hanksy",
      },
    },
    {
      node: {
        displayLabel: "Extra Not Banksy",
      },
    },
    {
      node: {
        displayLabel: "Extra Banksy X Banksy of England",
      },
    },
    {
      node: {
        displayLabel: "Extra Banksy X Bristol Riots",
      },
    },
  ],
}

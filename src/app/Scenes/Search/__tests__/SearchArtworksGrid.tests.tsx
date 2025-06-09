import { fireEvent, screen } from "@testing-library/react-native"
import { SearchArtworksGridTestsQuery } from "__generated__/SearchArtworksGridTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { SearchArtworksGridPaginationContainer } from "app/Scenes/Search/SearchArtworksGrid"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Modal } from "react-native"
import { graphql } from "react-relay"

describe("SearchArtworksGrid", () => {
  const { renderWithRelay } = setupTestWrapper<SearchArtworksGridTestsQuery>({
    Component: ({ viewer }) => (
      <ArtworkFiltersStoreProvider>
        <SearchArtworksGridPaginationContainer viewer={viewer!} keyword="Art" />
      </ArtworkFiltersStoreProvider>
    ),
    query: graphql`
      query SearchArtworksGridTestsQuery($input: FilterArtworksInput, $count: Int, $keyword: String)
      @relay_test_operation {
        viewer {
          ...SearchArtworksGrid_viewer @arguments(input: $input, keyword: $keyword, count: $count)
        }
      }
    `,
    variables: {
      count: 20,
      keyword: "Art",
    },
  })

  it("tracks filter modal opening", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText("Sort & Filter"))
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action_name": "filter",
          "action_type": "tap",
          "context_screen": "Search",
          "context_screen_owner_id": null,
          "context_screen_owner_slug": null,
          "context_screen_owner_type": "Search",
        },
      ]
    `)
  })

  it("tracks filter modal closing", () => {
    renderWithRelay()

    screen.UNSAFE_getAllByType(Modal)[0].props.onDismiss()

    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "action_name": "closeFilterWindow",
          "action_type": "tap",
          "context_screen": "Search",
          "context_screen_owner_id": null,
          "context_screen_owner_slug": null,
          "context_screen_owner_type": "Search",
        },
      ]
    `)
  })

  it('should display "Sort & Filter" label by default', () => {
    renderWithRelay()

    expect(screen.queryByText("Sort & Filter")).toBeTruthy()
  })
})

import { fireEvent } from "@testing-library/react-native"
import { SearchArtworksGridTestsQuery } from "__generated__/SearchArtworksGridTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { SearchArtworksGridPaginationContainer } from "./SearchArtworksGrid"

jest.unmock("react-relay")

describe("SearchArtworksGrid", () => {
  let environment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    environment = createMockEnvironment()
  })

  const TestRenderer = () => {
    return (
      <ArtworkFiltersStoreProvider>
        <QueryRenderer<SearchArtworksGridTestsQuery>
          environment={environment}
          query={graphql`
            query SearchArtworksGridTestsQuery(
              $input: FilterArtworksInput
              $count: Int
              $keyword: String
            ) @relay_test_operation {
              viewer {
                ...SearchArtworksGrid_viewer
                  @arguments(input: $input, keyword: $keyword, count: $count)
              }
            }
          `}
          render={({ props }) => {
            if (props?.viewer) {
              return <SearchArtworksGridPaginationContainer viewer={props.viewer} keyword="Art" />
            }
            return null
          }}
          variables={{
            count: 20,
            keyword: "Art",
          }}
        />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("tracks filter modal opening", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)
    fireEvent.press(getByText("Sort & Filter"))
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
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
    const { container } = renderWithWrappersTL(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)
    container.findByType(FancyModal).props.onBackgroundPressed()
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
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
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    resolveMostRecentRelayOperation(environment)

    expect(getByText("Sort & Filter")).toBeTruthy()
  })
})

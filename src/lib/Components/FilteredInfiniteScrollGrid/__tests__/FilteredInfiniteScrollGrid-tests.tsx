import React from "react"
import { graphql } from "react-relay"

import { ShowFixture } from "../../../__fixtures__/ShowFixture"
import { MockRelayRenderer } from "../../../tests/MockRelayRenderer"
import { renderUntil } from "../../../tests/renderUntil"

import InfiniteScrollGrid from "lib/Components/ArtworkGrids/InfiniteScrollGrid"
import { FilteredInfiniteScrollGridContainer as FilteredInfiniteScrollGrid } from "../FilteredInfiniteScrollGrid"

jest.unmock("react-relay")

const onRefetch = jest.fn()

// FIXME: Fix fixture data
describe("FilteredInfiniteScrollGrid", () => {
  xit("Passes filteredArtworks correctly", async () => {
    const tree = await renderUntil(
      wrapper => {
        return wrapper.find(InfiniteScrollGrid).length > 0
      },
      <MockRelayRenderer
        Component={({ show }) => {
          return <FilteredInfiniteScrollGrid filteredArtworks={show.filteredArtworks} onRefetch={onRefetch} />
        }}
        query={graphql`
          query FilteredInfiniteScrollGridTestsQuery {
            show(id: "anderson-fine-art-gallery-flickinger-collection") {
              filteredArtworks(size: 0, medium: "*", priceRange: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
                ...FilteredInfiniteScrollGrid_filteredArtworks
              }
            }
          }
        `}
        mockData={{
          show: ShowFixture,
        }}
      />
    )
    expect(tree.find(InfiniteScrollGrid).props().filteredArtworks.artworks.edges.length).toBe(
      ShowFixture.filteredArtworks.artworks_connection.edges.length
    )
  })
})

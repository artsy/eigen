import { FiltersTestsQueryRawResponse } from "__generated__/FiltersTestsQuery.graphql"
import React from "react"
import { graphql } from "react-relay"

import { ShowFixture } from "../../../__fixtures__/ShowFixture"

import { Picker } from "lib/Components/Picker"
import { PortalProvider } from "lib/Components/Portal"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import { FiltersContainer as Filters } from "../Filters"

jest.unmock("react-relay")

const renderTree = () =>
  renderRelayTree({
    Component: ({ show }) => (
      <PortalProvider>
        <Filters
          filteredArtworks={show.filteredArtworks}
          onFilterChange={() => jest.fn()}
          mediumValue={""}
          priceRangeValue={""}
        />
      </PortalProvider>
    ),
    query: graphql`
      query FiltersTestsQuery @raw_response_type {
        show(id: "anderson-fine-art-gallery-flickinger-collection") {
          id # dummy
          # filteredArtworks(size: 0, medium: "*", priceRange: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
          #   ...Filters_filteredArtworks
          # }
        }
      }
    `,
    mockData: {
      show: ShowFixture,
    } as FiltersTestsQueryRawResponse,
  })

describe("Filters", () => {
  // FIXME: Fix test
  xit("Passes Picker Options from available aggregrations", async () => {
    const tree = await renderTree()
    const pickerOptions = tree
      .find(Picker)
      .first()
      .props()
      .options.map(({ text }) => text)

    // First Picker is the "Medium" picker
    const optionsFromFixture = ShowFixture.filterArtworksConnection.aggregations[1].counts[0].name

    expect(pickerOptions).toContain(optionsFromFixture)
  })
})

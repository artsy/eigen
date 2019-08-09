import { Flex, Spacer } from "@artsy/palette"
import { Filters_filteredArtworks } from "__generated__/Filters_filteredArtworks.graphql"
import { Picker, PickerOption, PickerType } from "lib/Components/Picker"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface FilterValue {
  value: string
}

interface Props {
  filteredArtworks: Filters_filteredArtworks
  onFilterChange: (filterName: string) => (value: FilterValue) => void
  mediumValue: string
  priceRangeValue: string
}

const getAggregationSlice = (sliceName, filteredArtworks) =>
  filteredArtworks.aggregations.find(({ slice }) => slice === sliceName).counts

const getAggregationOptions = aggregation => aggregation.map(({ id, name }) => ({ text: name, value: id }))

export const Filters: React.SFC<Props> = ({ onFilterChange, mediumValue, priceRangeValue, filteredArtworks }) => {
  const mediumOptions = filteredArtworks ? getAggregationOptions(getAggregationSlice("MEDIUM", filteredArtworks)) : []
  const priceRangeOptions = filteredArtworks
    ? getAggregationOptions(getAggregationSlice("PRICE_RANGE", filteredArtworks))
    : []
  return (
    <Flex flexDirection="row" pt={2} pb={3}>
      <Picker
        options={mediumOptions as PickerOption[]}
        selected={mediumValue}
        prompt="Medium"
        type={PickerType.Small}
        onSelect={onFilterChange("medium")}
      />
      <Spacer m={2} />
      <Picker
        options={priceRangeOptions as PickerOption[]}
        selected={priceRangeValue}
        prompt="Price Range"
        type={PickerType.Small}
        onSelect={onFilterChange("priceRange")}
      />
    </Flex>
  )
}

export const FiltersContainer = createFragmentContainer(Filters, {
  filteredArtworks: graphql`
    fragment Filters_filteredArtworks on FilterArtworksConnection {
      aggregations {
        slice
        counts {
          internalID
          name
        }
      }
    }
  `,
})

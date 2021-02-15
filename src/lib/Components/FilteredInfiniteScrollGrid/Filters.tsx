import { ArtworkAggregation, Filters_filteredArtworks } from "__generated__/Filters_filteredArtworks.graphql"
import { Picker, PickerOption, PickerType } from "lib/Components/Picker"
import { Flex, Spacer } from "palette"
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

const getAggregationSlice = (sliceName: ArtworkAggregation, filteredArtworks: Filters_filteredArtworks) =>
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  filteredArtworks.aggregations.find(({ slice }) => slice === sliceName).counts

const getAggregationOptions = (aggregation: ReturnType<typeof getAggregationSlice>) =>
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  aggregation.map(({ name, value }) => ({ text: name, value }))

export const Filters: React.FC<Props> = ({ onFilterChange, mediumValue, priceRangeValue, filteredArtworks }) => {
  const mediumOptions = filteredArtworks ? getAggregationOptions(getAggregationSlice("MEDIUM", filteredArtworks)) : []
  const priceRangeOptions = filteredArtworks
    ? getAggregationOptions(getAggregationSlice("PRICE_RANGE", filteredArtworks))
    : []
  return (
    <Flex flexDirection="row" pt="2" pb="3">
      <Picker
        options={mediumOptions as PickerOption[]}
        selected={mediumValue}
        prompt="Medium"
        type={PickerType.Small}
        onSelect={onFilterChange("medium")}
      />
      <Spacer m="2" />
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
          name
          value
        }
      }
    }
  `,
})

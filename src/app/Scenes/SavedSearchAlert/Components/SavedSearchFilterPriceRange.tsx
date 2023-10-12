import { Flex, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { SavedSearchFilterPriceRangeQuery } from "__generated__/SavedSearchFilterPriceRangeQuery.graphql"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { PriceRangeContainer } from "app/Components/PriceRange/PriceRangeContainer"
import { DEFAULT_PRICE_RANGE } from "app/Components/PriceRange/constants"
import { PriceRange } from "app/Components/PriceRange/types"
import { getBarsFromAggregations } from "app/Components/PriceRange/utils"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { GlobalStore } from "app/store/GlobalStore"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useEffect, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import useDebounce from "react-use/lib/useDebounce"

interface SavedSearchFilterPriceRangeProps {
  artist: SavedSearchFilterPriceRangeQuery["response"]["artist"]
}

const SavedSearchFilterPriceRange: React.FC<SavedSearchFilterPriceRangeProps> = ({ artist }) => {
  const histogramBars = getBarsFromAggregations(
    (artist as any)?.filterArtworksConnection?.aggregations
  )

  const storePriceRangeValue = useSearchCriteriaAttributes(SearchCriteria.priceRange) as string

  const [filterPriceRange, setFilterPriceRange] = useState(
    storePriceRangeValue || DEFAULT_PRICE_RANGE
  )

  const setValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.setValueToAttributesByKeyAction
  )

  useDebounce(
    () => {
      setValueToAttributesByKeyAction({
        key: SearchCriteria.priceRange,
        value: filterPriceRange,
      })
      GlobalStore.actions.recentPriceRanges.addNewPriceRange(filterPriceRange)
    },
    200,
    [filterPriceRange]
  )

  // Make sure to keep the slider and the histograms up to date with the store
  useEffect(() => {
    if (filterPriceRange !== storePriceRangeValue) {
      setFilterPriceRange(storePriceRangeValue || DEFAULT_PRICE_RANGE)
    }
  }, [storePriceRangeValue])

  const handleUpdateRange = (updatedRange: PriceRange) => {
    setFilterPriceRange(updatedRange.join("-"))
  }

  return (
    <Flex>
      <Text variant="sm" fontWeight={500} px={2}>
        Price Range
      </Text>
      <Spacer y={1} />
      <PriceRangeContainer
        filterPriceRange={filterPriceRange}
        histogramBars={histogramBars}
        onPriceRangeUpdate={handleUpdateRange}
      />
    </Flex>
  )
}

const Placeholder: React.FC<{}> = () => (
  <Flex flex={1} justifyContent="center" alignItems="center">
    <Spinner testID="alert-price-range-spinner" />
  </Flex>
)

const savedSearchFilterPriceRangeQuery = graphql`
  query SavedSearchFilterPriceRangeQuery($artistID: String!) {
    artist(id: $artistID) {
      filterArtworksConnection(aggregations: [SIMPLE_PRICE_HISTOGRAM], first: 0) {
        aggregations {
          slice
          counts {
            count
            name
            value
          }
        }
      }
    }
  }
`

export const SavedSearchFilterPriceRangeQR: React.FC<{}> = withSuspense(() => {
  const artistID = SavedSearchStore.useStoreState((state) => state.entity.artists[0].id)
  const data = useLazyLoadQuery<SavedSearchFilterPriceRangeQuery>(
    savedSearchFilterPriceRangeQuery,
    {
      artistID: artistID,
    }
  )

  if (!data.artist) {
    return null
  }

  return <SavedSearchFilterPriceRange artist={data.artist} />
}, Placeholder)

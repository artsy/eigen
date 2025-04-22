import {
  Flex,
  Separator,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { SavedSearchFilterPriceRangeQuery } from "__generated__/SavedSearchFilterPriceRangeQuery.graphql"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { PriceRangeContainer } from "app/Components/PriceRange/PriceRangeContainer"
import { DEFAULT_PRICE_RANGE } from "app/Components/PriceRange/constants"
import { PriceRange } from "app/Components/PriceRange/types"
import { getBarsFromAggregations } from "app/Components/PriceRange/utils"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { useSearchCriteriaAttributes } from "app/Scenes/SavedSearchAlert/helpers"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
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

  const addValueToAttributesByKeyAction = SavedSearchStore.useStoreActions(
    (actions) => actions.addValueToAttributesByKeyAction
  )

  useDebounce(
    () => {
      addValueToAttributesByKeyAction({
        key: SearchCriteria.priceRange,
        value: filterPriceRange,
      })
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
      <Separator my={2} borderColor="mono10" />
      <Text variant="sm" fontWeight="bold" px={2}>
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
  <Flex testID="loading-skeleton">
    <Skeleton>
      <SkeletonText variant="sm" fontWeight="bold" mx={2}>
        Price Range
      </SkeletonText>

      <Spacer y={2} />

      <Flex mx={2} flexDirection="row">
        <SkeletonBox width="100%" height={50} />
      </Flex>

      <Spacer y={2} />

      <Flex mx={2} flexDirection="row">
        <SkeletonBox width="100%" height={170} />
      </Flex>

      <Spacer y={4} />

      <Flex mx={2} flexDirection="row">
        <SkeletonBox width="100%" height={90} />
      </Flex>
    </Skeleton>
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

export const SavedSearchFilterPriceRangeQR: React.FC<{}> = withSuspense({
  Component: () => {
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
  },
  LoadingFallback: Placeholder,
  ErrorFallback: NoFallback,
})

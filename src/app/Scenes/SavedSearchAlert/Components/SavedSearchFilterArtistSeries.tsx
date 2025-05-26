import {
  Flex,
  Separator,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { SavedSearchFilterArtistSeriesQuery } from "__generated__/SavedSearchFilterArtistSeriesQuery.graphql"
import { SearchCriteria } from "app/Components/ArtworkFilter/SavedSearch/types"
import { SavedSearchFilterPill } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterPill"
import { SavedSearchStore } from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import {
  isValueSelected,
  useSavedSearchFilter,
  useSearchCriteriaAttributes,
} from "app/Scenes/SavedSearchAlert/helpers"
import { NoFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { compact } from "lodash"
import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

const MAX_OPTIONS = 7
interface SavedSearchFilterArtistSeriesProps {
  artist: SavedSearchFilterArtistSeriesQuery["response"]["artist"]
}

const SavedSearchFilterArtistSeries: React.FC<SavedSearchFilterArtistSeriesProps> = (props) => {
  const { artist } = props
  const artistSeries = (artist?.filterArtworksConnection?.aggregations || []).find(
    (aggs) => aggs?.slice === "ARTIST_SERIES"
  )

  const { handlePress } = useSavedSearchFilter({ criterion: SearchCriteria.artistSeriesIDs })

  const selectedAttributes = useSearchCriteriaAttributes(SearchCriteria.artistSeriesIDs) as string[]

  // If the user has selected any values, show all the options on initial render
  const [showAll, setShowAll] = useState(!!selectedAttributes?.length)

  const options = compact(artistSeries?.counts ?? [])

  if (!options.length) return null

  const displayedOptions = showAll ? options : options.slice(0, MAX_OPTIONS)

  return (
    <Flex px={2}>
      <Separator my={2} borderColor="mono10" />
      <Text variant="sm" fontWeight="bold">
        Artist Series
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row" flexWrap="wrap">
        {displayedOptions.map((option) => {
          return (
            <SavedSearchFilterPill
              key={option.value as string}
              accessibilityLabel={option.name}
              selected={isValueSelected({
                selectedAttributes,
                value: option.value,
              })}
              onPress={() => {
                handlePress(option.value as string)
              }}
            >
              {option.name}
            </SavedSearchFilterPill>
          )
        })}

        {options.length > MAX_OPTIONS && (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              setShowAll(!showAll)
            }}
          >
            <Flex height={50} justifyContent="center" px={1}>
              <Text variant="xs" color="blue100">
                Show {showAll ? "less" : "more"}
              </Text>
            </Flex>
          </TouchableOpacity>
        )}
      </Flex>
    </Flex>
  )
}

const Placeholder: React.FC<{}> = () => (
  <Flex testID="loading-skeleton">
    <Skeleton>
      <SkeletonText variant="sm" fontWeight="bold" mx={2}>
        Artist Series
      </SkeletonText>

      <Spacer y={2} />

      <Flex mx={2} flexDirection="row">
        <SkeletonBox width="100%" height={130} />
      </Flex>
    </Skeleton>
  </Flex>
)

const savedSearchFilterPriceRangeQuery = graphql`
  query SavedSearchFilterArtistSeriesQuery($artistID: String!) {
    artist(id: $artistID) {
      filterArtworksConnection(aggregations: [ARTIST_SERIES], first: 0) {
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

export const SavedSearchFilterArtistSeriesQR: React.FC<{}> = withSuspense({
  Component: () => {
    const artistID = SavedSearchStore.useStoreState((state) => state.entity.artists[0].id)
    const data = useLazyLoadQuery<SavedSearchFilterArtistSeriesQuery>(
      savedSearchFilterPriceRangeQuery,
      {
        artistID: artistID,
      }
    )

    if (!data.artist) {
      return null
    }

    return <SavedSearchFilterArtistSeries artist={data.artist} />
  },
  LoadingFallback: Placeholder,
  ErrorFallback: NoFallback,
})

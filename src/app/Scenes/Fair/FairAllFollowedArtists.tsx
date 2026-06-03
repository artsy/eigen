import { Box, Flex, Separator, Spacer } from "@artsy/palette-mobile"
import { FairAllFollowedArtistsQuery } from "__generated__/FairAllFollowedArtistsQuery.graphql"
import { FairAllFollowedArtists_fair$key } from "__generated__/FairAllFollowedArtists_fair.graphql"
import { FairAllFollowedArtists_fairForFilters$key } from "__generated__/FairAllFollowedArtists_fairForFilters.graphql"
import {
  Aggregations,
  FilterArray,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { SimpleErrorMessage } from "app/Components/ErrorView/SimpleErrorMessage"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { PlaceholderText } from "app/utils/placeholders"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, useLazyLoadQuery, useFragment } from "react-relay"
import { FairArtworksWithoutTabs } from "./Components/FairArtworks"

interface FairAllFollowedArtistsProps {
  fair: FairAllFollowedArtists_fair$key
  fairForFilters: FairAllFollowedArtists_fairForFilters$key
}

export const FairAllFollowedArtists: React.FC<FairAllFollowedArtistsProps> = ({
  fair: fairProp,
  fairForFilters: fairForFiltersProp,
}) => {
  const fair = useFragment(fairFragment, fairProp)
  const fairForFilters = useFragment(fairForFiltersFragment, fairForFiltersProp)

  const initialFilter: FilterArray = [
    {
      displayText: "All Artists I Follow",
      paramName: FilterParamName.artistsIFollow,
      paramValue: true,
    },
  ]

  return (
    <ScrollView>
      <Box px="15px">
        <FairArtworksWithoutTabs
          fair={fair}
          initiallyAppliedFilter={initialFilter}
          aggregations={fairForFilters.filterArtworksConnection?.aggregations as Aggregations}
          followedArtistCount={fairForFilters.filterArtworksConnection?.counts?.followedArtists}
        />
      </Box>
    </ScrollView>
  )
}

export const FairAllFollowedArtistsScreenQuery = graphql`
  query FairAllFollowedArtistsQuery($fairID: String!) {
    fair(id: $fairID) @principalField {
      ...FairAllFollowedArtists_fair
    }

    fairForFilters: fair(id: $fairID) {
      ...FairAllFollowedArtists_fairForFilters
    }
  }
`

const FairAllFollowedArtistsContent = withSuspense({
  Component: ({ fairID }: { fairID: string }) => {
    const data = useLazyLoadQuery<FairAllFollowedArtistsQuery>(FairAllFollowedArtistsScreenQuery, {
      fairID,
    })

    if (!data.fair || !data.fairForFilters) {
      return null
    }

    return <FairAllFollowedArtists fair={data.fair} fairForFilters={data.fairForFilters} />
  },
  LoadingFallback: () => <FairAllFollowedArtistsPlaceholder />,
  ErrorFallback: () => <SimpleErrorMessage />,
})

export const FairAllFollowedArtistsQueryRenderer: React.FC<{ fairID: string }> = ({ fairID }) => {
  return (
    <ArtworkFiltersStoreProvider>
      <FairAllFollowedArtistsContent fairID={fairID} />
    </ArtworkFiltersStoreProvider>
  )
}

export const FairAllFollowedArtistsPlaceholder: React.FC = () => (
  <Flex>
    <Spacer y={2} />
    <PlaceholderText width={220} />
    <Separator my={2} />
    <PlaceholderGrid />
  </Flex>
)

const fairFragment = graphql`
  fragment FairAllFollowedArtists_fair on Fair {
    internalID
    slug
    ...FairArtworks_fair
      @arguments(input: { includeArtworksByFollowedArtists: true, sort: "-decayed_merch" })
  }
`

const fairForFiltersFragment = graphql`
  fragment FairAllFollowedArtists_fairForFilters on Fair {
    filterArtworksConnection(
      first: 0
      aggregations: [PARTNER, MAJOR_PERIOD, MEDIUM, FOLLOWED_ARTISTS, ARTIST]
    ) {
      aggregations {
        slice
        counts {
          count
          name
          value
        }
      }

      counts {
        followedArtists
      }
    }
  }
`

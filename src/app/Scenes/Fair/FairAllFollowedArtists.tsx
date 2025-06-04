import { Box, Flex, Separator, Spacer } from "@artsy/palette-mobile"
import { FairAllFollowedArtistsQuery } from "__generated__/FairAllFollowedArtistsQuery.graphql"
import { FairAllFollowedArtists_fair$data } from "__generated__/FairAllFollowedArtists_fair.graphql"
import { FairAllFollowedArtists_fairForFilters$data } from "__generated__/FairAllFollowedArtists_fairForFilters.graphql"
import {
  AnimatedArtworkFilterButton,
  ArtworkFilterNavigator,
  FilterModalMode,
} from "app/Components/ArtworkFilter"
import {
  Aggregations,
  FilterArray,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FairArtworksWithoutTabs } from "./Components/FairArtworks"

interface FairAllFollowedArtistsProps {
  fair: FairAllFollowedArtists_fair$data
  fairForFilters: FairAllFollowedArtists_fairForFilters$data
}

export const FairAllFollowedArtists: React.FC<FairAllFollowedArtistsProps> = ({
  fair,
  fairForFilters,
}) => {
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const handleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const initialFilter: FilterArray = [
    {
      displayText: "All Artists I Follow",
      paramName: FilterParamName.artistsIFollow,
      paramValue: true,
    },
  ]

  return (
    <ArtworkFiltersStoreProvider>
      <ScrollView>
        <Box px="15px">
          <FairArtworksWithoutTabs
            fair={fair}
            initiallyAppliedFilter={initialFilter}
            aggregations={fairForFilters.filterArtworksConnection?.aggregations as Aggregations}
            followedArtistCount={fairForFilters.filterArtworksConnection?.counts?.followedArtists}
          />
          <ArtworkFilterNavigator
            visible={isFilterArtworksModalVisible}
            id={fair.internalID}
            slug={fair.slug}
            mode={FilterModalMode.Fair}
            exitModal={handleFilterArtworksModal}
            closeModal={handleFilterArtworksModal}
          />
        </Box>
      </ScrollView>
      <AnimatedArtworkFilterButton isVisible onPress={handleFilterArtworksModal} />
    </ArtworkFiltersStoreProvider>
  )
}

export const FairAllFollowedArtistsFragmentContainer = createFragmentContainer(
  FairAllFollowedArtists,
  {
    fair: graphql`
      fragment FairAllFollowedArtists_fair on Fair {
        internalID
        slug
        ...FairArtworks_fair
          @arguments(input: { includeArtworksByFollowedArtists: true, sort: "-decayed_merch" })
      }
    `,
    /**
     * Filter aggregations are normally dynamic according to applied filters.
     * Because of the `includeArtworksByFollowedArtists` argument used above, the artwork grid is intially scoped to only
     * include works by followed artists.
     * The filter options become incomplete if that option is later disabled in the filter menu.
     * To compensate, we are querying for the complete set below without the `includeArtworksByFollowedArtists`
     * argument so that the complete set of filters is available.
     */
    fairForFilters: graphql`
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
    `,
  }
)

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

export const FairAllFollowedArtistsQueryRenderer: React.FC<{ fairID: string }> = ({ fairID }) => {
  return (
    <QueryRenderer<FairAllFollowedArtistsQuery>
      environment={getRelayEnvironment()}
      query={FairAllFollowedArtistsScreenQuery}
      variables={{ fairID }}
      render={renderWithPlaceholder({
        Container: FairAllFollowedArtistsFragmentContainer,
        renderPlaceholder: () => <FairAllFollowedArtistsPlaceholder />,
      })}
    />
  )
}

export const FairAllFollowedArtistsPlaceholder: React.FC = () => (
  <Flex>
    <Spacer y={2} />
    <PlaceholderText width={220} />
    <Separator my={2} />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)

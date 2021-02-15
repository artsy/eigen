import { FairAllFollowedArtists_fair } from "__generated__/FairAllFollowedArtists_fair.graphql"
import { FairAllFollowedArtists_fairForFilters } from "__generated__/FairAllFollowedArtists_fairForFilters.graphql"
import { FairAllFollowedArtistsQuery } from "__generated__/FairAllFollowedArtistsQuery.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import {
  Aggregations,
  ArtworkFilterContext,
  ArtworkFilterGlobalStateProvider,
  FilterArray,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Flex, Separator, Spacer, Text, Theme } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FairArtworksFragmentContainer } from "./Components/FairArtworks"

interface FairAllFollowedArtistsProps {
  fair: FairAllFollowedArtists_fair
  fairForFilters: FairAllFollowedArtists_fairForFilters
}

export const FairAllFollowedArtists: React.FC<FairAllFollowedArtistsProps> = ({ fair, fairForFilters }) => {
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const handleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const initialFilter: FilterArray = [
    {
      displayText: "All artists I follow",
      paramName: FilterParamName.artistsIFollow,
      paramValue: true,
    },
  ]

  return (
    <ArtworkFilterGlobalStateProvider>
      <ArtworkFilterContext.Consumer>
        {() => {
          return (
            <Theme>
              <>
                <ScrollView>
                  <Text mt="2" mb="1" textAlign="center" variant="mediumText">
                    Artworks
                  </Text>
                  <Separator />
                  <Spacer mb="2" />
                  <Box px={15}>
                    <FairArtworksFragmentContainer
                      fair={fair}
                      initiallyAppliedFilter={initialFilter}
                      aggregations={fairForFilters.filterArtworksConnection?.aggregations as Aggregations}
                      followedArtistCount={fairForFilters.filterArtworksConnection?.counts?.followedArtists}
                    />
                    <FilterModalNavigator
                      isFilterArtworksModalVisible={isFilterArtworksModalVisible}
                      id={fair.internalID}
                      slug={fair.slug}
                      mode={FilterModalMode.Fair}
                      exitModal={handleFilterArtworksModal}
                      closeModal={handleFilterArtworksModal}
                    />
                  </Box>
                </ScrollView>
                <AnimatedArtworkFilterButton isVisible onPress={handleFilterArtworksModal} />
              </>
            </Theme>
          )
        }}
      </ArtworkFilterContext.Consumer>
    </ArtworkFilterGlobalStateProvider>
  )
}

export const FairAllFollowedArtistsFragmentContainer = createFragmentContainer(FairAllFollowedArtists, {
  fair: graphql`
    fragment FairAllFollowedArtists_fair on Fair {
      internalID
      slug
      ...FairArtworks_fair @arguments(includeArtworksByFollowedArtists: true)
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
        aggregations: [
          COLOR
          DIMENSION_RANGE
          GALLERY
          INSTITUTION
          MAJOR_PERIOD
          MEDIUM
          PRICE_RANGE
          FOLLOWED_ARTISTS
          ARTIST
        ]
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
})

export const FairAllFollowedArtistsQueryRenderer: React.FC<{ fairID: string }> = ({ fairID }) => {
  return (
    <QueryRenderer<FairAllFollowedArtistsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FairAllFollowedArtistsQuery($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...FairAllFollowedArtists_fair
          }

          fairForFilters: fair(id: $fairID) {
            ...FairAllFollowedArtists_fairForFilters
          }
        }
      `}
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
    <Spacer mb="2" />
    <PlaceholderText width={220} />
    <Separator my="2" />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)

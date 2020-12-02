import { Fair2AllFollowedArtists_fair } from "__generated__/Fair2AllFollowedArtists_fair.graphql"
import { Fair2AllFollowedArtists_fairForFilters } from "__generated__/Fair2AllFollowedArtists_fairForFilters.graphql"
import { Fair2AllFollowedArtistsQuery } from "__generated__/Fair2AllFollowedArtistsQuery.graphql"
import {
  Aggregations,
  ArtworkFilterContext,
  ArtworkFilterGlobalStateProvider,
  FilterArray,
} from "lib/Components/ArtworkFilter/ArtworkFiltersStore"
import { FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import {
  AnimatedArtworkFilterButton,
  FilterModalMode,
  FilterModalNavigator,
} from "lib/Components/ArtworkFilter/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Flex, Separator, Spacer, Text, Theme } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { Fair2ArtworksFragmentContainer } from "./Components/Fair2Artworks"

interface Fair2AllFollowedArtistsProps {
  fair: Fair2AllFollowedArtists_fair
  fairForFilters: Fair2AllFollowedArtists_fairForFilters
}

export const Fair2AllFollowedArtists: React.FC<Fair2AllFollowedArtistsProps> = ({ fair, fairForFilters }) => {
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
                  <Text mt={2} mb={1} textAlign="center" variant="mediumText">
                    Artworks
                  </Text>
                  <Separator />
                  <Spacer mb={2} />
                  <Box px="15px">
                    <Fair2ArtworksFragmentContainer
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

export const Fair2AllFollowedArtistsFragmentContainer = createFragmentContainer(Fair2AllFollowedArtists, {
  fair: graphql`
    fragment Fair2AllFollowedArtists_fair on Fair {
      internalID
      slug
      ...Fair2Artworks_fair @arguments(includeArtworksByFollowedArtists: true)
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
    fragment Fair2AllFollowedArtists_fairForFilters on Fair {
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

export const Fair2AllFollowedArtistsQueryRenderer: React.FC<{ fairID: string }> = ({ fairID }) => {
  return (
    <QueryRenderer<Fair2AllFollowedArtistsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query Fair2AllFollowedArtistsQuery($fairID: String!) {
          fair(id: $fairID) @principalField {
            ...Fair2AllFollowedArtists_fair
          }

          fairForFilters: fair(id: $fairID) {
            ...Fair2AllFollowedArtists_fairForFilters
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithPlaceholder({
        Container: Fair2AllFollowedArtistsFragmentContainer,
        renderPlaceholder: () => <Fair2AllFollowedArtistsPlaceholder />,
      })}
    />
  )
}

export const Fair2AllFollowedArtistsPlaceholder: React.FC = () => (
  <Flex>
    <Spacer mb={2} />
    <PlaceholderText width={220} />
    <Separator my={2} />
    {/* masonry grid */}
    <PlaceholderGrid />
  </Flex>
)

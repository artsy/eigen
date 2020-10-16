import { Fair2AllFollowedArtists_fair } from "__generated__/Fair2AllFollowedArtists_fair.graphql"
import { Fair2AllFollowedArtistsQuery } from "__generated__/Fair2AllFollowedArtistsQuery.graphql"
import {
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
}

export const Fair2AllFollowedArtists: React.FC<Fair2AllFollowedArtistsProps> = ({ fair }) => {
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
        {(context) => {
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
                    <Fair2ArtworksFragmentContainer fair={fair} initiallyAppliedFilter={initialFilter} />
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
                <AnimatedArtworkFilterButton
                  isVisible
                  count={context.state.appliedFilters.length}
                  onPress={handleFilterArtworksModal}
                />
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

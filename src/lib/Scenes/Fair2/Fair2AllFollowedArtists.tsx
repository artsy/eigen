import { Fair2AllFollowedArtists_fair } from "__generated__/Fair2AllFollowedArtists_fair.graphql"
import { Fair2AllFollowedArtistsQuery } from "__generated__/Fair2AllFollowedArtistsQuery.graphql"
import { AnimatedArtworkFilterButton, FilterModalMode, FilterModalNavigator } from "lib/Components/FilterModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkFilterContext, ArtworkFilterGlobalStateProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Box, Separator, Spacer, Text, Theme } from "palette"
import React, { useState } from "react"
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

  const openFilterArtworksModal = () => {
    handleFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    handleFilterArtworksModal()
  }

  return (
    <ArtworkFilterGlobalStateProvider>
      <ArtworkFilterContext.Consumer>
        {(context) => (
          <Theme>
            <>
              <Text mt={2} mb={1} textAlign="center" variant="mediumText">
                Artworks
              </Text>
              <Separator />
              <Spacer mb={2} />
              <Box px="15px">
                <Fair2ArtworksFragmentContainer fair={fair} />
                <FilterModalNavigator
                  isFilterArtworksModalVisible={isFilterArtworksModalVisible}
                  id={fair.internalID}
                  slug={fair.slug}
                  mode={FilterModalMode.Fair}
                  exitModal={handleFilterArtworksModal}
                  closeModal={closeFilterArtworksModal}
                />
                <AnimatedArtworkFilterButton
                  isVisible
                  count={context.state.appliedFilters.length}
                  onPress={openFilterArtworksModal}
                />
              </Box>
            </>
          </Theme>
        )}
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
      render={renderWithLoadProgress(Fair2AllFollowedArtistsFragmentContainer)}
    />
  )
}

import { Box, Flex, Sans } from "@artsy/palette"
import { ArtworkActions_artwork } from "__generated__/ArtworkActions_artwork.graphql"
import SearchIcon from "lib/Icons/SearchIcon"
import React from "react"
import { NativeModules, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

const Constants = NativeModules.ARCocoaConstantsModule

interface ArtworkActionsProps {
  artwork: ArtworkActions_artwork
}

export const ArtworkActions: React.FC<ArtworkActionsProps> = () => {
  return (
    <View>
      <Flex flexDirection="row">
        <UtilButton pr={3}>
          <Box mr={0.5}>
            <SearchIcon />
          </Box>
          <Sans size="3">Save</Sans>
        </UtilButton>
        {Constants.AREnabled && (
          <UtilButton pr={3}>
            <Box mr={0.5}>
              <SearchIcon />
            </Box>
            <Sans size="3">View in Room</Sans>
          </UtilButton>
        )}
        <UtilButton>
          <Box mr={0.5}>
            <SearchIcon />
          </Box>
          <Sans size="3">Share</Sans>
        </UtilButton>
      </Flex>
    </View>
  )
}

const UtilButton = styled(Flex)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const ArtworkActionsFragmentContainer = createFragmentContainer(ArtworkActions, {
  artwork: graphql`
    fragment ArtworkActions_artwork on Artwork {
      id
      internalID
      is_saved
    }
  `,
})

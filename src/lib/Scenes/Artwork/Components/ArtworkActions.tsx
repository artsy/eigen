import { Box, color, Flex, Sans } from "@artsy/palette"
import { ArtworkActions_artwork } from "__generated__/ArtworkActions_artwork.graphql"
import { ArtworkActionsSaveMutation } from "__generated__/ArtworkActionsSaveMutation.graphql"
import { Pin } from "lib/Icons/Pin"
import SearchIcon from "lib/Icons/SearchIcon"
import React from "react"
import { NativeModules, TouchableWithoutFeedback, View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

const Constants = NativeModules.ARCocoaConstantsModule

interface ArtworkActionsProps {
  artwork: ArtworkActions_artwork
  relay?: RelayProp
}

export class ArtworkActions extends React.Component<ArtworkActionsProps> {
  handleArtworkSave = () => {
    const { artwork, relay } = this.props
    commitMutation<ArtworkActionsSaveMutation>(relay.environment, {
      mutation: graphql`
        mutation ArtworkActionsSaveMutation($input: SaveArtworkInput!) {
          saveArtwork(input: $input) {
            artwork {
              id
              is_saved
            }
          }
        }
      `,
      variables: { input: { artwork_id: artwork.internalID, remove: artwork.is_saved } },
      optimisticResponse: { saveArtwork: { artwork: { id: artwork.id, is_saved: !artwork.is_saved } } },
    })
  }

  render() {
    const {
      artwork: { is_saved },
    } = this.props

    return (
      <View>
        <Flex flexDirection="row">
          <TouchableWithoutFeedback onPress={() => this.handleArtworkSave()}>
            <UtilButton pr={3} width="110px">
              <Box mr={0.5}>
                <Pin pinHeight={20} color={is_saved ? color("purple100") : color("black100")} />
              </Box>
              <Sans size="3" color={is_saved ? color("purple100") : color("black100")}>
                {is_saved ? "Saved" : "Save"}
              </Sans>
            </UtilButton>
          </TouchableWithoutFeedback>
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
}

const UtilButton = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
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

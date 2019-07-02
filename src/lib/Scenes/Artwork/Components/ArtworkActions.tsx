import { Box, color, EyeOpenedIcon, Flex, HeartFillIcon, HeartIcon, Sans, ShareIcon } from "@artsy/palette"
import { ArtworkActions_artwork } from "__generated__/ArtworkActions_artwork.graphql"
import { ArtworkActionsSaveMutation } from "__generated__/ArtworkActionsSaveMutation.graphql"
import React from "react"
import { NativeModules, Share, TouchableWithoutFeedback, View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import styled from "styled-components/native"

const Constants = NativeModules.ARCocoaConstantsModule
const ApiModule = NativeModules.ARTemporaryAPIModule

interface ArtworkActionsProps {
  artwork: ArtworkActions_artwork
  relay?: RelayProp
}

export const shareMessage = (title, href, artists) => {
  let message
  if (artists && artists.length) {
    const names = []
    artists.forEach((artist, i) => {
      if (i < 3) {
        names.push(artist.name)
      }
    })
    message = `${title} by ${names.join(", ")} on Artsy https://artsy.net${href}`
  } else if (title) {
    message = `${title} on Artsy https://artsy.net${href}`
  } else {
    message = `https://artsy.net${href}`
  }
  return message
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

  handleArtworkShare = async () => {
    const { title, href, artists } = this.props.artwork
    try {
      await Share.share({
        message: shareMessage(title, href, artists),
      })
    } catch (error) {
      console.error("ArtworkActions.tsx", error)
    }
  }

  render() {
    const {
      artwork: { is_saved, image, id, gravityID, heightCm, widthCm },
    } = this.props

    const heightIn = heightCm / 2.54
    const widthIn = widthCm / 2.54

    return (
      <View>
        <Flex flexDirection="row">
          <TouchableWithoutFeedback onPress={() => this.handleArtworkSave()}>
            <UtilButton pr={3} width="110px">
              <Box mr={0.5}>{is_saved ? <HeartFillIcon fill="purple100" /> : <HeartIcon />}</Box>
              <Sans size="3" color={is_saved ? color("purple100") : color("black100")}>
                {is_saved ? "Saved" : "Save"}
              </Sans>
            </UtilButton>
          </TouchableWithoutFeedback>
          {Constants.AREnabled && (
            <TouchableWithoutFeedback
              onPress={() => ApiModule.presentAugmentedRealityVIR(image.url, heightIn, widthIn, gravityID, id)}
            >
              <UtilButton pr={3}>
                <Box mr={0.5}>
                  <EyeOpenedIcon />
                </Box>
                <Sans size="3">View in Room</Sans>
              </UtilButton>
            </TouchableWithoutFeedback>
          )}
          <TouchableWithoutFeedback onPress={() => this.handleArtworkShare()}>
            <UtilButton>
              <Box mr={0.5}>
                <ShareIcon />
              </Box>
              <Sans size="3">Share</Sans>
            </UtilButton>
          </TouchableWithoutFeedback>
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
      gravityID
      title
      href
      is_saved
      artists {
        name
      }
      image {
        url
      }
      widthCm
      heightCm
    }
  `,
})

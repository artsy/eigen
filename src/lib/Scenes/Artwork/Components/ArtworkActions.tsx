import {
  BellFillIcon,
  BellIcon,
  Box,
  color,
  EyeOpenedIcon,
  Flex,
  HeartFillIcon,
  HeartIcon,
  Sans,
  ShareIcon,
} from "@artsy/palette"
import { ArtworkActions_artwork } from "__generated__/ArtworkActions_artwork.graphql"
import { ArtworkActionsSaveMutation } from "__generated__/ArtworkActionsSaveMutation.graphql"
import Events from "lib/NativeModules/Events"
import { Schema, track } from "lib/utils/track"
import { take } from "lodash"
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

export const shareContent = (title, href, artists: ArtworkActions_artwork["artists"]) => {
  let computedTitle: string | null
  if (artists && artists.length) {
    const names = take(artists, 3).map(artist => artist.name)
    computedTitle = `${title} by ${names.join(", ")} on Artsy`
  } else if (title) {
    computedTitle = `${title} on Artsy`
  }
  return {
    title: computedTitle,
    message: computedTitle,
    url: `https://artsy.net${href}`,
  }
}

@track()
export class ArtworkActions extends React.Component<ArtworkActionsProps> {
  @track((props: ArtworkActionsProps) => {
    return {
      action_name: props.artwork.is_saved ? Schema.ActionNames.ArtworkUnsave : Schema.ActionNames.ArtworkSave,
      action_type: Schema.ActionTypes.Success,
      context_module: Schema.ContextModules.ArtworkActions,
    }
  })
  handleArtworkSave() {
    const { artwork, relay } = this.props
    commitMutation<ArtworkActionsSaveMutation>(relay.environment, {
      mutation: graphql`
        mutation ArtworkActionsSaveMutation($input: SaveArtworkInput!) {
          saveArtwork(input: $input) {
            artwork {
              id
              is_saved: isSaved
            }
          }
        }
      `,
      variables: { input: { artworkID: artwork.internalID, remove: artwork.is_saved } },
      optimisticResponse: { saveArtwork: { artwork: { id: artwork.id, is_saved: !artwork.is_saved } } },
      onCompleted: () => Events.userHadMeaningfulInteraction(),
    })
  }

  @track(() => ({
    action_name: Schema.ActionNames.Share,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkActions,
  }))
  async handleArtworkShare() {
    const { title, href, artists } = this.props.artwork
    try {
      await Share.share(shareContent(title, href, artists))
    } catch (error) {
      console.error("ArtworkActions.tsx", error)
    }
  }

  @track(() => ({
    action_name: Schema.ActionNames.ViewInRoom,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkActions,
  }))
  openViewInRoom() {
    const {
      artwork: { image, id, slug, heightCm, widthCm },
    } = this.props
    const heightIn = heightCm / 2.54
    const widthIn = widthCm / 2.54

    ApiModule.presentAugmentedRealityVIR(image.url, widthIn, heightIn, slug, id)
  }

  render() {
    const {
      artwork: { is_saved, is_hangable, sale },
    } = this.props

    const isOpenSale = sale && sale.isAuction && !sale.isClosed

    return (
      <View>
        <Flex flexDirection="row">
          {isOpenSale ? (
            <TouchableWithoutFeedback onPress={() => this.handleArtworkSave()}>
              <UtilButton pr={3}>
                <Box mr={0.5}>{is_saved ? <BellFillIcon fill="purple100" /> : <BellIcon />}</Box>
                <Sans size="3" color={is_saved ? color("purple100") : color("black100")}>
                  Watch lot
                </Sans>
              </UtilButton>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback onPress={() => this.handleArtworkSave()}>
              <UtilButton pr={3}>
                <Box mr={0.5}>{is_saved ? <HeartFillIcon fill="purple100" /> : <HeartIcon />}</Box>
                <Sans size="3" color={is_saved ? color("purple100") : color("black100")}>
                  {is_saved ? "Saved" : "Save"}
                </Sans>
              </UtilButton>
            </TouchableWithoutFeedback>
          )}

          {Constants.AREnabled &&
            is_hangable && (
              <TouchableWithoutFeedback onPress={() => this.openViewInRoom()}>
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
      slug
      title
      href
      is_saved: isSaved
      is_hangable: isHangable
      artists {
        name
      }
      image {
        url
      }
      sale {
        isAuction
        isClosed
      }
      widthCm
      heightCm
    }
  `,
})

import {
  EyeOpenedIcon,
  ShareIcon,
  Flex,
  Text,
  HeartFillIcon,
  HeartIcon,
  useSpace,
  Spacer,
} from "@artsy/palette-mobile"
import { ArtworkActions_artwork$data } from "__generated__/ArtworkActions_artwork.graphql"
import { ArtworkHeader_artwork$data } from "__generated__/ArtworkHeader_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { cm2in } from "app/utils/conversions"
import { refreshFavoriteArtworks } from "app/utils/refreshHelpers"
import { Schema } from "app/utils/track"
import { take } from "lodash"
import { Touchable } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql, useMutation } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface ArtworkActionsProps {
  artwork: ArtworkActions_artwork$data
  shareOnPress: () => void
}

interface SaveIconProps {
  isSaved: boolean
}

const SaveIcon: React.FC<SaveIconProps> = ({ isSaved }) =>
  isSaved ? <HeartFillIcon fill="blue100" /> : <HeartIcon />

export const shareContent = (
  title: string,
  href: string,
  artists: ArtworkHeader_artwork$data["artists"]
) => {
  let computedTitle: string | null = null

  if (artists && artists.length) {
    const names = take(artists, 3).map((artist) => artist?.name)
    computedTitle = `${title} by ${names.join(", ")} on Artsy`
  } else if (title) {
    computedTitle = `${title} on Artsy`
  }

  return {
    title: computedTitle,
    message: computedTitle,
    url: `${unsafe__getEnvironment().webURL}${href}?utm_content=artwork-share`,
  }
}

export const ArtworkActions: React.FC<ArtworkActionsProps> = ({
  artwork: { internalID, image, id, slug, heightCm, widthCm, isHangable, isSaved },
  shareOnPress,
}) => {
  const { trackEvent } = useTracking()
  const space = useSpace()

  const [commit] = useMutation(graphql`
    mutation ArtworkActionsSaveMutation($input: SaveArtworkInput!) {
      saveArtwork(input: $input) {
        artwork {
          id
          isSaved
        }
      }
    }
  `)

  const openViewInRoom = () => {
    const heightIn = cm2in(heightCm!)
    const widthIn = cm2in(widthCm!)

    trackEvent({
      action_name: Schema.ActionNames.ViewInRoom,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkActions,
    })

    LegacyNativeModules.ARTNativeScreenPresenterModule.presentAugmentedRealityVIR(
      image?.url!,
      widthIn,
      heightIn,
      slug,
      id
    )
  }

  const handleArtworkSave = () => {
    commit({
      variables: {
        input: {
          artworkID: internalID,
          remove: isSaved,
        },
      },
      optimisticResponse: {
        saveArtwork: {
          artwork: {
            id,
            isSaved: !isSaved,
          },
        },
      },
      onCompleted: () => {
        refreshFavoriteArtworks()
        trackEvent({
          action_name: isSaved ? Schema.ActionNames.ArtworkUnsave : Schema.ActionNames.ArtworkSave,
          action_type: Schema.ActionTypes.Success,
          context_module: Schema.ContextModules.ArtworkActions,
        })
      },
      onError: () => {
        refreshFavoriteArtworks()
      },
    })
  }

  return (
    <Flex justifyContent="center" flexDirection="row" width="100%">
      <Touchable
        hitSlop={{
          top: space(1),
          left: space(1),
          right: space(1),
          bottom: space(1),
        }}
        haptic
        accessibilityRole="button"
        accessibilityLabel="Save artwork"
        onPress={handleArtworkSave}
      >
        <Flex flex={1} justifyContent="center" alignItems="center" flexDirection="row" pr={2}>
          <SaveIcon isSaved={!!isSaved} />
          <Spacer x={0.5} />
          {/* the spaces below are to not make the icon jumpy when changing from save to saved will work on a more permanent fix */}
          <Text variant="sm">{isSaved ? "Saved" : "Save   "}</Text>
        </Flex>
      </Touchable>
      {!!(LegacyNativeModules.ARCocoaConstantsModule.AREnabled && isHangable) && (
        <TouchableWithoutFeedback onPress={() => openViewInRoom()}>
          <UtilButton pr={2}>
            <EyeOpenedIcon mr={0.5} />
            <Text variant="sm">View in Room</Text>
          </UtilButton>
        </TouchableWithoutFeedback>
      )}
      <Touchable haptic onPress={() => shareOnPress()}>
        <UtilButton>
          <ShareIcon mr={0.5} />
          <Text variant="sm">Share</Text>
        </UtilButton>
      </Touchable>
    </Flex>
  )
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
      isHangable
      isSaved
      image {
        url
      }
      widthCm
      heightCm
    }
  `,
})

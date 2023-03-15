import { EyeOpenedIcon, ShareIcon, Flex, Text } from "@artsy/palette-mobile"
import { ArtworkActions_artwork$data } from "__generated__/ArtworkActions_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { cm2in } from "app/utils/conversions"
import { Schema } from "app/utils/track"
import { take } from "lodash"
import { Touchable } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface ArtworkActionsProps {
  artwork: ArtworkActions_artwork$data
  shareOnPress: () => void
}

export const shareContent = (
  title: string,
  href: string,
  artists: ArtworkActions_artwork$data["artists"]
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
  artwork: { image, id, slug, heightCm, widthCm, isHangable },
  shareOnPress,
}) => {
  const { trackEvent } = useTracking()

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

  return (
    <Flex justifyContent="center" flexDirection="row" width="100%">
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
      slug
      title
      href
      isHangable
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

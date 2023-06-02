import {
  EyeOpenedIcon,
  ShareIcon,
  Flex,
  Text,
  useSpace,
  Join,
  Spacer,
  Touchable,
} from "@artsy/palette-mobile"
import { ArtworkActions_artwork$data } from "__generated__/ArtworkActions_artwork.graphql"
import { ArtworkHeader_artwork$data } from "__generated__/ArtworkHeader_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { ArtworkSaveButton } from "app/Scenes/Artwork/Components/ArtworkSaveButton"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { cm2in } from "app/utils/conversions"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { take } from "lodash"
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

export const ArtworkActions: React.FC<ArtworkActionsProps> = ({ artwork, shareOnPress }) => {
  const { image, id, slug, heightCm, widthCm, isHangable } = artwork
  const { trackEvent } = useTracking()
  const space = useSpace()

  const enableInstantVIR = useFeatureFlag("AREnableInstantViewInRoom")

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
      id,
      enableInstantVIR
    )
  }

  return (
    <Flex justifyContent="center" flexDirection="row" width="100%">
      <Join separator={<Spacer x={2} />}>
        <ArtworkSaveButton artwork={artwork} />
        {!!(LegacyNativeModules.ARCocoaConstantsModule.AREnabled && isHangable) && (
          <Touchable
            hitSlop={{
              top: space(1),
              bottom: space(1),
            }}
            haptic
            onPress={() => openViewInRoom()}
          >
            <UtilButton>
              <EyeOpenedIcon mr={0.5} />
              <Text variant="sm">View in Room</Text>
            </UtilButton>
          </Touchable>
        )}
        <Touchable
          hitSlop={{
            top: space(1),
            bottom: space(1),
            right: space(1),
          }}
          haptic
          onPress={() => shareOnPress()}
        >
          <UtilButton>
            <ShareIcon mr={0.5} />
            <Text variant="sm">Share</Text>
          </UtilButton>
        </Touchable>
      </Join>
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
      ...ArtworkSaveButton_artwork
      id
      slug
      isHangable
      image {
        url
      }
      widthCm
      heightCm
    }
  `,
})

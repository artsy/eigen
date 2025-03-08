import { ContextModule, OwnerType } from "@artsy/cohesion"
import {
  Flex,
  HeartFillIcon,
  HeartIcon,
  Image,
  Text,
  Touchable,
  useColor,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { InfiniteDiscoveryArtworkCard_artwork$key } from "__generated__/InfiniteDiscoveryArtworkCard_artwork.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { GlobalStore } from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { sizeToFit } from "app/utils/useSizeToFit"
import { memo } from "react"
import { ViewStyle } from "react-native"
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface InfiniteDiscoveryArtworkCardProps {
  artwork: InfiniteDiscoveryArtworkCard_artwork$key
  containerStyle?: ViewStyle
  // This is only used for the onboarding animation
  isSaved?: boolean
}

export const InfiniteDiscoveryArtworkCard: React.FC<InfiniteDiscoveryArtworkCardProps> = memo(
  ({ artwork: artworkProp, containerStyle, isSaved: isSavedProp }) => {
    const { width: screenWidth, height: screenHeight } = useScreenDimensions()
    const saveAnimationProgress = useSharedValue(0)

    const { trackEvent } = useTracking()
    const color = useColor()
    const { incrementSavedArtworksCount, decrementSavedArtworksCount } =
      GlobalStore.actions.infiniteDiscovery

    const artwork = useFragment<InfiniteDiscoveryArtworkCard_artwork$key>(
      infiniteDiscoveryArtworkCardFragment,
      artworkProp
    )

    const { isSaved: isSavedToArtworkList, saveArtworkToLists } = useSaveArtworkToArtworkLists({
      artworkFragmentRef: artwork,
      onCompleted: (isArtworkSaved) => {
        trackEvent({
          action_name: isArtworkSaved
            ? Schema.ActionNames.ArtworkSave
            : Schema.ActionNames.ArtworkUnsave,
          action_type: Schema.ActionTypes.Success,
          context_module: ContextModule.infiniteDiscoveryArtworkCard,
          context_screen_owner_id: artwork.internalID,
          context_screen_owner_slug: artwork.slug,
          context_screen_owner_type: OwnerType.infiniteDiscoveryArtwork,
        })

        if (isArtworkSaved) {
          incrementSavedArtworksCount()
        } else {
          decrementSavedArtworksCount()
        }
      },
    })

    const isSaved = isSavedProp !== undefined ? isSavedProp : isSavedToArtworkList

    const animatedSaveButtonStyles = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: interpolate(saveAnimationProgress.value, [0, 0.5, 1], [1, 1.2, 1]),
          },
        ],
      }
    })

    useAnimatedStyle(() => {
      saveAnimationProgress.value = withTiming(isSavedProp ? 1 : 0, {
        duration: 300,
      })
      return {} // Required for ts
    }, [isSavedProp])

    if (!artwork) {
      return null
    }

    const MAX_ARTWORK_HEIGHT = screenHeight * 0.55

    const src = artwork.images?.[0]?.url
    const width = artwork.images?.[0]?.width ?? 0
    const height = artwork.images?.[0]?.height ?? 0

    const size = sizeToFit({ width, height }, { width: screenWidth, height: MAX_ARTWORK_HEIGHT })

    return (
      <Flex backgroundColor="white100" width="100%" style={containerStyle}>
        <Flex mx={2} my={1}>
          <ArtistListItemContainer
            artist={artwork.artists?.[0]}
            avatarSize="xxs"
            includeTombstone={false}
            contextModule={ContextModule.infiniteDiscoveryArtworkCard}
            contextScreenOwnerId={artwork.internalID}
            contextScreenOwnerSlug={artwork.slug}
          />
        </Flex>
        <Flex alignItems="center" minHeight={MAX_ARTWORK_HEIGHT} justifyContent="center">
          {!!src && <Image src={src} height={size.height} width={size.width} />}
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" p={1} mx={2}>
          <Flex>
            <Text color="blue" variant="sm-display" ellipsizeMode="tail" numberOfLines={1}>
              {artwork.internalID}
            </Text>
            <Flex flexDirection="row" maxWidth={screenWidth - 200}>
              <Text
                color="black60"
                italic
                variant="sm-display"
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {artwork.title}
              </Text>
              <Text color="black60" variant="sm-display">
                , {artwork.date}
              </Text>
            </Flex>
            <Text variant="sm-display">{artwork.saleMessage}</Text>
          </Flex>
          <Touchable
            haptic
            hitSlop={{ bottom: 10, right: 10, left: 10, top: 10 }}
            onPress={saveArtworkToLists}
            testID="save-artwork-icon"
          >
            <Flex
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              style={{
                width: HEART_CIRCLE_SIZE + 40,
                height: HEART_CIRCLE_SIZE,
                borderRadius: 30,
                backgroundColor: color("black5"),
              }}
            >
              {!!isSaved ? (
                <Animated.View style={animatedSaveButtonStyles}>
                  <HeartFillIcon
                    testID="filled-heart-icon"
                    height={HEART_ICON_SIZE}
                    width={HEART_ICON_SIZE}
                    fill="blue100"
                  />
                </Animated.View>
              ) : (
                <HeartIcon
                  testID="empty-heart-icon"
                  height={HEART_ICON_SIZE}
                  width={HEART_ICON_SIZE}
                  fill="black100"
                />
              )}
              <Text ml={0.5} variant="sm-display">
                {isSaved ? "Saved" : "Save"}
              </Text>
            </Flex>
          </Touchable>
        </Flex>
      </Flex>
    )
  }
)

const infiniteDiscoveryArtworkCardFragment = graphql`
  fragment InfiniteDiscoveryArtworkCard_artwork on Artwork {
    artistNames
    artists(shallow: true) {
      ...ArtistListItem_artist
    }
    date
    id
    internalID
    images {
      url(version: "large")
      width
      height
    }
    isSaved
    saleMessage
    slug
    title
    ...useSaveArtworkToArtworkLists_artwork
  }
`

const HEART_ICON_SIZE = 18
const HEART_CIRCLE_SIZE = 50

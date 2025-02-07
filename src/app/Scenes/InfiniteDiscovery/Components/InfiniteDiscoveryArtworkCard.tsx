import {
  Flex,
  HeartFillIcon,
  HeartIcon,
  Image,
  Spacer,
  Text,
  Touchable,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { InfiniteDiscoveryArtworkCard_artwork$key } from "__generated__/InfiniteDiscoveryArtworkCard_artwork.graphql"
import { ArtistListItemContainer } from "app/Components/ArtistListItem"
import { useSaveArtworkToArtworkLists } from "app/Components/ArtworkLists/useSaveArtworkToArtworkLists"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { GlobalStore } from "app/store/GlobalStore"
import { Schema } from "app/utils/track"
import { sizeToFit } from "app/utils/useSizeToFit"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface InfiniteDiscoveryArtworkCardProps {
  artwork: InfiniteDiscoveryArtworkCard_artwork$key
}

export const InfiniteDiscoveryArtworkCard: React.FC<InfiniteDiscoveryArtworkCardProps> = ({
  artwork: artworkProp,
}) => {
  const { width: screenWidth } = useScreenDimensions()
  const { trackEvent } = useTracking()
  const { incrementSavedArtworksCount, decrementSavedArtworksCount } =
    GlobalStore.actions.infiniteDiscovery

  const artwork = useFragment<InfiniteDiscoveryArtworkCard_artwork$key>(
    infiniteDiscoveryArtworkCardFragment,
    artworkProp
  )

  const { isSaved, saveArtworkToLists } = useSaveArtworkToArtworkLists({
    artworkFragmentRef: artwork,
    onCompleted: (isArtworkSaved) => {
      trackEvent({
        action_name: isArtworkSaved
          ? Schema.ActionNames.ArtworkSave
          : Schema.ActionNames.ArtworkUnsave,
        action_type: Schema.ActionTypes.Success,
        context_module: Schema.ContextModules.ArtworkActions,
      })

      if (isArtworkSaved) {
        incrementSavedArtworksCount()
      } else {
        decrementSavedArtworksCount()
      }
    },
  })

  if (!artwork) {
    return null
  }

  const MAX_ARTWORK_HEIGHT = 500
  const CARD_HEIGHT = 800

  const src = artwork.images?.[0]?.url
  const width = artwork.images?.[0]?.width ?? 0
  const height = artwork.images?.[0]?.height ?? 0

  const size = sizeToFit(
    { width: width, height: height },
    { width: screenWidth, height: MAX_ARTWORK_HEIGHT }
  )

  return (
    <Flex backgroundColor="white100" width="100%" height={CARD_HEIGHT} style={{ borderRadius: 10 }}>
      <ArtistListItemContainer artist={artwork.artists?.[0]} />
      <Spacer y={2} />

      <Flex alignItems="center" backgroundColor="purple60">
        {!!src && <Image src={src} height={size.height} width={size.width} />}
      </Flex>
      <Flex flexDirection="row" justifyContent="space-between" p={1}>
        <Flex>
          <Flex flexDirection="row" maxWidth={screenWidth - 200}>
            {/* TODO: maxWidth above and ellipsizeMode + numberOfLines below are used to */}
            {/* prevent long artwork titles from pushing the save button off of the card, */}
            {/* it doesn't work as expected on Android. */}
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
          hitSlop={{ bottom: 5, right: 5, left: 5, top: 5 }}
          onPress={saveArtworkToLists}
          testID="save-artwork-icon"
        >
          {!!isSaved ? (
            <HeartFillIcon
              testID="filled-heart-icon"
              height={HEART_ICON_SIZE}
              width={HEART_ICON_SIZE}
              fill="blue100"
            />
          ) : (
            <HeartIcon
              testID="empty-heart-icon"
              height={HEART_ICON_SIZE}
              width={HEART_ICON_SIZE}
              fill="black100"
            />
          )}
        </Touchable>
      </Flex>
    </Flex>
  )
}

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
    title
    ...useSaveArtworkToArtworkLists_artwork
  }
`

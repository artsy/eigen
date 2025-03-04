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
import { memo, useState } from "react"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface InfiniteDiscoveryArtworkCardProps {
  artwork: InfiniteDiscoveryArtworkCard_artwork$key
}

export const InfiniteDiscoveryArtworkCard: React.FC<InfiniteDiscoveryArtworkCardProps> = memo(
  ({ artwork: artworkProp }) => {
    const { width: screenWidth, height: screenHeight } = useScreenDimensions()
    const { trackEvent } = useTracking()
    const color = useColor()
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

    const [isSaving, setIsSaving] = useState(false)

    if (!artwork) {
      return null
    }

    const MAX_ARTWORK_HEIGHT = screenHeight * 0.55

    const src = artwork.images?.[0]?.url
    const width = artwork.images?.[0]?.width ?? 0
    const height = artwork.images?.[0]?.height ?? 0

    const size = sizeToFit({ width, height }, { width: screenWidth, height: MAX_ARTWORK_HEIGHT })

    return (
      <Flex backgroundColor="white100" width="100%" style={{ borderRadius: 10 }}>
        {/* main outer container */}

        {/* artist name and avatar */}
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

        {/* image itself */}
        <Flex alignItems="center" minHeight={MAX_ARTWORK_HEIGHT} justifyContent="center">
          {!!src && <Image src={src} height={size.height} width={size.width} />}
        </Flex>

        {/* spaces out artwork data and save buttons section */}
        <Flex flexDirection="row" justifyContent="space-between" p={1} mx={2}>
          {/* artwork data (internal ID, title, date, and sale message (price, etc)) */}
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

          {/* save button specifically and button logic */}
          <Touchable
            haptic
            hitSlop={{ bottom: 10, right: 10, left: 10, top: 10 }}
            // onPress={saveArtworkToLists}
            onPress={async () => {
              if (isSaving) return
              setIsSaving(true)
              await saveArtworkToLists()
              setIsSaving(false)
            }}
            testID="save-artwork-icon"
          >
            <Flex
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              style={{
                width: HEART_CIRCLE_SIZE + 40,
                height: HEART_CIRCLE_SIZE,
                borderRadius: (HEART_CIRCLE_SIZE + 30) / 2,
                backgroundColor: color("black5"),
                paddingHorizontal: 10,
              }}
            >
              {/* when the artwork is saved */}
              {!!isSaved ? (
                // <Flex
                //   style={{
                //     width: HEART_CIRCLE_SIZE,
                //     height: HEART_CIRCLE_SIZE,
                //     borderRadius: HEART_CIRCLE_SIZE,
                //     backgroundColor: color("black50"),
                //     justifyContent: "center",
                //     alignItems: "center",
                //   }}
                // >
                <HeartFillIcon
                  testID="filled-heart-icon"
                  height={HEART_ICON_SIZE}
                  width={HEART_ICON_SIZE}
                  fill="blue100"
                />
              ) : (
                // {/* </Flex> */}
                // <Flex
                //   style={{
                //     width: HEART_CIRCLE_SIZE,
                //     height: HEART_CIRCLE_SIZE,
                //     borderRadius: HEART_CIRCLE_SIZE,
                //     backgroundColor: color("black5"),
                //     justifyContent: "center",
                //     alignItems: "center",
                //   }}
                // >
                <HeartIcon
                  testID="empty-heart-icon"
                  height={HEART_ICON_SIZE}
                  width={HEART_ICON_SIZE}
                  fill="black100"
                />
                // {/* </Flex> */}
              )}
              <Text ml={0.5} variant="sm-display" color={isSaving ? "gray10" : "black100"}>
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

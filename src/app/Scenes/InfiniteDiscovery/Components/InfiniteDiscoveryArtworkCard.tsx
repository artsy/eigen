import {
  Button,
  EntityHeader,
  Flex,
  HeartFillIcon,
  HeartIcon,
  Image,
  Spacer,
  Text,
  Touchable,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { InfiniteDiscoveryArtworkCard_artwork$key } from "__generated__/InfiniteDiscoveryArtworkCard_artwork.graphql"
import { HEART_ICON_SIZE } from "app/Components/constants"
import { useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { sizeToFit } from "app/utils/useSizeToFit"
import { graphql, useFragment } from "react-relay"

interface InfiniteDiscoveryArtworkCardProps {
  artwork: InfiniteDiscoveryArtworkCard_artwork$key
}

export const InfiniteDiscoveryArtworkCard: React.FC<InfiniteDiscoveryArtworkCardProps> = ({
  artwork: artworkProp,
}) => {
  const { color } = useTheme()
  const { width: screenWidth } = useScreenDimensions()

  const artwork = useFragment<InfiniteDiscoveryArtworkCard_artwork$key>(
    infiniteDiscoveryArtworkCardFragment,
    artworkProp
  )

  const saveArtwork = useSaveArtwork({
    id: artwork?.id as string,
    internalID: artwork?.internalID as string,
    isSaved: !!artwork?.isSaved,
    onCompleted: (isSaved) =>
      console.error(`Untracked artwork ${isSaved ? "save" : "unsave"} event`),
    onError: (error) => console.error("Error saving artwork:", error),
  })

  if (!artwork) {
    return null
  }

  const src = artwork.images?.[0]?.url
  const width = artwork.images?.[0]?.width ?? 0
  const height = artwork.images?.[0]?.height ?? 0

  const size = sizeToFit({ width: width, height: height }, { width: screenWidth, height: 500 })

  return (
    <Flex backgroundColor={color("white100")} width="100%" height={800}>
      <EntityHeader
        name={artwork.artistNames ?? ""}
        meta={artwork.artists?.[0]?.formattedNationalityAndBirthday ?? undefined}
        imageUrl={artwork.artists?.[0]?.coverArtwork?.images?.[0]?.url ?? undefined}
        initials={artwork.artists?.[0]?.initials ?? undefined}
        RightButton={
          <Button variant="outlineGray" size="small">
            Follow
          </Button>
        }
        p={1}
      />
      <Spacer y={2} />

      <Flex alignItems="center" backgroundColor={color("purple60")}>
        {!!src && <Image src={src} height={size.height} width={size.width} />}
      </Flex>
      <Flex flexDirection="row" justifyContent="space-between" p={1}>
        <Flex>
          <Flex flexDirection="row" maxWidth={screenWidth - 200}>
            {/* TODO: maxWidth above and ellipsizeMode + numberOfLines below are used to */}
            {/* prevent long artwork titles from pushing the save button off of the card, */}
            {/* it doesn't work as expected on Android. */}
            <Text
              color={color("black60")}
              italic
              variant="sm-display"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {artwork.title}
            </Text>
            <Text color={color("black60")} variant="sm-display">
              , {artwork.date}
            </Text>
          </Flex>
          <Text variant="sm-display">{artwork.saleMessage}</Text>
        </Flex>
        <Touchable
          haptic
          hitSlop={{ bottom: 5, right: 5, left: 5, top: 5 }}
          onPress={saveArtwork}
          testID="save-artwork-icon"
        >
          {!!artwork.isSaved ? (
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
      coverArtwork {
        images {
          url(version: "small")
        }
      }
      formattedNationalityAndBirthday
      initials
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

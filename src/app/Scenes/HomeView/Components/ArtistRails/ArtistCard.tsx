import { CloseIcon } from "@artsy/icons/native"
import { Flex, FollowButton, Image, Text, Touchable, useColor } from "@artsy/palette-mobile"
import { ArtistCard_artist$data } from "__generated__/ArtistCard_artist.graphql"
import { useFollowArtist } from "app/Components/Artist/useFollowArtist"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { memo } from "react"
import { createFragmentContainer, graphql } from "react-relay"

export const ARTIST_CARD_WIDTH = 295

interface ArtistCardProps {
  artist: ArtistCard_artist$data
  onDismiss?: () => void
  onFollow?: () => void
  onPress?: () => void
  // Use the default follow button instead of the injected onFollow button
  showDefaultFollowButton?: boolean
}

export const IMAGE_MAX_HEIGHT = 180

export const ArtistCard: React.FC<ArtistCardProps> = memo(
  ({ artist, onDismiss, onFollow, onPress, showDefaultFollowButton = false }) => {
    const color = useColor()
    const { handleFollowToggle } = useFollowArtist(artist)

    if (__DEV__) {
      if (showDefaultFollowButton && onFollow) {
        console.warn(
          "ArtistCard: onFollow and showDefaultFollowButton are both set, onFollow will be ignored"
        )
      }
    }

    const artistImages = extractNodes(artist.filterArtworksConnection)
      .filter((artwork) => {
        // Image is valid and has a width and height
        return (
          artwork.image?.resized?.src && artwork.image.resized.width && artwork.image.resized.height
        )
      })
      .map((artwork) => artwork.image?.resized) as Array<{
      height: number
      src: string
      width: number
    }>

    return (
      <RouterLink onPress={onPress} to={artist.href}>
        <Flex width={ARTIST_CARD_WIDTH} overflow="hidden">
          <ArtworkCardImages images={artistImages} />

          <Flex flexDirection="row" mt={1}>
            <Flex flex={1} flexDirection="column" justifyContent="center">
              <Text numberOfLines={1}>{artist.name}</Text>
              {!!artist.formattedNationalityAndBirthday && (
                <Text numberOfLines={1} variant="xs" color="mono60">
                  {artist.formattedNationalityAndBirthday}
                </Text>
              )}
            </Flex>
            {!!(onFollow || showDefaultFollowButton) && (
              <Flex>
                <FollowButton
                  isFollowed={!!artist.isFollowed}
                  onPress={onFollow ?? handleFollowToggle}
                />
              </Flex>
            )}
          </Flex>
          {!!onDismiss && (
            <Flex
              position="absolute"
              overflow="hidden"
              backgroundColor={color("mono0")}
              alignItems="center"
              justifyContent="center"
              borderRadius={12}
              style={{ top: 6, right: 6, width: 24, height: 24 }}
            >
              <Touchable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                activeOpacity={0.2}
                onPress={onDismiss}
              >
                <CloseIcon fill="mono60" width={16} height={16} />
              </Touchable>
            </Flex>
          )}
        </Flex>
      </RouterLink>
    )
  }
)

// Refers to how much should images hide behind each other
const IMAGE_OVERLAY = 20
// Refers to how much should images be zoomed in
const ZOOM_IN_FACTOR = 1.5
// Refers to the difference in height factor between two consecutive images
const DIFFERENCE_FACTOR = 0.25

const ArtworkCardImages = ({
  images,
}: {
  images: Array<{
    height: number
    src: string
    width: number
  }>
}) => {
  const numOfImages = images.length

  const imageWidth = ARTIST_CARD_WIDTH / numOfImages + IMAGE_OVERLAY

  const getContainerHeight = (index: number) => {
    let indexFactor
    switch (index) {
      case 0:
        indexFactor = 0
        break
      case 1:
        indexFactor = 2
        break
      case 2:
        indexFactor = 1
        break

      default:
        indexFactor = 0
        break
    }
    return IMAGE_MAX_HEIGHT - IMAGE_MAX_HEIGHT * DIFFERENCE_FACTOR * indexFactor
  }

  return (
    <Flex flexDirection="row" justifyContent="space-around" width={ARTIST_CARD_WIDTH}>
      {images.length > 0 ? (
        images.map((image, index) => {
          const containerHeight = getContainerHeight(index)

          return (
            <Flex height={IMAGE_MAX_HEIGHT} key={image.src} justifyContent="flex-end">
              <Flex
                height={containerHeight}
                width={imageWidth}
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
              >
                <Image
                  src={image.src}
                  performResize={false}
                  height={containerHeight * ZOOM_IN_FACTOR}
                  width={imageWidth * ZOOM_IN_FACTOR}
                />
              </Flex>
            </Flex>
          )
        })
      ) : (
        <Flex height={IMAGE_MAX_HEIGHT} width={ARTIST_CARD_WIDTH} backgroundColor="mono10" />
      )}
    </Flex>
  )
}

export const ArtistCardContainer = createFragmentContainer(ArtistCard, {
  artist: graphql`
    fragment ArtistCard_artist on Artist {
      id
      slug
      internalID
      href
      name
      formattedNationalityAndBirthday
      basedOn {
        name
      }
      isFollowed
      filterArtworksConnection(first: 3, sort: "-weighted_iconicity") {
        edges {
          node {
            image {
              resized(width: 590, version: ["main", "larger", "large"]) {
                src
                width
                height
              }
            }
          }
        }
      }
      ...useFollowArtist_artist
    }
  `,
})

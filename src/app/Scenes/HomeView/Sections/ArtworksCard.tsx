import { Flex, Image, useSpace, useScreenDimensions } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface ArtworksCardProps extends ArtworkActionTrackingProps {
  artworks: any
}

export const ArtworksCard: React.FC<ArtworksCardProps> = ({ artworks }) => {
  const artworksData = useFragment(artworksCard, artworks)
  const space = useSpace()
  const { width, height } = useScreenDimensions()
  const isIPad = isTablet()

  const isLeadingImageVertical = artworksData[0].image.aspectRatio < 1 || isIPad

  const cardHeight = isIPad ? height / 2 : height / 2.5
  const cardWidth = width - space(4)

  const dimensions = calculateDimensions(
    isLeadingImageVertical,
    cardWidth,
    cardHeight,
    isIPad,
    space(0.5)
  )

  const renderArtwork = (artwork: any, width: number, height: number) => (
    <RouterLink>
      <Image
        src={artwork?.image?.url || ""}
        width={width}
        height={height}
        blurhash={artwork?.image?.blurhash}
        resizeMode="cover"
      />
    </RouterLink>
  )

  return (
    <Flex
      width={cardWidth}
      flexDirection={isLeadingImageVertical ? "row" : "column"}
      gap={0.5}
      alignSelf="center"
      backgroundColor="red"
    >
      {renderArtwork(artworksData[0], dimensions.main.width, dimensions.main.height)}

      <Flex flexDirection={isLeadingImageVertical ? "column" : "row"} gap={0.5}>
        {renderArtwork(artworksData[1], dimensions.small.width, dimensions.small.height)}
        {renderArtwork(artworksData[2], dimensions.small.width, dimensions.small.height)}
      </Flex>
    </Flex>
  )
}

// helper function to get artworks dimentions
function calculateDimensions(
  isVertical: boolean,
  cardWidth: number,
  cardHeight: number,
  isIPad: boolean,
  gap: number
) {
  if (isVertical) {
    const mainWidth = isIPad ? (cardWidth * 2) / 3 : cardWidth / 2
    return {
      main: {
        width: mainWidth,
        height: cardHeight,
      },
      small: {
        width: cardWidth - mainWidth - gap,
        height: cardHeight / 2 - gap / 2,
      },
    }
  }

  return {
    main: {
      width: cardWidth,
      height: cardWidth,
    },
    small: {
      width: cardWidth / 2 - gap / 2,
      height: cardWidth / 2 - gap / 2,
    },
  }
}

const artworksCard = graphql`
  fragment ArtworksCard_artworks on Artwork @relay(plural: true) {
    href
    internalID
    slug
    image(includeAll: false) {
      blurhash
      url(version: ["larger", "large", "medium", "small", "square"])
      aspectRatio
      width
      height
    }
  }
`

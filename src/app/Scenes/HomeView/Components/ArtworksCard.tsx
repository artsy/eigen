import { Flex, Image, useSpace, useScreenDimensions } from "@artsy/palette-mobile"
import {
  ArtworksCard_artworks$data,
  ArtworksCard_artworks$key,
} from "__generated__/ArtworksCard_artworks.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface ArtworksCardProps extends ArtworkActionTrackingProps {
  artworks: ArtworksCard_artworks$key
  href: string
  onPress: (artwork: ArtworksCard_artworks$data[number], index: number) => void
}

export const ArtworksCard: React.FC<ArtworksCardProps> = ({ artworks, href, onPress }) => {
  const artworksData = useFragment(artworksCard, artworks)
  const space = useSpace()

  const dimensions = useArtworksCardDimensions(artworksData[0]?.image?.aspectRatio ?? 1, space)

  if (!artworksData[0]?.image) return null

  const renderArtwork = (index: number, width: number, height: number) => {
    const artwork = artworksData[index]
    const to = `${href}${href.includes("?") ? "&" : "?"}artworkIndex=${index.toString()}`
    return (
      <RouterLink to={to} onPress={() => onPress(artwork, index)}>
        <Image
          accessibilityLabel="artwork image"
          src={artwork.image?.url || ""}
          width={width}
          height={height}
          blurhash={artwork?.image?.blurhash}
          resizeMode="cover"
          testID="artwork-image"
        />
      </RouterLink>
    )
  }

  return (
    <Flex
      width={dimensions.cardWidth}
      flexDirection={dimensions.isVertical ? "row" : "column"}
      gap={0.5}
      alignSelf="center"
      testID="artworks-card"
    >
      {renderArtwork(0, dimensions.main.width, dimensions.main.height)}

      <Flex flexDirection={dimensions.isVertical ? "column" : "row"} gap={0.5}>
        {renderArtwork(1, dimensions.small.width, dimensions.small.height)}
        {renderArtwork(2, dimensions.small.width, dimensions.small.height)}
      </Flex>
    </Flex>
  )
}

// Custom hook that handles all dimension calculations
interface CardDimensions {
  cardWidth: number
  cardHeight: number
  isVertical: boolean
  main: { width: number; height: number }
  small: { width: number; height: number }
}

function useArtworksCardDimensions(
  aspectRatio: number,
  space: ReturnType<typeof useSpace>
): CardDimensions {
  const { width: screenWidth, height: screenHeight } = useScreenDimensions()
  const isIPad = isTablet()

  const cardWidth = screenWidth - space(4)
  const cardHeight = isIPad ? screenHeight / 2 : screenHeight / 2.5
  const isVertical = aspectRatio < 1 || isIPad
  const gapSize = space(0.5)

  if (isVertical) {
    const mainWidth = isIPad ? (cardWidth * 2) / 3 : cardWidth / 2
    return {
      cardWidth,
      cardHeight,
      isVertical,
      main: {
        width: mainWidth,
        height: cardHeight,
      },
      small: {
        width: cardWidth - mainWidth - gapSize,
        height: cardHeight / 2 - gapSize / 2,
      },
    }
  }

  return {
    cardWidth,
    cardHeight,
    isVertical,
    main: {
      width: cardWidth,
      height: cardWidth,
    },
    small: {
      width: cardWidth / 2 - gapSize / 2,
      height: cardWidth / 2 - gapSize / 2,
    },
  }
}

const artworksCard = graphql`
  fragment ArtworksCard_artworks on Artwork @relay(plural: true) {
    internalID
    slug
    image(includeAll: false) {
      blurhash
      url(version: ["larger", "large", "medium", "small", "square"])
      aspectRatio
    }
  }
`

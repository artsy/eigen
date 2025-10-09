import { Flex, Image, useSpace, useScreenDimensions } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { graphql, useFragment } from "react-relay"

interface ArtworksCardProps extends ArtworkActionTrackingProps {
  artworks: any
}
export const ArtworksCard: React.FC<ArtworksCardProps> = ({ artworks }) => {
  const artworksData = useFragment(artworksCard, artworks)
  const space = useSpace()
  const { width, height } = useScreenDimensions()

  const layout = artworksData[0].image.aspectRatio < 1 ? "horizontal" : "vertical"

  const cardHeight = height / 2.5
  const cardWidth = width - space(2) - space(2)

  const smallArtworksDimentions = cardHeight / 2
  const mainArtworkDimantions =
    layout === "horizontal"
      ? {
          width: cardWidth / 2 - space(0.5) / 2,
          height: cardHeight + space(0.5),
        }
      : {
          width: cardWidth,
          height: cardHeight,
        }

  // Helper function to get artwork configuration
  const getArtworkConfig = (index: number) => {
    const artwork = artworksData[index]

    if (index === 0) {
      return {
        artwork,
        imageURL: artwork?.image?.url,
        width: mainArtworkDimantions.width,
        height: mainArtworkDimantions.height,
        aspectRatio: 1,
        href: artwork?.href,
      }
    } else {
      return {
        artwork,
        imageURL: artwork?.image?.url,
        width: cardWidth / 2 - space(0.5) / 2,
        height: smallArtworksDimentions,
        aspectRatio: artwork?.image?.aspectRatio,
        href: artwork?.href,
      }
    }
  }

  // Get configurations for each artwork
  const mainArtwork = getArtworkConfig(0)
  const leftArtwork = getArtworkConfig(1)
  const rightArtwork = getArtworkConfig(2)

  return (
    <Flex
      width={cardWidth}
      flexDirection={layout === "horizontal" ? "row" : "column"}
      gap={0.5}
      alignSelf="center"
    >
      <RouterLink>
        <Image
          src={mainArtwork.imageURL || ""}
          width={mainArtwork.width}
          height={mainArtwork.height}
          aspectRatio={mainArtwork.aspectRatio}
          blurhash={mainArtwork.artwork?.image?.blurhash}
        />
      </RouterLink>

      <Flex flexDirection={layout === "horizontal" ? "column" : "row"} gap={0.5}>
        <RouterLink>
          <Image
            src={leftArtwork.imageURL || ""}
            width={leftArtwork.width}
            height={leftArtwork.height}
            aspectRatio={leftArtwork.aspectRatio}
            blurhash={leftArtwork.artwork?.image?.blurhash}
          />
        </RouterLink>

        <RouterLink>
          <Image
            src={rightArtwork.imageURL || ""}
            width={rightArtwork.width}
            height={rightArtwork.height}
            aspectRatio={rightArtwork.aspectRatio}
            blurhash={rightArtwork.artwork?.image?.blurhash}
          />
        </RouterLink>
      </Flex>
    </Flex>
  )
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

import { Flex, Image, useSpace, useScreenDimensions } from "@artsy/palette-mobile"
import { ArtworksCarousel } from "app/Scenes/HomeView/Sections/HomeViewUnderXArtworksCard/ArtworksCarousel"
import { RouterLink } from "app/system/navigation/RouterLink"
import { ArtworkActionTrackingProps } from "app/utils/track/ArtworkActions"
import { useState } from "react"
import { graphql, useFragment } from "react-relay"

export type ArtworkIndex = 1 | 2 | 3

interface HomeViewUnderXArtworksCardProps extends ArtworkActionTrackingProps {
  artworks: any
}
export const HomeViewUnderXArtworksCard: React.FC<HomeViewUnderXArtworksCardProps> = ({
  artworks,
}) => {
  const artworksData = useFragment(homeViewunderXArtworksCard, artworks)
  const space = useSpace()
  const [artworksCarouselVisible, setArtworksCarouselVisible] = useState(false)
  const [pressedArtworkIndex, setPressedArtworkIndex] = useState<ArtworkIndex>(1)
  const { width, height } = useScreenDimensions()

  const smallArtworkHeight = 150

  // Helper function to get artwork configuration
  const getArtworkConfig = (index: number) => {
    const artwork = artworksData[index]

    if (index === 0) {
      return {
        artwork,
        imageURL: artwork?.image?.url,
        width,
        height: height / 3,
        aspectRatio: 1,
        href: artwork?.href,
      }
    } else if (index === 1) {
      return {
        artwork,
        imageURL: artwork?.image?.url,
        width: width / 3 - space(0.5) / 2,
        height: smallArtworkHeight,
        aspectRatio: artwork?.image?.aspectRatio,
        href: artwork?.href,
      }
    } else {
      return {
        artwork,
        imageURL: artwork?.image?.url,
        width: (width * 2) / 3 - space(0.5) / 2,
        height: smallArtworkHeight,
        aspectRatio: artwork?.image?.aspectRatio,
        href: artwork?.href,
      }
    }
  }

  // Get configurations for each artwork
  const mainArtwork = getArtworkConfig(0)
  const leftArtwork = getArtworkConfig(1)
  const rightArtwork = getArtworkConfig(2)

  const onArtworkPress = (artworkIndex: ArtworkIndex) => {
    setArtworksCarouselVisible(true)
    setPressedArtworkIndex(artworkIndex)
  }

  return (
    <>
      <Flex width={width} maxWidth={width}>
        <Flex flex={1} mb={0.5}>
          <RouterLink onPress={() => onArtworkPress(1)}>
            <Image
              src={mainArtwork.imageURL || ""}
              width={mainArtwork.width}
              height={mainArtwork.height}
              aspectRatio={mainArtwork.aspectRatio}
              blurhash={mainArtwork.artwork?.image?.blurhash}
            />
          </RouterLink>
        </Flex>

        <Flex flexDirection="row" gap={0.5}>
          <Flex flex={1}>
            <RouterLink onPress={() => onArtworkPress(1)}>
              <Image
                src={leftArtwork.imageURL || ""}
                width={leftArtwork.width}
                height={leftArtwork.height}
                aspectRatio={leftArtwork.aspectRatio}
                blurhash={leftArtwork.artwork?.image?.blurhash}
              />
            </RouterLink>
          </Flex>

          <Flex flex={2} height={150}>
            <RouterLink onPress={() => onArtworkPress(1)}>
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
      </Flex>

      <ArtworksCarousel
        isVisible={artworksCarouselVisible}
        artworkIndex={pressedArtworkIndex}
        artworks={artworks}
        closeModal={() => {
          setArtworksCarouselVisible(false)
        }}
      />
    </>
  )
}

const homeViewunderXArtworksCard = graphql`
  fragment HomeViewUnderXArtworksCard_artworks on Artwork @relay(plural: true) {
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
    ...ArtworksCarousel_artworks
  }
`

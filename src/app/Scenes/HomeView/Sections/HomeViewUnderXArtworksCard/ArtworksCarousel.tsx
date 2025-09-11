import { CloseIcon } from "@artsy/icons/native"
import {
  Image,
  Flex,
  Screen,
  Spacer,
  Text,
  useScreenDimensions,
  useSpace,
  Touchable,
  DEFAULT_HIT_SLOP,
} from "@artsy/palette-mobile"
import { ArtworkIndex } from "app/Scenes/HomeView/Sections/HomeViewUnderXArtworksCard"
import { FlatList, Modal } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useFragment } from "react-relay"

interface ArtworksCarouselProps {
  isVisible: boolean
  artworkIndex: ArtworkIndex
  artworks: any
  closeModal: () => void
}

export const ArtworksCarousel: React.FC<ArtworksCarouselProps> = ({
  isVisible,
  artworks,
  closeModal,
}) => {
  const insets = useSafeAreaInsets()
  const space = useSpace()

  if (!isVisible) {
    return
  }

  return (
    <Modal visible={isVisible} presentationStyle="overFullScreen" animationType="slide">
      <Screen safeArea={false} backgroundColor="mono60">
        <Touchable
          haptic
          accessibilityRole="button"
          onPress={closeModal}
          hitSlop={DEFAULT_HIT_SLOP}
          style={{
            marginHorizontal: space(2),
            top: insets.top,
            position: "absolute",
            zIndex: 1,
          }}
        >
          <CloseIcon fill="mono0" />
        </Touchable>
        <ArtworksSwiper artworks={artworks} />
      </Screen>
    </Modal>
  )
}

const artworksCarousel = graphql`
  fragment ArtworksCarousel_artworks on Artwork @relay(plural: true) {
    href
    internalID
    slug
    title
    artistNames
    image(includeAll: false) {
      blurhash
      url(version: ["larger", "large", "medium", "small", "square"])
      aspectRatio
      width
      height
    }
    partner(shallow: true) {
      name
    }
  }
`

interface ArtworksSwiperProps {
  artworks: any
}

const ArtworksSwiper: React.FC<ArtworksSwiperProps> = ({ artworks }) => {
  const artworksData = useFragment(artworksCarousel, artworks)
  const { width } = useScreenDimensions()
  const space = useSpace()
  const imageWidth = width - space(4) - space(4)
  /*
  useEffect(() => {
    if (query) {
      // the query changed, prevent loading more pages until the user starts scrolling
      userHasStartedScrolling.current = false
    }
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true })
    }
  }, [query])
*/

  return (
    <>
      <Flex flex={1} justifyContent="center">
        <FlatList
          data={artworksData}
          keyExtractor={(item) => item.internalID}
          horizontal
          renderItem={({ item: artwork, index }) => {
            const firstItem = index === 0
            const lastItem = index === artworksData.length - 1

            return (
              <Flex
                key={index}
                justifyContent="center"
                pl={firstItem ? 2 : 1}
                pr={lastItem ? 2 : 1}
              >
                <Image
                  src={artwork.image.url || ""}
                  width={imageWidth}
                  aspectRatio={artwork.image.aspectRatio || 1}
                />
                <Spacer y={2} />
                <Text color="mono0">{artwork.artistNames}</Text>
                <Text color="mono0">{artwork.title}</Text>
                <Text color="mono0">{artwork.partner?.name}</Text>
              </Flex>
            )
          }}
        />
      </Flex>
    </>
  )
}

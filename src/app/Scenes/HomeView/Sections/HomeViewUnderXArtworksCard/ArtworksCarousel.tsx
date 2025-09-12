import { CloseIcon } from "@artsy/icons/native"
import {
  Flex,
  Screen,
  Text,
  useScreenDimensions,
  useSpace,
  Touchable,
  DEFAULT_HIT_SLOP,
  Button,
  Image,
} from "@artsy/palette-mobile"
import { Modal } from "react-native"
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { graphql, useFragment } from "react-relay"

interface ArtworksCarouselModalProps {
  isVisible: boolean
  pressedArtworkIndex: number
  artworks: any
  closeModal: () => void
}

export const ArtworksCarouselModal: React.FC<ArtworksCarouselModalProps> = ({
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
        <ArtworksCarousel artworks={artworks} />
      </Screen>
    </Modal>
  )
}

// TODL remane to fragment ArtworksCarouselModal_artworks + rename the file
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

interface ArtworksCarouselProps {
  artworks: any
}

const ArtworksCarousel: React.FC<ArtworksCarouselProps> = ({ artworks }) => {
  const artworksData = useFragment(artworksCarousel, artworks)
  const scrollX = useSharedValue(0)

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  return (
    <Flex flex={1} justifyContent="center">
      <Animated.FlatList
        data={artworksData}
        keyExtractor={(item) => item.internalID}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        renderItem={({ item: artwork, index }) => {
          return <ArtworksCarouselItem item={artwork} index={index} scrollX={scrollX} />
        }}
      />
    </Flex>
  )
}

interface ArtworksCarouselItemProps {
  item: any // TODO: type artwork
  index: number
  scrollX: SharedValue<number>
}

export const ArtworksCarouselItem: React.FC<ArtworksCarouselItemProps> = ({
  item: artwork,
  index,
  scrollX,
}) => {
  const { width } = useScreenDimensions()
  const space = useSpace()
  const imageWidth = width - space(4) - space(4) - space(2)

  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-imageWidth * 0.25, 0, imageWidth * 0.25],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          ),
        },
      ],
    }
  })
  return (
    <Animated.View
      key={index}
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          width: width,
          gap: space(2),
        },
        rnAnimatedStyle,
      ]}
    >
      <Image
        src={artwork.image.url || ""}
        width={imageWidth}
        aspectRatio={artwork.image.aspectRatio || 1}
      />
      <Flex width={imageWidth} flexDirection="row" justifyContent="space-between">
        <Flex flex={2}>
          <Text color="mono0" numberOfLines={1}>
            {artwork.artistNames}
          </Text>
          <Text color="mono0" numberOfLines={1}>
            {artwork.title}
          </Text>
          <Text color="mono0" numberOfLines={1}>
            {artwork.partner?.name}
          </Text>
        </Flex>
        <Flex flex={1.5} alignItems="flex-end">
          <Button>Hello</Button>
        </Flex>
      </Flex>
    </Animated.View>
  )
}

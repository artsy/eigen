import { createGeminiUrl } from "@artsy/palette-mobile/dist/utils/createGeminiUrl"
import { distanceFromPosition } from "app/Scenes/HomeView/Components/CityGuides/cityGuidesCarousel"
import { memo, useMemo } from "react"
import { StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated"

/**
 * The backdrop is heavily blurred, so a tiny image upscaled looks the same as a large one while
 * being a fraction of the download and making the blur itself cheap.
 */
const BACKDROP_IMAGE_WIDTH = 60
const BACKDROP_IMAGE_HEIGHT = 72
const BACKDROP_BLUR_RADIUS = 4
/** Hides the soft, see-through edges a blur leaves behind */
const BACKDROP_SCALE = 1.18

const GRADIENT_COLORS = ["rgba(0, 0, 0, 0.55)", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.6)"]
const GRADIENT_LOCATIONS = [0, 0.45, 1]

interface CityGuidesBackdropProps {
  imageURLs: Array<string | null | undefined>
  /** Scroll position in item units, e.g. 2.5 is halfway between the 3rd and 4th items */
  position: SharedValue<number>
  loop: boolean
}

/**
 * One blurred layer per card, stacked. Their opacities follow the scroll position, so the
 * background crossfades as you swipe, entirely on the UI thread.
 */
export const CityGuidesBackdrop: React.FC<CityGuidesBackdropProps> = memo(
  ({ imageURLs, position, loop }) => {
    return (
      <>
        {imageURLs.map((imageURL, index) => (
          <BackdropLayer
            key={index}
            imageURL={imageURL}
            index={index}
            count={imageURLs.length}
            position={position}
            loop={loop}
          />
        ))}

        <LinearGradient
          colors={GRADIENT_COLORS}
          locations={GRADIENT_LOCATIONS}
          style={StyleSheet.absoluteFill}
        />
      </>
    )
  }
)

interface BackdropLayerProps {
  imageURL: string | null | undefined
  index: number
  count: number
  position: SharedValue<number>
  loop: boolean
}

const BackdropLayer: React.FC<BackdropLayerProps> = memo(
  ({ imageURL, index, count, position, loop }) => {
    const uri = useMemo(
      () =>
        imageURL
          ? createGeminiUrl({
              imageURL,
              width: BACKDROP_IMAGE_WIDTH,
              height: BACKDROP_IMAGE_HEIGHT,
              resizeMode: "fill",
            })
          : null,
      [imageURL]
    )

    const animatedStyle = useAnimatedStyle(() => {
      const distance = distanceFromPosition(position.value, index, count, loop)

      return { opacity: Math.max(0, 1 - distance) }
    })

    if (!uri) {
      return null
    }

    return (
      <Animated.Image
        testID="city-guides-backdrop-image"
        source={{ uri }}
        blurRadius={BACKDROP_BLUR_RADIUS}
        resizeMode="cover"
        style={[styles.layer, animatedStyle]}
      />
    )
  }
)

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    transform: [{ scale: BACKDROP_SCALE }],
  },
})

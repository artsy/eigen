import { BackButton, Flex, Spinner, Text, useSpace } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { captureException, withScope } from "@sentry/react-native"
import { LensScanLine } from "app/Scenes/Lens/Components/LensScanLine"
import { LENS_VIEWFINDER_ASPECT_RATIO } from "app/Scenes/Lens/constants"
import { LensNavigationStack } from "app/Scenes/Lens/types"
import { cropToViewfinder } from "app/Scenes/Lens/utils/cropToViewfinder"
import { dismissModal } from "app/system/navigation/navigate"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"
import { useEffect, useState } from "react"
import { Image, useWindowDimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = StackScreenProps<LensNavigationStack, "LensAnalyzing">

const CARD_HORIZONTAL_MARGIN = 32
// A max-height fraction rather than a fixed pixel reserve for the header/text around the card --
// robust to different device sizes and dynamic type, at the cost of not being pixel-exact.
const CARD_MAX_HEIGHT_FRACTION = 0.62

/**
 * Crops the captured/selected photo to *exactly* the area the corner brackets marked on the
 * previous screen (see `utils/cropToViewfinder.ts`/`computePhotoCropRect` for the geometry), then
 * uploads the *cropped* file to S3, then hands the resulting `s3Bucket`/`s3Key` to `LensResults`
 * to run the real `artworksByImageConnection` search.
 *
 * What's displayed is the *cropped* file, not the original photo with a bracket overlay drawn on
 * top of it. An overlay marking an inset ~78% sub-region always leaves original-image content
 * visible outside the brackets, however accurate the underlying crop math is. So cropping happens
 * up front, before this screen renders anything but a spinner, and the resulting URI is reused for
 * the upload rather than cropping twice.
 *
 * The crop's reference container differs by capture method: a camera-captured photo was framed
 * against brackets drawn over the measured preview viewport on `LensCamera`, passed along as
 * `photo.captureContainerWidth`/`Height` (see `LensPhoto`), so that's the container the crop must
 * invert against. A library-picked photo was never shown with brackets at full screen -- the only
 * bracket-bearing view of it was this screen's own preview card -- so the card's own dimensions are
 * the right container for that case. Passing the wrong container for either reproduces the
 * crop-doesn't-match-brackets bug.
 *
 * The preview card matches `LENS_VIEWFINDER_ASPECT_RATIO` (the same fixed 5:6-ish ratio the
 * brackets and the crop use) rather than the screen's own ratio -- an earlier version mirrored the
 * live screen ratio here (and in the crop/brackets), which looked bad in practice: most phone
 * screens are ~9:19.5, an impractically tall, thin viewfinder shape.
 */
export const LensAnalyzing: React.FC<Props> = ({ route, navigation }) => {
  const { photo } = route.params
  const insets = useSafeAreaInsets()
  const space = useSpace()
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const [croppedUri, setCroppedUri] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  const maxCardWidth = windowWidth - CARD_HORIZONTAL_MARGIN * 2
  const maxCardHeight = windowHeight * CARD_MAX_HEIGHT_FRACTION
  let cardWidth = maxCardWidth
  let cardHeight = cardWidth / LENS_VIEWFINDER_ASPECT_RATIO
  if (cardHeight > maxCardHeight) {
    cardHeight = maxCardHeight
    cardWidth = cardHeight * LENS_VIEWFINDER_ASPECT_RATIO
  }

  // See the docstring above for why these differ by capture method, and `LensPhoto` for why a
  // camera capture must use the measured preview size rather than the window's. The window
  // fallback is defensive, for a photo that somehow arrives without the measurement.
  const cropContainerWidth = photo.fromLibrary ? cardWidth : photo.captureContainerWidth ?? windowWidth
  const cropContainerHeight = photo.fromLibrary ? cardHeight : photo.captureContainerHeight ?? windowHeight

  useEffect(() => {
    let cancelled = false

    cropToViewfinder(photo.uri, cropContainerWidth, cropContainerHeight)
      .then((cropped) => {
        if (cancelled) {
          return Promise.reject(new Error("cancelled"))
        }

        setCroppedUri(cropped)
        return uploadImageToS3(cropped)
      })
      .then(({ bucket, key }) => {
        if (cancelled) {
          return
        }

        navigation.replace("LensResults", { s3Bucket: bucket, s3Key: key, photo })
      })
      .catch((error) => {
        if (cancelled) {
          return
        }

        withScope((scope) => {
          scope.setTag("artsyLens", "cropOrUploadImage")
          captureException(error)
        })
        setHasError(true)
      })

    return () => {
      cancelled = true
    }
  }, [navigation, photo, cropContainerWidth, cropContainerHeight])

  return (
    <Flex flex={1} bg="mono100" justifyContent="center" alignItems="center">
      <Flex mt={`${insets.top}px`} height={44} flexDirection="row" alignItems="center" px={2} position="absolute" top={0} left={0} right={0}>
        <BackButton
          color="mono0"
          showX
          onPress={() => dismissModal()}
          hitSlop={{ top: space(2), left: space(2), right: space(2), bottom: space(2) }}
        />
      </Flex>

      {hasError ? (
        <Text variant="sm-display" color="mono0" mx={4} textAlign="center">
          Something went wrong finding matches for that photo. Please close and try again.
        </Text>
      ) : (
        <>
          <Flex
            width={cardWidth}
            height={cardHeight}
            borderRadius={16}
            overflow="hidden"
            bg="mono10"
            justifyContent="center"
            alignItems="center"
          >
            {!!croppedUri && (
              <>
                <Image
                  testID="lensAnalyzingCroppedImage"
                  source={{ uri: croppedUri }}
                  resizeMode="cover"
                  style={{ width: cardWidth, height: cardHeight, position: "absolute" }}
                />
                {/* LensScanLine starts its sweep on mount, so it mounts only once there's an
                    image to sweep over. Mounting it from the first frame instead sweeps across the
                    empty placeholder, then jumps mid-sweep when the cropped image appears. */}
                <LensScanLine height={cardHeight} />
              </>
            )}
            {!croppedUri && <Spinner color="mono0" />}
          </Flex>

          <Text variant="sm-display" color="mono0" mt={4}>
            Searching for matches...
          </Text>
        </>
      )}
    </Flex>
  )
}

import { Flex, Spinner, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { captureException, withScope } from "@sentry/react-native"
import { SearchByPhotoButton } from "app/Components/SearchByPhotoButton/SearchByPhotoButton"
import { LensHeader } from "app/Scenes/Lens/Components/LensHeader"
import { LensScanLine } from "app/Scenes/Lens/Components/LensScanLine"
import { LENS_VIEWFINDER_ASPECT_RATIO } from "app/Scenes/Lens/constants"
import { LensNavigationStack } from "app/Scenes/Lens/types"
import { CroppedPhoto, cropToViewfinder } from "app/Scenes/Lens/utils/cropToViewfinder"
import { PhotoPresentation } from "app/Scenes/Lens/utils/viewfinderGeometry"
import { dismissModal } from "app/system/navigation/navigate"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"
import { useEffect, useState } from "react"
import { Image, useWindowDimensions } from "react-native"

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
 * The crop is NOT always `LENS_VIEWFINDER_ASPECT_RATIO`: a capture framed with the phone held
 * sideways comes back transposed (see `PhotoPresentation`). So the card is shaped from the crop's
 * own dimensions once it resolves, rather than being pinned to the viewfinder ratio -- pinning it
 * would either hide part of the region being searched or surround it with letterbox bars, and this
 * screen's whole job is to show exactly what's searched. The cost is that the card changes shape
 * once, when the crop lands; the spinner beforehand sits in a viewfinder-shaped box.
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
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const [cropped, setCropped] = useState<CroppedPhoto | null>(null)
  const [hasError, setHasError] = useState(false)

  const maxCardWidth = windowWidth - CARD_HORIZONTAL_MARGIN * 2
  const maxCardHeight = windowHeight * CARD_MAX_HEIGHT_FRACTION

  /**
   * The largest box of the given aspect ratio that fits the space reserved for the card.
   */
  const fitCard = (aspectRatio: number) => {
    let width = maxCardWidth
    let height = width / aspectRatio

    if (height > maxCardHeight) {
      height = maxCardHeight
      width = height * aspectRatio
    }

    return { width, height }
  }

  // Deliberately two separate sizes.
  //
  // `viewfinderCard` is the fixed LENS_VIEWFINDER_ASPECT_RATIO box, and it is what a library pick
  // is cropped against (below). It must NOT depend on the crop's own dimensions, or the crop
  // container would depend on the crop result -- a circular dependency that would also re-trigger
  // the effect on every resolve.
  //
  // `displayCard` is purely presentational: once the crop lands, the card takes the crop's actual
  // shape, so a capture framed with the phone held sideways gets a landscape card instead of a
  // portrait one with letterbox bars. Before it lands there's nothing to shape against, so the
  // spinner sits in the viewfinder-shaped box.
  const viewfinderCard = fitCard(LENS_VIEWFINDER_ASPECT_RATIO)
  const displayCard =
    cropped && cropped.width > 0 && cropped.height > 0
      ? fitCard(cropped.width / cropped.height)
      : viewfinderCard

  // See the docstring above for why these differ by capture method, and `LensPhoto` for why a
  // camera capture must use the measured preview size rather than the window's. The window
  // fallback is defensive, for a photo that somehow arrives without the measurement.
  const cropContainerWidth = photo.fromLibrary
    ? viewfinderCard.width
    : photo.captureContainerWidth ?? windowWidth
  const cropContainerHeight = photo.fromLibrary
    ? viewfinderCard.height
    : photo.captureContainerHeight ?? windowHeight

  // A camera capture was framed against the live preview, which aligns the sensor feed to the
  // orientation-locked UI -- so holding the phone sideways rotates the world within the preview,
  // and the crop has to invert that rotation. A library pick was only ever presented through
  // `<Image resizeMode="cover">`, which never rotates. See `PhotoPresentation`.
  const cropPresentation: PhotoPresentation = photo.fromLibrary
    ? "cover"
    : "coverRotatedToContainer"

  useEffect(() => {
    let cancelled = false

    cropToViewfinder(photo.uri, cropContainerWidth, cropContainerHeight, cropPresentation)
      .then((cropped) => {
        if (cancelled) {
          return Promise.reject(new Error("cancelled"))
        }

        setCropped(cropped)
        return uploadImageToS3(cropped.uri)
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
  }, [navigation, photo, cropContainerWidth, cropContainerHeight, cropPresentation])

  return (
    <Flex flex={1} bg="mono100" justifyContent="center" alignItems="center">
      <Flex position="absolute" top={0} left={0} right={0}>
        {/* No title: the caption below the card is the only label this screen needs. */}
        <LensHeader onClose={() => dismissModal()} />
      </Flex>

      {hasError ? (
        // Failing here used to be a dead end -- the copy asked the user to close the modal, which
        // meant re-entering Lens through the search overlay just to retry. The button reruns the
        // flow in place instead, so the copy no longer mentions closing.
        <Flex mx={4} alignSelf="stretch" alignItems="center">
          <Text variant="sm-display" color="mono0" textAlign="center">
            Something went wrong finding matches for that photo. Please try again.
          </Text>

          <Flex alignSelf="stretch" mt={4}>
            <SearchByPhotoButton
              testID="lensAnalyzingSearchByPhotoButton"
              variant="light"
              // LensCamera is this stack's root and is still mounted below, so this pops back to
              // it rather than stacking a second camera.
              onPress={() => navigation.navigate("LensCamera")}
            />
          </Flex>
        </Flex>
      ) : (
        <>
          <Flex
            width={displayCard.width}
            height={displayCard.height}
            borderRadius={16}
            overflow="hidden"
            bg="mono10"
            justifyContent="center"
            alignItems="center"
          >
            {!!cropped && (
              <>
                <Image
                  testID="lensAnalyzingCroppedImage"
                  source={{ uri: cropped.uri }}
                  // The card is shaped to the crop, so this is a no-op in the normal case. Kept
                  // as "contain" rather than "cover" as a guard: if the dimensions are ever
                  // missing or wrong, letterboxing is ugly, whereas "cover" would silently hide
                  // part of the region actually being searched.
                  resizeMode="contain"
                  style={{
                    width: displayCard.width,
                    height: displayCard.height,
                    position: "absolute",
                  }}
                />
                {/* LensScanLine starts its sweep on mount, so it mounts only once there's an
                    image to sweep over. Mounting it from the first frame instead sweeps across the
                    empty placeholder, then jumps mid-sweep when the cropped image appears. */}
                <LensScanLine height={displayCard.height} />
              </>
            )}
            {!cropped && <Spinner color="mono0" />}
          </Flex>

          <Text variant="sm-display" color="mono0" mt={4}>
            Searching for matches...
          </Text>
        </>
      )}
    </Flex>
  )
}

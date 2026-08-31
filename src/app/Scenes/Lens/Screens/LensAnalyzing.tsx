import { Flex, Spinner, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { captureException, withScope } from "@sentry/react-native"
import { SearchByPhotoButton } from "app/Components/SearchByPhotoButton/SearchByPhotoButton"
import { LensHeader } from "app/Scenes/Lens/Components/LensHeader"
import { LensScanLine } from "app/Scenes/Lens/Components/LensScanLine"
import { LENS_VIEWFINDER_ASPECT_RATIO } from "app/Scenes/Lens/constants"
import { LensNavigationStack } from "app/Scenes/Lens/types"
import { CroppedPhoto, cropToViewfinder } from "app/Scenes/Lens/utils/cropToViewfinder"
import { discardTempPhotos } from "app/Scenes/Lens/utils/discardTempPhotos"
import { PhotoPresentation } from "app/Scenes/Lens/utils/viewfinderGeometry"
import { dismissModal } from "app/system/navigation/navigate"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"
import { useEffect, useRef, useState } from "react"
import { Image, useWindowDimensions } from "react-native"

type Props = StackScreenProps<LensNavigationStack, "LensAnalyzing">

const CARD_HORIZONTAL_MARGIN = 32
const CARD_MAX_HEIGHT_FRACTION = 0.62

/**
 * Crops the photo to the area the brackets marked, uploads the *cropped* file, then hands the
 * resulting `s3Bucket`/`s3Key` to `LensResults`.
 *
 * It displays the cropped file rather than the original with a bracket overlay: an overlay marking
 * an inset sub-region always leaves image content visible outside the brackets, however accurate
 * the crop math. So the crop runs up front and its URI is reused for the upload.
 *
 * The crop's reference container differs by capture method, and passing the wrong one reproduces
 * the crop-doesn't-match-brackets bug. A camera capture was framed against `LensCamera`'s measured
 * viewport (`photo.captureContainerWidth`/`Height`); a library pick was only ever shown inside this
 * screen's preview card, so that card's dimensions are its container.
 */
export const LensAnalyzing: React.FC<Props> = ({ route, navigation }) => {
  const { photo } = route.params
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const [cropped, setCropped] = useState<CroppedPhoto | null>(null)
  const [hasError, setHasError] = useState(false)

  // Temp files to sweep on the way out (see the effect below). A ref, not state: adding them to
  // the crop effect's deps would re-run the crop and upload. A library pick's file is deliberately
  // left out -- see `discardTempPhotos` on why deleting one can cost the user their actual photo.
  const tempPhotoUris = useRef<string[]>(photo.fromLibrary ? [] : [photo.uri])

  const maxCardWidth = windowWidth - CARD_HORIZONTAL_MARGIN * 2
  const maxCardHeight = windowHeight * CARD_MAX_HEIGHT_FRACTION

  /** The largest box of the given aspect ratio that fits the space reserved for the card. */
  const fitCard = (aspectRatio: number) => {
    let width = maxCardWidth
    let height = width / aspectRatio

    if (height > maxCardHeight) {
      height = maxCardHeight
      width = height * aspectRatio
    }

    return { width, height }
  }

  // Two separate sizes on purpose. `viewfinderCard` is what a library pick is cropped against, so
  // it must NOT depend on the crop's dimensions -- that would make the crop container depend on
  // the crop result and re-trigger the effect on every resolve. `displayCard` is presentational:
  // once the crop lands the card takes its actual shape, so a sideways capture gets a landscape
  // card instead of letterbox bars.
  const viewfinderCard = fitCard(LENS_VIEWFINDER_ASPECT_RATIO)
  const displayCard =
    cropped && cropped.width > 0 && cropped.height > 0
      ? fitCard(cropped.width / cropped.height)
      : viewfinderCard

  // The window fallback is defensive, for a photo that arrives without the measurement.
  const cropContainerWidth = photo.fromLibrary
    ? viewfinderCard.width
    : photo.captureContainerWidth ?? windowWidth
  const cropContainerHeight = photo.fromLibrary
    ? viewfinderCard.height
    : photo.captureContainerHeight ?? windowHeight

  // A camera capture was framed against a preview that aligns the sensor feed to the
  // orientation-locked UI, so the crop has to invert that rotation. `<Image resizeMode="cover">`
  // never rotates, so a library pick must not be. See `PhotoPresentation`.
  const cropPresentation: PhotoPresentation = photo.fromLibrary
    ? "cover"
    : "coverRotatedToContainer"

  useEffect(() => {
    let cancelled = false

    cropToViewfinder(photo.uri, cropContainerWidth, cropContainerHeight, cropPresentation)
      .then((cropped) => {
        // Before the cancellation check, not after: the file is on disk either way, and an
        // abandoned attempt is precisely what nothing else would clean up.
        tempPhotoUris.current.push(cropped.uri)

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

        navigation.replace("LensResults", { s3Bucket: bucket, s3Key: key })
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

  /**
   * Sweeps the temp files on unmount, which every exit from this screen passes through. Deleting
   * inline after the upload would instead race the cropped image still on screen through the
   * transition, and sharing the effect above would sweep on every deps change -- deleting the file
   * that run is about to upload.
   */
  useEffect(() => {
    return () => {
      // The lint rule wants this copied into a variable at setup time, which is the one thing
      // that would break it: the crop is appended after setup, so copying leaks every crop.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      discardTempPhotos(tempPhotoUris.current)
    }
  }, [])

  return (
    <Flex flex={1} bg="mono100" justifyContent="center" alignItems="center">
      <Flex position="absolute" top={0} left={0} right={0}>
        <LensHeader onClose={() => dismissModal()} />
      </Flex>

      {hasError ? (
        <Flex mx={4} alignSelf="stretch" alignItems="center">
          <Text variant="sm-display" color="mono0" textAlign="center">
            Something went wrong finding matches for that photo. Please try again.
          </Text>

          <Flex alignSelf="stretch" mt={4}>
            <SearchByPhotoButton
              testID="lensAnalyzingSearchByPhotoButton"
              variant="light"
              // `navigate`, not `push`: LensCamera is this stack's root and still mounted below.
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
                  // A no-op while the card is shaped to the crop. "contain" as a guard: if the
                  // dimensions are ever wrong, "cover" would silently hide part of the region
                  // being searched, where this only letterboxes.
                  resizeMode="contain"
                  style={{
                    width: displayCard.width,
                    height: displayCard.height,
                    position: "absolute",
                  }}
                />
                {/* Mounts only once there's an image to sweep over -- it starts its sweep on
                    mount, so mounting earlier jumps mid-sweep when the crop appears. */}
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

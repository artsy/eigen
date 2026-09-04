import { Flex, Spinner, Text, Theme } from "@artsy/palette-mobile"
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
import { goBack } from "app/system/navigation/navigate"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"
import { useEffect, useRef, useState } from "react"
import { Image, useWindowDimensions } from "react-native"

type Props = StackScreenProps<LensNavigationStack, "LensAnalyzing">

const CARD_HORIZONTAL_MARGIN = 32
const CARD_MAX_HEIGHT_FRACTION = 0.62

export const LensAnalyzing: React.FC<Props> = ({ route, navigation }) => {
  const { photo } = route.params
  const { width: windowWidth, height: windowHeight } = useWindowDimensions()
  const [cropped, setCropped] = useState<CroppedPhoto | null>(null)
  const [hasError, setHasError] = useState(false)

  // A ref avoids re-running the crop effect when a temporary file is added. Library photos must
  // not be deleted because their URI can point to the user's original file.
  const tempPhotoUris = useRef<string[]>(photo.fromLibrary ? [] : [photo.uri])

  const maxCardWidth = windowWidth - CARD_HORIZONTAL_MARGIN * 2
  const maxCardHeight = windowHeight * CARD_MAX_HEIGHT_FRACTION

  const fitCard = (aspectRatio: number) => {
    let width = maxCardWidth
    let height = width / aspectRatio

    if (height > maxCardHeight) {
      height = maxCardHeight
      width = height * aspectRatio
    }

    return { width, height }
  }

  // The crop container must not depend on the crop result, or the effect will re-run after cropping.
  const viewfinderCard = fitCard(LENS_VIEWFINDER_ASPECT_RATIO)
  const displayCard =
    cropped && cropped.width > 0 && cropped.height > 0
      ? fitCard(cropped.width / cropped.height)
      : viewfinderCard

  const cropContainerWidth = photo.fromLibrary
    ? viewfinderCard.width
    : photo.captureContainerWidth ?? windowWidth
  const cropContainerHeight = photo.fromLibrary
    ? viewfinderCard.height
    : photo.captureContainerHeight ?? windowHeight

  // Camera captures account for the preview rotation; library photos use regular cover geometry.
  const cropPresentation: PhotoPresentation = photo.fromLibrary
    ? "cover"
    : "coverRotatedToContainer"

  useEffect(() => {
    let cancelled = false

    cropToViewfinder(photo.uri, cropContainerWidth, cropContainerHeight, cropPresentation)
      .then((cropped) => {
        // Track the file before checking cancellation so an abandoned crop is still cleaned up.
        tempPhotoUris.current.push(cropped.uri)

        if (cancelled) {
          return Promise.reject(new Error("cancelled"))
        }

        setCropped(cropped)
        return uploadImageToS3(cropped.uri).then(({ bucket, key }) => ({ bucket, key, cropped }))
      })
      .then(({ bucket, key, cropped }) => {
        if (cancelled) {
          return
        }

        // LensResults owns the cropped file after navigation.
        tempPhotoUris.current = tempPhotoUris.current.filter((uri) => uri !== cropped.uri)
        navigation.replace("LensResults", { s3Bucket: bucket, s3Key: key, photoUri: cropped.uri })
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

  useEffect(() => {
    return () => {
      // Copying the ref during setup would miss files appended after the crop completes.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      discardTempPhotos(tempPhotoUris.current)
    }
  }, [])

  return (
    <Theme theme="v3light">
      <Flex flex={1} bg="mono100" justifyContent="center" alignItems="center">
        <Flex position="absolute" top={0} left={0} right={0}>
          <LensHeader onClose={() => goBack()} />
        </Flex>

        {hasError ? (
          <Flex mx={4} alignSelf="stretch" alignItems="center">
            <Text variant="sm-display" color="mono0" textAlign="center">
              Something went wrong finding matches for that photo. Please try again.
            </Text>

            <Flex alignSelf="stretch" mt={4}>
              <SearchByPhotoButton
                testID="lensAnalyzingSearchByPhotoButton"
                variant="fillLight"
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
              bg="mono100"
              justifyContent="center"
              alignItems="center"
            >
              {!!cropped && (
                <>
                  <Image
                    testID="lensAnalyzingCroppedImage"
                    source={{ uri: cropped.uri }}
                    resizeMode="contain"
                    style={{
                      width: displayCard.width,
                      height: displayCard.height,
                      position: "absolute",
                    }}
                  />
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
    </Theme>
  )
}

import {
  ActionType,
  OwnerType,
  SearchedReverseImageWithNoResults,
  SearchedReverseImageWithResults,
  TappedPickImageFromLibrary,
  TappedToggleCameraFlash,
} from "@artsy/cohesion"
import { useIsFocused } from "@react-navigation/native"
import { captureException, captureMessage, withScope } from "@sentry/react-native"
import { goBack, navigate } from "app/navigation/navigate"
import { requestPhotos } from "app/utils/requestPhotos"
import { useImageSearch } from "app/utils/useImageSearch"
import { useIsForeground } from "app/utils/useIsForeground"
import { compact } from "lodash"
import { Flex, Spinner, useColor } from "palette"
import { useEffect, useRef, useState } from "react"
import { Alert, Linking, StyleSheet } from "react-native"
import {
  Camera,
  CameraPermissionStatus,
  CameraRuntimeError,
  useCameraDevices,
} from "react-native-vision-camera"
import { useTracking } from "react-tracking"
import { FocusCoords, PhotoEntity, ReverseImageOwner } from "../../types"
import { CameraErrorState } from "./Components/CameraErrorState"
import { CameraGrantPermissions } from "./Components/CameraGrantPermissions"
import { CameraPreviewPhotoMode } from "./Components/CameraPreviewPhotoMode"
import { CameraTakePhotoMode } from "./Components/CameraTakePhotoMode"

const HIDE_FOCUS_TIMEOUT = 400

interface ReverseImageCameraScreenProps {
  owner: ReverseImageOwner
}

export const ReverseImageCameraScreen: React.FC<ReverseImageCameraScreenProps> = (props) => {
  const { owner } = props
  const tracking = useTracking()
  const color = useColor()
  const { handleSearchByImage } = useImageSearch()
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus | null>(null)
  const [enableFlash, setEnableFlash] = useState(false)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [focusCoords, setFocusCoords] = useState<FocusCoords | null>(null)
  const [hasError, setHasError] = useState(false)
  const [photo, setPhoto] = useState<PhotoEntity | null>(null)
  const camera = useRef<Camera>(null)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const unmounted = useRef(false)
  const devices = useCameraDevices()
  const device = devices.back

  const isFocused = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocused && isForeground

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission()

    if (permission === "denied") {
      await Linking.openSettings()
    }

    setCameraPermission(permission)
  }

  const takePhoto = async () => {
    try {
      if (camera.current == null) {
        throw new Error("Camera ref is null!")
      }

      const capturedPhoto = await camera.current.takePhoto({
        qualityPrioritization: "speed",
        flash: enableFlash ? "on" : "off",
        skipMetadata: true,
      })

      if (!capturedPhoto) {
        throw new Error("Something went wrong")
      }

      setPhoto({
        path: `file://${capturedPhoto.path}`,
        width: capturedPhoto.width,
        height: capturedPhoto.height,
      })
    } catch (error) {
      if (__DEV__) {
        console.error(error)
      } else {
        withScope((scope) => {
          scope.setTag("reverseImageSearch", "takePhoto")
          captureException(error)
        })
      }
    }
  }

  const toggleFlash = () => {
    tracking.trackEvent(tracks.tappedToggleCameraFlash(owner))
    setEnableFlash(!enableFlash)
  }

  const onInitialized = () => {
    setIsCameraInitialized(true)
  }

  const onCameraError = (error: CameraRuntimeError) => {
    setHasError(true)

    if (__DEV__) {
      console.error(error)
    } else {
      withScope((scope) => {
        scope.setTag("reverseImageSearch", "onCameraError")
        captureException(error)
      })
    }
  }

  const handleBackPress = () => {
    goBack()
  }

  const handleFocus = async (x: number, y: number) => {
    if (camera.current) {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }

      try {
        setFocusCoords({ x, y })
        await camera.current.focus({ x, y })
      } catch (error) {
        if ((error as Error).message.includes("Cancelled by another startFocusAndMetering")) {
          return
        }

        if (__DEV__) {
          console.error(error)
        } else {
          withScope((scope) => {
            scope.setTag("reverseImageSearch", "handleFocus")
            captureException(error)
          })
        }
      } finally {
        // TODO: Use react-native-reanimated 2 when it will be used
        timer.current = setTimeout(() => {
          setFocusCoords(null)
        }, HIDE_FOCUS_TIMEOUT)
      }
    }
  }

  const selectPhotosFromLibrary = async () => {
    try {
      tracking.trackEvent(tracks.tappedPickImageFromLibrary(owner))
      const images = await requestPhotos(false)

      /**
       * @platform iOS
       * Do nothing if the user has not selected photos
       */
      if (images.length === 0) {
        return
      }

      const image = images[0]

      setPhoto({
        path: image.path,
        width: image.width,
        height: image.height,
        fromLibrary: true,
      })
    } catch (error) {
      /**
       * @platform Android
       * Silently ignore error if the user decided not to select photos
       */
      if ((error as Error).message === "User cancelled image selection") {
        return
      }

      if (__DEV__) {
        console.error(error)
      } else {
        withScope((scope) => {
          scope.setTag("reverseImageSearch", "selectPhotosFromLibrary")
          captureException(error)
        })
      }
    }
  }

  const runSearchByPhoto = async () => {
    try {
      if (!photo) {
        return
      }

      const results = await handleSearchByImage(photo)

      // ignore results if component was unmounted
      if (unmounted.current) {
        return
      }

      if (results.length === 0) {
        tracking.trackEvent(tracks.withNoResults(owner))
        return navigate("/reverse-image/not-found", {
          passProps: {
            owner,
            photoPath: photo.path,
          },
        })
      }

      const artworkIDs = compact(results.map((result) => result?.artwork?.internalID))
      tracking.trackEvent(tracks.withResults(owner, artworkIDs))

      if (results.length === 1) {
        await navigate(`/artwork/${artworkIDs[0]}`)
        return
      }

      return navigate("/reverse-image/multiple-results", {
        passProps: {
          photoPath: photo.path,
          artworkIDs,
          owner,
        },
      })
    } catch (error) {
      // silently ignore error if component was unmounted
      if (unmounted.current) {
        return
      }

      if (__DEV__) {
        console.error(error)
      } else {
        captureMessage((error as Error).stack!)
      }

      Alert.alert(
        "Something went wrong.",
        "Sorry, we couldn't process the request. Please try again or contact support@artsy.net for help.",
        [
          {
            text: "Retry",
          },
        ]
      )
    }
  }

  useEffect(() => {
    const run = async () => {
      const status = await Camera.getCameraPermissionStatus()
      setCameraPermission(status)
    }

    run()
  }, [])

  useEffect(() => {
    return () => {
      unmounted.current = true
    }
  }, [])

  useEffect(() => {
    const execute = async () => {
      await runSearchByPhoto()
      setPhoto(null)
    }

    if (photo) {
      execute()
    }
  }, [photo])

  if (cameraPermission === null || !device) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center" bg="black100">
        <Spinner color="white100" />
      </Flex>
    )
  }

  if (cameraPermission !== "authorized") {
    return (
      <CameraGrantPermissions
        onBackPress={handleBackPress}
        onRequestCameraPermission={requestCameraPermission}
      />
    )
  }

  if (hasError) {
    return <CameraErrorState onBackPress={handleBackPress} />
  }

  return (
    <Flex flex={1}>
      <Camera
        ref={camera}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: color("black100"),
        }}
        device={device}
        photo
        video={false}
        audio={false}
        isActive={isActive}
        onInitialized={onInitialized}
        onError={onCameraError}
      />

      {!!photo ? (
        <CameraPreviewPhotoMode photo={photo} />
      ) : (
        <CameraTakePhotoMode
          isCameraInitialized={isCameraInitialized}
          takePhoto={takePhoto}
          toggleFlash={toggleFlash}
          selectPhotosFromLibrary={selectPhotosFromLibrary}
          deviceHasFlash={device.hasFlash}
          isFlashEnabled={enableFlash}
          coords={focusCoords}
          onFocusPress={handleFocus}
          focusEnabled={device.supportsFocus}
        />
      )}
    </Flex>
  )
}

const tracks = {
  tappedToggleCameraFlash: (owner: ReverseImageOwner): TappedToggleCameraFlash => ({
    action: ActionType.tappedToggleCameraFlash,
    context_screen_owner_type: OwnerType.reverseImageSearch,
    owner_type: owner.type,
    owner_id: owner.id,
    owner_slug: owner.slug,
  }),
  tappedPickImageFromLibrary: (owner: ReverseImageOwner): TappedPickImageFromLibrary => ({
    action: ActionType.tappedPickImageFromLibrary,
    context_screen_owner_type: OwnerType.reverseImageSearch,
    owner_type: owner.type,
    owner_id: owner.id,
    owner_slug: owner.slug,
  }),
  withNoResults: (owner: ReverseImageOwner): SearchedReverseImageWithNoResults => ({
    action: ActionType.searchedReverseImageWithNoResults,
    context_screen_owner_type: OwnerType.reverseImageSearch,
    owner_type: owner.type,
    owner_id: owner.id,
    owner_slug: owner.slug,
  }),
  withResults: (owner: ReverseImageOwner, results: string[]): SearchedReverseImageWithResults => ({
    action: ActionType.searchedReverseImageWithResults,
    context_screen_owner_type: OwnerType.reverseImageSearch,
    owner_type: owner.type,
    owner_id: owner.id,
    owner_slug: owner.slug,
    total_matches_count: results.length,
    artwork_ids: results.join(","),
  }),
}

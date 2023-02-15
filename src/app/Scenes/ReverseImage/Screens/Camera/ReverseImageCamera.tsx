import {
  ActionType,
  OwnerType,
  TappedPickImageFromLibrary,
  TappedToggleCameraFlash,
} from "@artsy/cohesion"
import { Flex, useColor } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { captureException, withScope } from "@sentry/react-native"
import { Background, BACKGROUND_COLOR } from "app/Scenes/ReverseImage/Components/Background"
import { CameraFramesContainer } from "app/Scenes/ReverseImage/Components/CameraFramesContainer"
import { HeaderBackButton } from "app/Scenes/ReverseImage/Components/HeaderBackButton"
import { HeaderContainer } from "app/Scenes/ReverseImage/Components/HeaderContainer"
import { HeaderTitle } from "app/Scenes/ReverseImage/Components/HeaderTitle"
import { useReverseImageContext } from "app/Scenes/ReverseImage/ReverseImageContext"
import {
  FocusCoords,
  ReverseImageNavigationStack,
  ReverseImageOwner,
} from "app/Scenes/ReverseImage/types"
import { goBack } from "app/system/navigation/navigate"
import { requestPhotos } from "app/utils/requestPhotos"
import { useIsForeground } from "app/utils/useIsForeground"
import { Spinner } from "palette"
import { useEffect, useRef, useState } from "react"
import { Linking, StyleSheet } from "react-native"
import {
  Camera,
  CameraPermissionStatus,
  CameraRuntimeError,
  useCameraDevices,
} from "react-native-vision-camera"
import { useTracking } from "react-tracking"
import { CameraButtons } from "./Components/CameraButtons"
import { CameraErrorState } from "./Components/CameraErrorState"
import { CameraGrantPermissions } from "./Components/CameraGrantPermissions"
import { FocusIndicator } from "./Components/FocusIndicator"

type Props = StackScreenProps<ReverseImageNavigationStack, "Camera">

const HIDE_FOCUS_TIMEOUT = 400

export const ReverseImageCameraScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const tracking = useTracking()
  const color = useColor()
  const { analytics, isRootScreenFocused } = useReverseImageContext()
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus | null>(null)
  const [enableFlash, setEnableFlash] = useState(false)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [focusCoords, setFocusCoords] = useState<FocusCoords | null>(null)
  const [hasError, setHasError] = useState(false)
  const camera = useRef<Camera>(null)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const devices = useCameraDevices()
  const device = devices.back
  const { owner } = analytics

  const isFocused = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocused && isForeground && isRootScreenFocused

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

      navigation.navigate("Preview", {
        photo: {
          path: `file://${capturedPhoto.path}`,
          width: capturedPhoto.width,
          height: capturedPhoto.height,
        },
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

      navigation.navigate("Preview", {
        photo: {
          path: image.path,
          width: image.width,
          height: image.height,
          fromLibrary: true,
        },
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

  useEffect(() => {
    const run = async () => {
      const status = await Camera.getCameraPermissionStatus()
      setCameraPermission(status)
    }

    run()
  }, [])

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

      <Flex {...StyleSheet.absoluteFillObject}>
        <Background>
          <HeaderContainer>
            <HeaderBackButton onPress={goBack} />
            <HeaderTitle title="Position Artwork in this Frame" />
          </HeaderContainer>
        </Background>

        <CameraFramesContainer onFocusPress={handleFocus} focusEnabled={device.supportsFocus} />

        <CameraButtons
          isCameraInitialized={isCameraInitialized}
          takePhoto={takePhoto}
          toggleFlash={toggleFlash}
          selectPhotosFromLibrary={selectPhotosFromLibrary}
          deviceHasFlash={device.hasFlash}
          isFlashEnabled={enableFlash}
          bg={BACKGROUND_COLOR}
        />

        {!!focusCoords && <FocusIndicator coords={focusCoords} />}
      </Flex>
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
}

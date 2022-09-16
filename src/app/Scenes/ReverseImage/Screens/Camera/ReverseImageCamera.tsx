import {
  ActionType,
  OwnerType,
  TappedPickImageFromLibrary,
  TappedToggleCameraFlash,
} from "@artsy/cohesion"
import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { goBack } from "app/navigation/navigate"
import { useDevToggle } from "app/store/GlobalStore"
import { requestPhotos } from "app/utils/requestPhotos"
import { useIsForeground } from "app/utils/useIsForeground"
import { BackButton, Box, Flex, Spinner, Text } from "palette"
import { useEffect, useRef, useState } from "react"
import { Alert, Linking, StyleSheet } from "react-native"
import {
  Camera,
  CameraPermissionStatus,
  CameraRuntimeError,
  useCameraDevices,
} from "react-native-vision-camera"
import { useTracking } from "react-tracking"
import { Background, BACKGROUND_COLOR } from "../../Components/Background"
import { CameraFramesContainer } from "../../Components/CameraFramesContainer"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { HeaderTitle } from "../../Components/HeaderTitle"
import { useReverseImageContext } from "../../ReverseImageContext"
import { FocusCoords, ReverseImageNavigationStack, ReverseImageOwner } from "../../types"
import { CAMERA_BUTTONS_HEIGHT, CameraButtons } from "./Components/CameraButtons"
import { CameraErrorState } from "./Components/CameraErrorState"
import { CameraGrantPermissions } from "./Components/CameraGrantPermissions"
import { FocusIndicator } from "./Components/FocusIndicator"

type Props = StackScreenProps<ReverseImageNavigationStack, "Camera">

const HIDE_FOCUS_TIMEOUT = 400

export const ReverseImageCameraScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const tracking = useTracking()
  const enableDebug = useDevToggle("DTShowDebugReverseImageView")
  const { analytics } = useReverseImageContext()
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

      navigation.navigate("Preview", {
        photo: {
          path: `file://${capturedPhoto.path}`,
          width: capturedPhoto.width,
          height: capturedPhoto.height,
        },
      })
    } catch (error) {
      console.log("[debug] takePhoto", error)

      console.error(error)

      if (enableDebug) {
        Alert.alert("Something went wrong", (error as Error)?.message)
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
    console.log("[debug] onCameraError", error)

    setHasError(true)

    if (enableDebug) {
      Alert.alert("Error", error.message)
    }

    if (__DEV__) {
      console.error(error)
    } else {
      captureMessage(error.message)
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

        console.error(error)
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
        captureMessage((error as Error).stack!)
      }

      if (enableDebug) {
        Alert.alert("Something went wrong", (error as Error)?.message)
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
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
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
        style={StyleSheet.absoluteFill}
        device={device}
        photo
        video={false}
        audio={false}
        isActive={enableDebug ? true : isActive}
        onInitialized={onInitialized}
        onError={onCameraError}
      />

      <Flex {...StyleSheet.absoluteFillObject}>
        <Background>
          <HeaderContainer>
            <BackButton color="white100" onPress={goBack} />
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

        {!!enableDebug && (
          <Box
            backgroundColor="rgba(255, 0, 0, 0.9)"
            position="absolute"
            bottom={CAMERA_BUTTONS_HEIGHT}
            left={0}
            right={0}
            p={1}
          >
            <Text color="white">isFocused: {isFocused ? "YES" : "NO"}</Text>
            <Text color="white">isForeground: {isForeground ? "YES" : "NO"}</Text>
            <Text color="white">isActive: {isActive ? "YES" : "NO"}</Text>
          </Box>
        )}
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

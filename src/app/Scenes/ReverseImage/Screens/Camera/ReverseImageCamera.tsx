import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { goBack } from "app/navigation/navigate"
import { useDevToggle } from "app/store/GlobalStore"
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
import { Background, BACKGROUND_COLOR } from "../../Components/Background"
import { CameraFramesContainer } from "../../Components/CameraFramesContainer"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { HeaderTitle } from "../../Components/HeaderTitle"
import { FocusCoords, ReverseImageNavigationStack } from "../../types"
import { CAMERA_BUTTONS_HEIGHT, CameraButtons } from "./Components/CameraButtons"
import { CameraErrorState } from "./Components/CameraErrorState"
import { CameraGrantPermissions } from "./Components/CameraGrantPermissions"
import { FocusIndicator } from "./Components/FocusIndicator"

type Props = StackScreenProps<ReverseImageNavigationStack, "Camera">

const HIDE_FOCUS_TIMEOUT = 400

export const ReverseImageCameraScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const enableDebug = useDevToggle("DTShowDebugReverseImageView")
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus | null>(null)
  const [enableFlash, setEnableFlash] = useState(false)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [focusCoords, setFocusCoords] = useState<FocusCoords | null>(null)
  const [hasError, setHasError] = useState(false)
  const camera = useRef<Camera>(null)
  const timer = useRef<NodeJS.Timeout | null>(null)
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

      navigation.navigate("Preview", {
        photo: {
          path: `file://${capturedPhoto.path}`,
          width: capturedPhoto.width,
          height: capturedPhoto.height,
        },
      })
    } catch (error) {
      console.error(error)

      if (enableDebug) {
        Alert.alert("Something went wrong", (error as Error)?.message)
      }
    }
  }

  const toggleFlash = () => {
    setEnableFlash(!enableFlash)
  }

  const onInitialized = () => {
    setIsCameraInitialized(true)
  }

  const onCameraError = (error: CameraRuntimeError) => {
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
        isActive={isActive}
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

import { useIsFocused } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { goBack } from "app/navigation/navigate"
import { useIsForeground } from "app/utils/useIfForeground"
import { BackButton, Button, Flex, Screen, Spinner, Text, useSpace } from "palette"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  GestureResponderEvent,
  Linking,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native"
import {
  Camera,
  CameraPermissionStatus,
  CameraRuntimeError,
  useCameraDevices,
} from "react-native-vision-camera"
import { Background, BACKGROUND_COLOR } from "../../Components/Background"
import { FocusIndicator } from "../../Components/FocusIndicator"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { HeaderTitle } from "../../Components/HeaderTitle"
import { FocusCoords, ReverseImageNavigationStack } from "../../types"
import { CameraButtons } from "./Components/CameraButtons"

type Props = StackScreenProps<ReverseImageNavigationStack, "Camera">

export const ReverseImageCameraScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus | null>(null)
  const [enableFlash, setEnableFlash] = useState(false)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [focusCoords, setFocusCoords] = useState<FocusCoords | null>(null)
  const [hasError, setHasError] = useState(false)
  const space = useSpace()
  const camera = useRef<Camera>(null)
  const devices = useCameraDevices()
  const device = devices.back

  const isFocussed = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocussed && isForeground

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

    if (__DEV__) {
      console.error(error)
    } else {
      captureMessage(error.message)
    }
  }

  const handleBackPress = () => {
    goBack()
  }

  const hideFocusIndicator = useCallback(() => {
    setFocusCoords(null)
  }, [])

  const handleFocus = async (event: GestureResponderEvent) => {
    if (camera.current) {
      try {
        const { pageX: x, pageY: y } = event.nativeEvent

        setFocusCoords({ x, y })
        await camera.current.focus({ x, y })
      } catch (error) {
        if ((error as Error).message.includes("Cancelled by another startFocusAndMetering")) {
          return
        }

        console.error(error)
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

  useEffect(() => {
    StatusBar.setBarStyle("light-content")

    return () => {
      // return the previous color for the status bar, as on all other screens
      StatusBar.setBarStyle("dark-content")
    }
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
      <Screen>
        <Screen.Header onBack={handleBackPress} />

        <Screen.Body>
          <Flex flex={1} justifyContent="center" alignItems="center">
            <Text>Camera permission required</Text>
            <Button mt={2} onPress={requestCameraPermission}>
              Grant
            </Button>
          </Flex>
        </Screen.Body>
      </Screen>
    )
  }

  if (hasError) {
    return (
      <Screen>
        <Screen.Header onBack={handleBackPress} />

        <Screen.Body>
          <Flex flex={1} justifyContent="center" alignItems="center">
            <Text>Failed to open the camera device</Text>
          </Flex>
        </Screen.Body>
      </Screen>
    )
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

        <Background height={space("2")} />

        <Flex flex={1} flexDirection="row">
          <Background width={space("2")} />
          <TouchableWithoutFeedback onPress={handleFocus} disabled={!device.supportsFocus}>
            <Flex flex={1} />
          </TouchableWithoutFeedback>
          <Background width={space("2")} />
        </Flex>

        <Background height={space("2")} />

        <CameraButtons
          isCameraInitialized={isCameraInitialized}
          takePhoto={takePhoto}
          toggleFlash={toggleFlash}
          deviceHasFlash={device.hasFlash}
          isFlashEnabled={enableFlash}
          bg={BACKGROUND_COLOR}
        />

        {!!focusCoords && <FocusIndicator coords={focusCoords} onHide={hideFocusIndicator} />}
      </Flex>
    </Flex>
  )
}

import {
  ActionType,
  OwnerType,
  TappedPickImageFromLibrary,
  TappedToggleCameraFlash,
} from "@artsy/cohesion"
import { useIsFocused } from "@react-navigation/core"
import { StackScreenProps } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { goBack } from "app/navigation/navigate"
import { useDevToggle } from "app/store/GlobalStore"
import { requestPhotos } from "app/utils/requestPhotos"
import { useIsForeground } from "app/utils/useIsForeground"
import { BackButton, Box, Flex, Text } from "palette"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Alert, StyleSheet } from "react-native"
import {
  Camera,
  CameraDeviceFormat,
  CameraRuntimeError,
  frameRateIncluded,
  sortFormats,
  TakePhotoOptions,
  TakeSnapshotOptions,
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
import { FocusIndicator } from "./Components/FocusIndicator"

type Props = StackScreenProps<ReverseImageNavigationStack, "Camera">

const HIDE_FOCUS_TIMEOUT = 400

export const ReverseImageCameraScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const tracking = useTracking()
  const enableDebug = useDevToggle("DTShowDebugReverseImageView")
  const { analytics } = useReverseImageContext()
  const [enableFlash, setEnableFlash] = useState(false)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false)
  const [focusCoords, setFocusCoords] = useState<FocusCoords | null>(null)
  const [enableHdr] = useState(false)
  const [enableNightMode] = useState(false)
  const camera = useRef<Camera>(null)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const devices = useCameraDevices()
  const device = devices.back
  const { owner } = analytics

  const isFocused = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocused && isForeground

  const formats = useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) {
      return []
    }

    return device.formats.sort(sortFormats)
  }, [device?.formats])

  //#region Memos
  const [is60Fps] = useState(true)
  const fps = useMemo(() => {
    if (!is60Fps) {
      return 30
    }

    if (enableNightMode && !device?.supportsLowLightBoost) {
      // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
      return 30
    }

    const supportsHdrAt60Fps = formats.some(
      (f) => f.supportsVideoHDR && f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
    )
    if (enableHdr && !supportsHdrAt60Fps) {
      // User has enabled HDR, but HDR is not supported at 60 FPS.
      return 30
    }

    const supports60Fps = formats.some((f) =>
      f.frameRateRanges.some((r) => frameRateIncluded(r, 60))
    )
    if (!supports60Fps) {
      // 60 FPS is not supported by any format.
      return 30
    }
    // If nothing blocks us from using it, we default to 60 FPS.
    return 60
  }, [device?.supportsLowLightBoost, enableHdr, enableNightMode, formats, is60Fps])

  const format = useMemo(() => {
    let result = formats
    if (enableHdr) {
      // We only filter by HDR capable formats if HDR is set to true.
      // Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
      result = result.filter((f) => f.supportsVideoHDR || f.supportsPhotoHDR)
    }

    // find the first format that includes the given FPS
    return result.find((f) => f.frameRateRanges.some((r) => frameRateIncluded(r, fps)))
  }, [formats, fps, enableHdr])

  const takePhoto = async () => {
    try {
      if (camera.current == null) {
        throw new Error("Camera ref is null!")
      }

      const capturedPhoto = await camera.current.takePhoto({
        photoCodec: "jpeg",
        qualityPrioritization: "speed",
        flash: enableFlash ? "on" : "off",
        quality: 90,
        skipMetadata: true,
      } as TakePhotoOptions & TakeSnapshotOptions)

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
    tracking.trackEvent(tracks.tappedToggleCameraFlash(owner))
    setEnableFlash(!enableFlash)
  }

  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true)
  }, [])

  const onError = useCallback((error: CameraRuntimeError) => {
    Alert.alert("onError", error.message)
  }, [])

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
    Camera.getMicrophonePermissionStatus().then((status) =>
      setHasMicrophonePermission(status === "authorized")
    )
  }, [])

  if (!device) {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center" bg="black100">
        <Text>Loading...</Text>
      </Flex>
    )
  }

  return (
    <Flex flex={1}>
      <>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          format={format}
          fps={fps}
          hdr={enableHdr}
          lowLightBoost={device.supportsLowLightBoost && enableNightMode}
          isActive={isActive}
          onInitialized={onInitialized}
          onError={onError}
          enableZoomGesture={false}
          photo
          video
          audio={hasMicrophonePermission}
          orientation="portrait"
        />
      </>

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

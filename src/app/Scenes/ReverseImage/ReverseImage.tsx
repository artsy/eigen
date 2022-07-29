import { goBack } from "app/navigation/navigate"
import { BackButton, Button, Flex, Spinner, Text, useSpace } from "palette"
import { useEffect, useRef, useState } from "react"
import { Alert, LayoutChangeEvent, Linking, StyleSheet, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Camera, CameraPermissionStatus, useCameraDevices } from "react-native-vision-camera"
import styled from "styled-components/native"

interface FrameCoords {
  width: number
  height: number
  x: number
  y: number
}

export const ReverseImage = () => {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus | null>(null)
  const [enableFlash, setEnableFlash] = useState(false)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [frameCoords, setFrameCoords] = useState<FrameCoords | null>(null)
  const insets = useSafeAreaInsets()
  const space = useSpace()
  const camera = useRef<Camera>(null)
  const devices = useCameraDevices()
  const device = devices.back

  console.log("[debug] cameraPermission", cameraPermission)
  console.log("[debug] devices", devices)
  console.log("[debug] device", device)
  console.log("[debug] frameCoords", frameCoords)

  const requestMicrophonePermission = async () => {
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

      setIsSearching(true)
      const photo = await camera.current.takePhoto({
        qualityPrioritization: "speed",
        flash: enableFlash ? "on" : "off",
        skipMetadata: true,
      })

      if (!photo) {
        throw new Error("Something went wrong")
      }

      const data = {
        path: photo.path,
        width: photo.width,
        height: photo.height,
      }

      Alert.alert("Photo", JSON.stringify(data, null, 2))
    } catch (error) {
      console.error(error)
    } finally {
      setIsSearching(false)
    }
  }

  const toggleFlash = () => {
    setEnableFlash(!enableFlash)
  }

  const onInitialized = () => {
    setIsCameraInitialized(true)
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    // @ts-ignore
    event.target.measure(
      (_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
        setFrameCoords({
          width,
          height,
          x: pageX,
          y: pageY,
        })
      }
    )
  }

  useEffect(() => {
    const run = async () => {
      const status = await Camera.getCameraPermissionStatus()
      setCameraPermission(status)
    }

    run()
  }, [])

  if (cameraPermission === null) {
    return (
      <Flex flex={1} bg="red">
        <Spinner />
      </Flex>
    )
  }

  if (!device) {
    return (
      <Flex flex={1} bg="green">
        <Spinner />
      </Flex>
    )
  }

  if (cameraPermission !== "authorized") {
    return (
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>Camera permission required</Text>
        <Button mt={2} onPress={requestMicrophonePermission}>
          Grant
        </Button>
      </Flex>
    )
  }

  return (
    <Flex flex={1} bg="red">
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        photo
        video={false}
        audio={false}
        isActive
        onInitialized={onInitialized}
      />
      <Flex {...StyleSheet.absoluteFillObject}>
        <Background height={insets.top} />

        <Background height={44} flexDirection="row" px="2" alignItems="center">
          <BackButton color="white100" onPress={goBack} />
          <Flex {...StyleSheet.absoluteFillObject} justifyContent="center" alignItems="center">
            <Text variant="md" color="white100">
              {isSearching ? "Looking for Results..." : "Position Artwork in this Frame"}
            </Text>
          </Flex>
        </Background>

        <Background height={space("2")} />

        <Flex flex={1} flexDirection="row">
          <Background width={space("2")} />
          <Flex flex={1} onLayout={handleLayout} />
          <Background width={space("2")} />
        </Flex>

        <Background height={space("2")} />

        <Background py={3} justifyContent="center" alignItems="center">
          <TouchableOpacity onPress={takePhoto} disabled={!isCameraInitialized}>
            <Flex width={50} height={50} borderRadius={25} bg="white100" />
          </TouchableOpacity>

          {!!device.hasFlash && (
            <TouchableOpacity
              onPress={toggleFlash}
              style={{ position: "absolute", right: space("2") }}
            >
              <Flex
                width={30}
                height={30}
                borderRadius={15}
                bg={enableFlash ? "green100" : "white100"}
              />
            </TouchableOpacity>
          )}
        </Background>
      </Flex>

      {frameCoords !== null && (
        <Flex
          position="absolute"
          left={frameCoords.x}
          top={frameCoords.y}
          width={frameCoords.width}
          height={frameCoords.height}
          bg="red"
          opacity={0.2}
        />
      )}
    </Flex>
  )
}

const Background = styled(Flex)`
  background: rgba(0, 0, 0, 0.6);
`

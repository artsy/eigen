import { goBack, navigate } from "app/navigation/navigate"
import { useImageSearchV2 } from "app/utils/useImageSearchV2"
import { BackButton, Button, Flex, Screen, Spinner, Text, useSpace } from "palette"
import { useEffect, useRef, useState } from "react"
import { Alert, Linking, StyleSheet, TouchableOpacity } from "react-native"
import { Camera, CameraPermissionStatus, useCameraDevices } from "react-native-vision-camera"
import styled from "styled-components/native"
import { HeaderContainer } from "./Components/HeaderContainer"

export const ReverseImage = () => {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus | null>(null)
  const [enableFlash, setEnableFlash] = useState(false)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const space = useSpace()
  const camera = useRef<Camera>(null)
  const devices = useCameraDevices()
  const { searchingByImage, handleSeachByImage } = useImageSearchV2()
  const device = devices.back

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

      setIsLoading(true)
      const photo = await camera.current.takePhoto({
        qualityPrioritization: "speed",
        flash: enableFlash ? "on" : "off",
        skipMetadata: true,
      })

      if (!photo) {
        throw new Error("Something went wrong")
      }

      const data = {
        path: `file://${photo.path}`,
        width: photo.width,
        height: photo.height,
      }

      const results = await handleSeachByImage(data)

      if (results.length === 0) {
        Alert.alert(
          "Artwork Not Found",
          "We couldn’t find an artwork based on your photo. Please try again, or use the fair’s QR code."
        )

        return
      }

      if (results.length === 1) {
        Alert.alert("Artwork Found", "Navigate to artwork screen")

        return
      }

      const artworkIDs = results.map((result) => result?.artwork?.internalID)
      await navigate("/reverse-image-multiple-results", {
        passProps: {
          artworkIDs,
        },
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFlash = () => {
    setEnableFlash(!enableFlash)
  }

  const onInitialized = () => {
    setIsCameraInitialized(true)
  }

  const handleBackPress = () => {
    goBack()
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
      <Screen>
        <Screen.Header onBack={handleBackPress} />

        <Screen.Body>
          <Flex flex={1} justifyContent="center" alignItems="center">
            <Text>Camera permission required</Text>
            <Button mt={2} onPress={requestMicrophonePermission}>
              Grant
            </Button>
          </Flex>
        </Screen.Body>
      </Screen>
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
        isActive={!searchingByImage || !isLoading}
        onInitialized={onInitialized}
      />

      <Flex {...StyleSheet.absoluteFillObject}>
        <Background>
          <HeaderContainer>
            <BackButton color="white100" onPress={goBack} />
            <Flex {...StyleSheet.absoluteFillObject} justifyContent="center" alignItems="center">
              <Text variant="md" color="white100">
                {searchingByImage ? "Looking for Results..." : "Position Artwork in this Frame"}
              </Text>
            </Flex>
          </HeaderContainer>
        </Background>

        <Background height={space("2")} />

        <Flex flex={1} flexDirection="row">
          <Background width={space("2")} />
          <Flex flex={1} />
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
    </Flex>
  )
}

const Background = styled(Flex)`
  background: rgba(0, 0, 0, 0.6);
`

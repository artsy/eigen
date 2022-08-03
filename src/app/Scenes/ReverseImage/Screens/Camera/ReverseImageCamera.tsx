import { StackScreenProps } from "@react-navigation/stack"
import { goBack } from "app/navigation/navigate"
import { useImageSearchV2 } from "app/utils/useImageSearchV2"
import { compact } from "lodash"
import { BackButton, Button, Flex, Screen, Spinner, Text, useSpace } from "palette"
import { useEffect, useRef, useState } from "react"
import { Image, Linking, StyleSheet, TouchableOpacity } from "react-native"
import { Camera, CameraPermissionStatus, useCameraDevices } from "react-native-vision-camera"
import styled from "styled-components/native"
import { HeaderContainer } from "../../Components/HeaderContainer"
import { HeaderTitle } from "../../Components/HeaderTitle"
import { PhotoEntity, ReverseImageNavigationStack } from "../../types"

type Props = StackScreenProps<ReverseImageNavigationStack, "Camera">

export const ReverseImageCameraScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus | null>(null)
  const [enableFlash, setEnableFlash] = useState(false)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [photo, setPhoto] = useState<PhotoEntity | null>()
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

      const capturedPhoto = await camera.current.takePhoto({
        qualityPrioritization: "speed",
        flash: enableFlash ? "on" : "off",
        skipMetadata: true,
      })

      if (!capturedPhoto) {
        throw new Error("Something went wrong")
      }

      const data = {
        path: `file://${capturedPhoto.path}`,
        width: capturedPhoto.width,
        height: capturedPhoto.height,
      }
      setPhoto(data)

      const results = await handleSeachByImage(data)

      if (results.length === 0) {
        return navigation.navigate("ArtworkNotFound", {
          photoPath: data.path,
        })
      }

      if (results.length === 1) {
        return navigation.navigate("Artwork", {
          artworkId: results[0]!.artwork!.internalID,
        })
      }

      const artworkIDs = compact(results.map((result) => result?.artwork?.internalID))
      navigation.navigate("MultipleResults", {
        artworkIDs,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setPhoto(null)
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
    <Flex flex={1}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        photo
        video={false}
        audio={false}
        isActive={!photo}
        onInitialized={onInitialized}
      />

      {!!photo && (
        <Image source={{ uri: photo.path }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      )}

      <Flex {...StyleSheet.absoluteFillObject}>
        <Background>
          <HeaderContainer>
            <BackButton color="white100" onPress={goBack} />
            <HeaderTitle
              title={searchingByImage ? "Looking for Results..." : "Position Artwork in this Frame"}
            />
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

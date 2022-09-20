import { StackScreenProps } from "@react-navigation/stack"
import { Button, Flex, Text } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { Linking } from "react-native"
import { View } from "react-native"
import { Camera, CameraPermissionStatus } from "react-native-vision-camera"
import { ReverseImageNavigationStack } from "../../types"

type Props = StackScreenProps<ReverseImageNavigationStack, "PermissionsPage">

export const PermissionsPage: React.FC<Props> = ({ navigation }) => {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined")
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>("not-determined")

  const requestMicrophonePermission = useCallback(async () => {
    const permission = await Camera.requestMicrophonePermission()

    if (permission === "denied") {
      await Linking.openSettings()
    }

    setMicrophonePermissionStatus(permission)
  }, [])

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission()

    if (permission === "denied") {
      await Linking.openSettings()
    }

    setCameraPermissionStatus(permission)
  }, [])

  useEffect(() => {
    if (cameraPermissionStatus === "authorized" && microphonePermissionStatus === "authorized") {
      navigation.replace("Camera")
    }
  }, [cameraPermissionStatus, microphonePermissionStatus, navigation])

  return (
    <Flex flex={1} justifyContent="center" alignItems="center">
      <View>
        {cameraPermissionStatus !== "authorized" && (
          <Flex alignItems="center" my={1}>
            <Text>Vision Camera needs Camera permission</Text>
            <Button onPress={requestCameraPermission}>Grant</Button>
          </Flex>
        )}
        {microphonePermissionStatus !== "authorized" && (
          <Flex alignItems="center" my={1}>
            <Text>Vision Camera needs Microphone permission</Text>
            <Button onPress={requestMicrophonePermission}>Grant</Button>
          </Flex>
        )}
      </View>
    </Flex>
  )
}

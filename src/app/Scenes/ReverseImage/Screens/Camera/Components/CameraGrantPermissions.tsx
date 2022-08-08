import { Button, Flex, Screen, Text } from "palette"

interface CameraGrantPermissionsProps {
  onBackPress: () => void
  onRequestCameraPermission: () => void
}

export const CameraGrantPermissions: React.FC<CameraGrantPermissionsProps> = (props) => {
  const { onBackPress, onRequestCameraPermission } = props

  return (
    <Screen>
      <Screen.Header onBack={onBackPress} />

      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Text>Camera permission required</Text>
          <Button mt={2} onPress={onRequestCameraPermission}>
            Grant
          </Button>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

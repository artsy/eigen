import { HeaderContainer } from "app/Scenes/ReverseImage/Components/HeaderContainer"
import { BackButton, Button, Flex, Text } from "palette"

interface CameraGrantPermissionsProps {
  onBackPress: () => void
  onRequestCameraPermission: () => void
}

export const CameraGrantPermissions: React.FC<CameraGrantPermissionsProps> = (props) => {
  const { onBackPress, onRequestCameraPermission } = props

  return (
    <Flex flex={1} bg="black100">
      <HeaderContainer>
        <BackButton color="white100" onPress={onBackPress} />
      </HeaderContainer>

      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text color="white100">Camera permission required</Text>
        <Button mt={2} onPress={onRequestCameraPermission} variant="fillGray">
          Grant
        </Button>
      </Flex>
    </Flex>
  )
}

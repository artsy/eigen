import { Flex } from "@artsy/palette-mobile"
import { HeaderBackButton } from "app/Scenes/ReverseImage/Components/HeaderBackButton"
import { HeaderContainer } from "app/Scenes/ReverseImage/Components/HeaderContainer"
import { Button, Text } from "palette"

interface CameraGrantPermissionsProps {
  onBackPress: () => void
  onRequestCameraPermission: () => void
}

export const CameraGrantPermissions: React.FC<CameraGrantPermissionsProps> = (props) => {
  const { onBackPress, onRequestCameraPermission } = props

  return (
    <Flex flex={1} bg="black100">
      <HeaderContainer>
        <HeaderBackButton onPress={onBackPress} />
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

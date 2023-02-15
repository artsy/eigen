import { Flex } from "@artsy/palette-mobile"
import { Screen, Text } from "palette"

interface CameraErrorStateProps {
  onBackPress: () => void
}

export const CameraErrorState: React.FC<CameraErrorStateProps> = (props) => {
  const { onBackPress } = props

  return (
    <Screen>
      <Screen.Header onBack={onBackPress} />

      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Text>Failed to open the camera device</Text>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

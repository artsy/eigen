import { Flex, Text, LegacyScreen } from "@artsy/palette-mobile"

interface CameraErrorStateProps {
  onBackPress: () => void
}

export const CameraErrorState: React.FC<CameraErrorStateProps> = (props) => {
  const { onBackPress } = props

  return (
    <LegacyScreen>
      <LegacyScreen.Header onBack={onBackPress} />

      <LegacyScreen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Text>Failed to open the camera device</Text>
        </Flex>
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}

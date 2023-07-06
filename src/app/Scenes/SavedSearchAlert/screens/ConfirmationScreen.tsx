import { Box, Button, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">

export const ConfirmationScreen: React.FC<Props> = (props) => {
  const { route } = props
  const { closeModal } = route.params

  const handleLeftButtonPress = () => {
    closeModal?.()
  }

  return (
    <Box>
      <FancyModalHeader hideBottomDivider useXButton onLeftButtonPress={handleLeftButtonPress} />
      <Box px={2}>
        <Text variant="lg">Confirmation Screen TKTK</Text>
        <Spacer y={2} />
        <Button onPress={closeModal}>Dismiss</Button>
      </Box>
    </Box>
  )
}

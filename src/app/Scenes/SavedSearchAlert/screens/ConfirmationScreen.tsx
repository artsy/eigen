import { Box, Spacer, Text } from "@artsy/palette-mobile"
import { RouteProp, useRoute } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ConfirmationScreenCriteria } from "app/Scenes/SavedSearchAlert/Components/ConfirmationScreenCriteria"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">

export const ConfirmationScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const route = useRoute<RouteProp<CreateSavedSearchAlertNavigationStack, "ConfirmationScreen">>()
  const { searchCriteriaID } = route.params
  const handleLeftButtonPress = () => {
    navigation.pop()
  }

  return (
    <Box flex={1}>
      <FancyModalHeader hideBottomDivider useXButton onLeftButtonPress={handleLeftButtonPress} />
      <Box px={2}>
        <Text variant="lg">Your alert has been saved</Text>
        <Spacer y={1} />
        <Text variant="sm" color="black60">
          We’ll let you know when matching works are added to Artsy.
        </Text>
        <Spacer y={2} />
        <ConfirmationScreenCriteria searchCriteriaID={searchCriteriaID} />
      </Box>
    </Box>
  )
}

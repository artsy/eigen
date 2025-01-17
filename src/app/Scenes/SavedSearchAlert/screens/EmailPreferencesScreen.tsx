import { Box } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtsyWebView } from "app/Components/ArtsyWebView"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "EmailPreferences">

export const EmailPreferencesScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const handleLeftButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Box flex={1}>
      <NavigationHeader hideBottomDivider onLeftButtonPress={handleLeftButtonPress} />
      <ArtsyWebView url="/unsubscribe" />
    </Box>
  )
}

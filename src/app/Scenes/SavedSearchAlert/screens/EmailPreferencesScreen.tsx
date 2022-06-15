import { StackScreenProps } from "@react-navigation/stack"
import { ArtsyWebView } from "app/Components/ArtsyWebView"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { Box } from "palette"
import React from "react"
import { CreateSavedSearchAlertNavigationStack } from "../SavedSearchAlertModel"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "EmailPreferences">

export const EmailPreferencesScreen: React.FC<Props> = (props) => {
  const { navigation } = props
  const handleLeftButtonPress = () => {
    navigation.goBack()
  }

  return (
    <Box flex={1}>
      <FancyModalHeader hideBottomDivider onLeftButtonPress={handleLeftButtonPress} />
      <ArtsyWebView url="/unsubscribe" />
    </Box>
  )
}

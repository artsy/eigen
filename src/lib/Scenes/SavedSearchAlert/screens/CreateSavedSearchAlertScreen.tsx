import { StackScreenProps } from "@react-navigation/stack"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import useAppState from "lib/utils/useAppState"
import { Box } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { SavedSearchAlertForm } from "../SavedSearchAlertForm"
import { CreateSavedSearchAlertNavigationStack } from "../SavedSearchAlertModel"
import { SavedSearchAlertMutationResult } from "../SavedSearchAlertModel"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">

export const CreateSavedSearchAlertScreen: React.FC<Props> = (props) => {
  const { navigation, route } = props
  const { filters, aggregations, onComplete, onClosePress, ...other } = route.params
  const [enablePushNotifications, setEnablePushNotifications] = useState(true)

  const getPermissionStatus = async () => {
    const status = await getNotificationPermissionsStatus()
    setEnablePushNotifications(status === PushAuthorizationStatus.Authorized)
  }

  const onForeground = useCallback(() => {
    getPermissionStatus()
  }, [])

  const handleComplete = async (result: SavedSearchAlertMutationResult) => {
    onComplete(result)
  }

  const handleUpdateEmailPreferencesPress = () => {
    navigation.navigate("EmailPreferences")
  }

  useAppState({ onForeground })

  useEffect(() => {
    getPermissionStatus()
  }, [])

  return (
    <Box flex={1}>
      <FancyModalHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
      <SavedSearchAlertForm
        initialValues={{ name: "", email: route.params.userAllowsEmails, push: enablePushNotifications }}
        aggregations={aggregations}
        filters={filters}
        onComplete={handleComplete}
        contentContainerStyle={{ paddingTop: 0 }}
        onUpdateEmailPreferencesPress={handleUpdateEmailPreferencesPress}
        {...other}
      />
    </Box>
  )
}

import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import useAppState from "lib/utils/useAppState"
import { Box } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { SavedSearchAlertForm } from "../SavedSearchAlertForm"
import { CreateSavedSearchAlertParams } from "../SavedSearchAlertModel"

export type CreateSavedSearchContentProps = Omit<CreateSavedSearchAlertParams, "me" | "onClosePress"> & {
  userAllowsEmails: boolean
  onUpdateEmailPreferencesPress: () => void
}

export const CreateSavedSearchContent: React.FC<CreateSavedSearchContentProps> = (props) => {
  const [enablePushNotifications, setEnablePushNotifications] = useState(true)

  const getPermissionStatus = async () => {
    const status = await getNotificationPermissionsStatus()
    setEnablePushNotifications(status === PushAuthorizationStatus.Authorized)
  }

  const onForeground = useCallback(() => {
    getPermissionStatus()
  }, [])

  useAppState({ onForeground })

  useEffect(() => {
    getPermissionStatus()
  }, [])

  return (
    <Box flex={1}>
      <SavedSearchAlertForm
        initialValues={{ name: "", email: props.userAllowsEmails, push: enablePushNotifications }}
        contentContainerStyle={{ paddingTop: 0 }}
        {...props}
      />
    </Box>
  )
}

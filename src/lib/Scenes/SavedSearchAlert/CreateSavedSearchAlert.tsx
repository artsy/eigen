import { Aggregations, FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import useAppState from "lib/utils/useAppState"
import { Sans, Text, useTheme } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertMutationResult } from "./SavedSearchAlertModel"

export interface CreateSavedSearchAlertProps extends SavedSearchAlertFormPropsBase {
  visible: boolean
  filters: FilterData[]
  aggregations: Aggregations
  onClosePress: () => void
  onComplete: (response: SavedSearchAlertMutationResult) => void
}

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, filters, aggregations, onClosePress, onComplete, ...other } = props
  const { space } = useTheme()
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

  const handleComplete = async (result: SavedSearchAlertMutationResult) => {
    onComplete(result)
  }

  return (
    <FancyModal visible={visible} fullScreen>
      <FancyModalHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
      <ScrollView
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: space(2) }}
      >
        <Sans size="8" mb={1}>
          Create an Alert
        </Sans>
        <Sans size="3t" mb={4}>
          Receive alerts as Push Notifications directly to your device.
        </Sans>
        <SavedSearchAlertForm
          initialValues={{ name: "", email: true, push: enablePushNotifications }}
          aggregations={aggregations}
          filters={filters}
          onComplete={handleComplete}
          {...other}
        />
        <Text variant="sm" color="black60" textAlign="center" my={2}>
          You will be able to access all your Saved Alerts in your Profile.
        </Text>
      </ScrollView>
    </FancyModal>
  )
}

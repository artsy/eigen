import { Aggregations, FilterData } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import useAppState from "lib/utils/useAppState"
import React, { useCallback, useEffect, useState } from "react"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertMutationResult } from "./SavedSearchAlertModel"

export interface CreateSavedSearchAlertProps extends SavedSearchAlertFormPropsBase {
  visible: boolean
  filters: FilterData[]
  aggregations: Aggregations
  userAllowsEmails: boolean
  onClosePress: () => void
  onComplete: (response: SavedSearchAlertMutationResult) => void
}

export const CreateSavedSearchAlert: React.FC<CreateSavedSearchAlertProps> = (props) => {
  const { visible, filters, aggregations, onClosePress, onComplete, ...other } = props
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
      <SavedSearchAlertForm
        initialValues={{ name: "", email: props.userAllowsEmails, push: enablePushNotifications }}
        aggregations={aggregations}
        filters={filters}
        onComplete={handleComplete}
        contentContainerStyle={{ paddingTop: 0 }}
        {...other}
      />
    </FancyModal>
  )
}

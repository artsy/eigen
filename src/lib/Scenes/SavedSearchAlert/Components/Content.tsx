import { useFocusEffect } from "@react-navigation/core"
import { StackNavigationProp } from "@react-navigation/stack"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import useAppState from "lib/utils/useAppState"
import { Box } from "palette"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { RelayRefetchProp } from "react-relay"
import { SavedSearchAlertForm } from "../SavedSearchAlertForm"
import { CreateSavedSearchAlertNavigationStack, CreateSavedSearchAlertParams } from "../SavedSearchAlertModel"

type ContentProps = Omit<CreateSavedSearchAlertParams, "me" | "onClosePress"> & {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  relay: RelayRefetchProp
  userAllowsEmails: boolean
  criteria?: SearchCriteriaAttributes
}

export const Content: React.FC<ContentProps> = (props) => {
  const {
    navigation,
    relay,
    filters,
    aggregations,
    userAllowsEmails,
    isLoading,
    criteria,
    onComplete,
    ...other
  } = props
  const [enablePushNotifications, setEnablePushNotifications] = useState(true)
  const [refetching, setRefetching] = useState(false)
  const enableSavedSearchToggles = useFeatureFlag("AREnableSavedSearchToggles")
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")
  const isPreviouslyFocused = useRef(false)

  const getPermissionStatus = async () => {
    const status = await getNotificationPermissionsStatus()
    setEnablePushNotifications(status === PushAuthorizationStatus.Authorized)
  }

  const onForeground = useCallback(() => {
    getPermissionStatus()
  }, [])

  const handleUpdateEmailPreferencesPress = () => {
    navigation.navigate("EmailPreferences")
  }

  const refetch = () => {
    setRefetching(true)
    relay.refetch(
      // TODO: Leave only {} when improved alerts is released
      criteria ? { criteria } : {},
      null,
      () => {
        setRefetching(false)
      },
      { force: true }
    )
  }

  useAppState({ onForeground })

  useEffect(() => {
    getPermissionStatus()
  }, [])

  // make refetch only when toggles are displayed
  useFocusEffect(
    useCallback(() => {
      if (
        (!isEnabledImprovedAlertsFlow && enableSavedSearchToggles) ||
        (isEnabledImprovedAlertsFlow && isPreviouslyFocused.current)
      ) {
        refetch()
      }

      isPreviouslyFocused.current = true
    }, [enableSavedSearchToggles])
  )

  return (
    <Box flex={1}>
      <SavedSearchAlertForm
        initialValues={{ name: "", email: userAllowsEmails, push: enablePushNotifications }}
        aggregations={aggregations}
        filters={filters}
        onComplete={onComplete}
        contentContainerStyle={{ paddingTop: 0 }}
        userAllowsEmails={userAllowsEmails}
        isLoading={refetching || isLoading}
        onUpdateEmailPreferencesPress={handleUpdateEmailPreferencesPress}
        {...other}
      />
    </Box>
  )
}

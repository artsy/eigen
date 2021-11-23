import { useFocusEffect } from "@react-navigation/core"
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack"
import { CreateSavedSearchAlertScreen_me } from "__generated__/CreateSavedSearchAlertScreen_me.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import useAppState from "lib/utils/useAppState"
import { Box } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { SavedSearchAlertForm } from "../SavedSearchAlertForm"
import { CreateSavedSearchAlertNavigationStack, CreateSavedSearchAlertParams } from "../SavedSearchAlertModel"
import { SavedSearchAlertMutationResult } from "../SavedSearchAlertModel"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">

type ContentProps = Omit<CreateSavedSearchAlertParams, "me" | "onClosePress"> & {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  relay: RelayRefetchProp
  me?: CreateSavedSearchAlertScreen_me | null
}

const Content: React.FC<ContentProps> = (props) => {
  const { navigation, relay, me, filters, aggregations, onComplete, ...other } = props
  const [enablePushNotifications, setEnablePushNotifications] = useState(true)
  const [refetching, setRefetching] = useState(false)
  const userAllowsEmails = me?.emailFrequency !== "none"

  const getPermissionStatus = async () => {
    const status = await getNotificationPermissionsStatus()
    setEnablePushNotifications(status === PushAuthorizationStatus.Authorized)
  }

  const onForeground = useCallback(() => {
    getPermissionStatus()
  }, [])

  const handleComplete = (result: SavedSearchAlertMutationResult) => {
    onComplete(result)
  }

  const handleUpdateEmailPreferencesPress = () => {
    navigation.navigate("EmailPreferences")
  }

  const refetch = () => {
    setRefetching(true)
    relay.refetch(
      {},
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

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [])
  )

  return (
    <Box flex={1}>
      <SavedSearchAlertForm
        initialValues={{ name: "", email: userAllowsEmails, push: enablePushNotifications }}
        aggregations={aggregations}
        filters={filters}
        onComplete={handleComplete}
        contentContainerStyle={{ paddingTop: 0 }}
        userAllowsEmails={userAllowsEmails}
        isLoading={refetching}
        onUpdateEmailPreferencesPress={handleUpdateEmailPreferencesPress}
        {...other}
      />
    </Box>
  )
}

const ContentRefetchContainer = createRefetchContainer(
  Content,
  {
    me: graphql`
      fragment CreateSavedSearchAlertScreen_me on Me {
        emailFrequency
      }
    `,
  },
  graphql`
    query CreateSavedSearchAlertScreenRefetchQuery {
      me {
        ...CreateSavedSearchAlertScreen_me
      }
    }
  `
)

export const CreateSavedSearchAlertScreen: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { me, onClosePress, ...other } = route.params

  return (
    <Box flex={1}>
      <FancyModalHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
      <ContentRefetchContainer navigation={navigation} me={me} {...other} />
    </Box>
  )
}

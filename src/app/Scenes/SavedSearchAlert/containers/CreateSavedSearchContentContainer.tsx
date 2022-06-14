import { useFocusEffect } from "@react-navigation/core"
import { StackNavigationProp } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { CreateSavedSearchContentContainer_viewer$data } from "__generated__/CreateSavedSearchContentContainer_viewer.graphql"
import { CreateSavedSearchContentContainerQuery } from "__generated__/CreateSavedSearchContentContainerQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { defaultEnvironment } from "app/relay/createEnvironment"
import {
  getNotificationPermissionsStatus,
  PushAuthorizationStatus,
} from "app/utils/PushNotification"
import useAppState from "app/utils/useAppState"
import { Box } from "palette"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { SavedSearchAlertForm } from "../SavedSearchAlertForm"
import {
  CreateSavedSearchAlertNavigationStack,
  SavedSearchAlertMutationResult,
} from "../SavedSearchAlertModel"

interface CreateSavedSearchAlertContentQueryRendererProps {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  onClosePress: () => void
  onComplete: (response: SavedSearchAlertMutationResult) => void
}

interface CreateSavedSearchAlertContentProps
  extends CreateSavedSearchAlertContentQueryRendererProps {
  relay: RelayRefetchProp
  viewer?: CreateSavedSearchContentContainer_viewer$data | null
  loading: boolean
}

const CreateSavedSearchAlertContent: React.FC<CreateSavedSearchAlertContentProps> = (props) => {
  const { viewer, loading, relay, navigation, onClosePress, ...other } = props
  const isPreviouslyFocused = useRef(false)
  const [refetching, setRefetching] = useState(false)
  const [enablePushNotifications, setEnablePushNotifications] = useState(true)
  const isCustomAlertsNotificationsEnabled = viewer?.notificationPreferences.some((preference) => {
    return (
      preference.channel === "email" &&
      preference.name === "custom_alerts" &&
      preference.status === "SUBSCRIBED"
    )
  })
  const userAllowsEmails = isCustomAlertsNotificationsEnabled ?? false

  const handleUpdateEmailPreferencesPress = () => {
    navigation.navigate("EmailPreferences")
  }

  const getPermissionStatus = async () => {
    const status = await getNotificationPermissionsStatus()
    setEnablePushNotifications(status === PushAuthorizationStatus.Authorized)
  }

  const onForeground = useCallback(() => {
    getPermissionStatus()
  }, [])

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

  useFocusEffect(
    useCallback(() => {
      if (isPreviouslyFocused.current) {
        refetch()
      }

      isPreviouslyFocused.current = true
    }, [])
  )

  useAppState({ onForeground })

  useEffect(() => {
    getPermissionStatus()
  }, [])

  return (
    <Box flex={1}>
      <FancyModalHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
      <SavedSearchAlertForm
        initialValues={{ name: "", email: userAllowsEmails, push: enablePushNotifications }}
        contentContainerStyle={{ paddingTop: 0 }}
        isLoading={loading || refetching}
        onUpdateEmailPreferencesPress={handleUpdateEmailPreferencesPress}
        userAllowsEmails={userAllowsEmails}
        {...other}
      />
    </Box>
  )
}

const CreateSavedSearchContentContainer = createRefetchContainer(
  CreateSavedSearchAlertContent,
  {
    viewer: graphql`
      fragment CreateSavedSearchContentContainer_viewer on Viewer {
        notificationPreferences {
          status
          name
          channel
        }
      }
    `,
  },
  graphql`
    query CreateSavedSearchContentContainerRefetchQuery {
      viewer {
        ...CreateSavedSearchContentContainer_viewer
      }
    }
  `
)

export const CreateSavedSearchAlertContentQueryRenderer: React.FC<
  CreateSavedSearchAlertContentQueryRendererProps
> = (props) => {
  return (
    <QueryRenderer<CreateSavedSearchContentContainerQuery>
      environment={defaultEnvironment}
      query={graphql`
        query CreateSavedSearchContentContainerQuery {
          viewer {
            ...CreateSavedSearchContentContainer_viewer
          }
        }
      `}
      render={({ props: relayProps, error }) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(error.stack!)
          }
        }

        return (
          <CreateSavedSearchContentContainer
            {...props}
            viewer={relayProps?.viewer ?? null}
            loading={relayProps === null && error === null}
          />
        )
      }}
      variables={{}}
      cacheConfig={{ force: true }}
    />
  )
}

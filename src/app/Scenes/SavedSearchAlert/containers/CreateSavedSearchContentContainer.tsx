import { Box } from "@artsy/palette-mobile"
import { useFocusEffect } from "@react-navigation/core"
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { CreateSavedSearchContentContainerQuery } from "__generated__/CreateSavedSearchContentContainerQuery.graphql"
import { CreateSavedSearchContentContainer_viewer$data } from "__generated__/CreateSavedSearchContentContainer_viewer.graphql"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { SavedSearchAlertForm } from "app/Scenes/SavedSearchAlert/SavedSearchAlertForm"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import {
  getNotificationPermissionsStatus,
  PushAuthorizationStatus,
} from "app/system/notifications/getNotificationsPermissions"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import useAppState from "app/utils/useAppState"
import { useCallback, useEffect, useRef, useState } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

type ScreenNavigationProps = StackScreenProps<
  CreateSavedSearchAlertNavigationStack,
  "CreateSavedSearchAlert"
>

interface CreateSavedSearchAlertContentProps extends ScreenNavigationProps {
  relay: RelayRefetchProp
  viewer?: CreateSavedSearchContentContainer_viewer$data | null
  loading: boolean
}

const CreateSavedSearchAlertContent: React.FC<CreateSavedSearchAlertContentProps> = (props) => {
  const navigation =
    useNavigation<NavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">>()
  const route =
    useRoute<RouteProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">>()
  const { viewer, loading, relay } = props
  const { onClosePress, ...other } = route.params
  const isPreviouslyFocused = useRef(false)
  const [refetching, setRefetching] = useState(false)
  const [enablePushNotifications, setEnablePushNotifications] = useState(true)
  const isCustomAlertsNotificationsEnabled = viewer?.notificationPreferences?.some((preference) => {
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
    relay.refetch({}, null, () => {
      setRefetching(false)
    })
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
      <NavigationHeader useXButton hideBottomDivider onLeftButtonPress={onClosePress} />
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

export const CreateSavedSearchAlertContentQueryRenderer: React.FC<ScreenNavigationProps> = (
  props
) => {
  return (
    <QueryRenderer<CreateSavedSearchContentContainerQuery>
      environment={getRelayEnvironment()}
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
            captureMessage(`CreateSavedSearchAlertContentContainer ${error?.message}`)
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
    />
  )
}

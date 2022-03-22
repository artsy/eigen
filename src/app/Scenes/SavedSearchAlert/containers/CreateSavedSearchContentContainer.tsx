import { useFocusEffect } from "@react-navigation/core"
import { StackNavigationProp } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { CreateSavedSearchContentContainer_me } from "__generated__/CreateSavedSearchContentContainer_me.graphql"
import { CreateSavedSearchContentContainerQuery } from "__generated__/CreateSavedSearchContentContainerQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { defaultEnvironment } from "app/relay/createEnvironment"
import {
  getNotificationPermissionsStatus,
  PushAuthorizationStatus,
} from "app/utils/PushNotification"
import useAppState from "app/utils/useAppState"
import { Box } from "palette"
import { useCallback, useEffect, useRef, useState } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { SavedSearchAlertForm } from "../SavedSearchAlertForm"
import {
  CreateSavedSearchAlertNavigationStack,
  SavedSearchAlertFormPropsBase,
  SavedSearchAlertMutationResult,
} from "../SavedSearchAlertModel"

interface CreateSavedSearchAlertContentQueryRendererProps {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  artistId: string
  artistName: string
  onClosePress: () => void
  onComplete: (response: SavedSearchAlertMutationResult) => void
}

interface CreateSavedSearchAlertContentProps
  extends CreateSavedSearchAlertContentQueryRendererProps,
    SavedSearchAlertFormPropsBase {
  relay: RelayRefetchProp
  me?: CreateSavedSearchContentContainer_me | null
  loading: boolean
}

const CreateSavedSearchAlertContent: React.FC<CreateSavedSearchAlertContentProps> = (props) => {
  const { me, loading, relay, navigation, onClosePress, ...other } = props
  const isPreviouslyFocused = useRef(false)
  const [refetching, setRefetching] = useState(false)
  const [enablePushNotifications, setEnablePushNotifications] = useState(true)
  const userAllowsEmails = me?.emailFrequency !== "none"

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
    me: graphql`
      fragment CreateSavedSearchContentContainer_me on Me {
        emailFrequency
      }
    `,
  },
  graphql`
    query CreateSavedSearchContentContainerRefetchQuery {
      me {
        ...CreateSavedSearchContentContainer_me
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
          me {
            ...CreateSavedSearchContentContainer_me
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
            me={relayProps?.me ?? null}
            loading={relayProps === null && error === null}
          />
        )
      }}
      variables={{}}
      cacheConfig={{ force: true }}
    />
  )
}

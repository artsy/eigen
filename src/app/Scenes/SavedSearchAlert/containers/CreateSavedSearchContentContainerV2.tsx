import { useFocusEffect } from "@react-navigation/core"
import { StackNavigationProp } from "@react-navigation/stack"
import { captureMessage } from "@sentry/react-native"
import { CreateSavedSearchContentContainerV2_me } from "__generated__/CreateSavedSearchContentContainerV2_me.graphql"
import { CreateSavedSearchContentContainerV2Query } from "__generated__/CreateSavedSearchContentContainerV2Query.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import React, { useCallback, useRef, useState } from "react"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { CreateSavedSearchContent } from "../Components/CreateSavedSearchContent"
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
  me?: CreateSavedSearchContentContainerV2_me | null
  loading: boolean
}

const Container: React.FC<CreateSavedSearchAlertContentProps> = (props) => {
  const { me, loading, relay, navigation, ...other } = props
  const isPreviouslyFocused = useRef(false)
  const [refetching, setRefetching] = useState(false)

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

  useFocusEffect(
    useCallback(() => {
      if (isPreviouslyFocused.current) {
        refetch()
      }

      isPreviouslyFocused.current = true
    }, [])
  )

  return (
    <CreateSavedSearchContent
      userAllowsEmails={me?.emailFrequency !== "none"}
      isLoading={loading || refetching}
      onUpdateEmailPreferencesPress={handleUpdateEmailPreferencesPress}
      {...other}
    />
  )
}

const CreateSavedSearchContentContainerV2 = createRefetchContainer(
  Container,
  {
    me: graphql`
      fragment CreateSavedSearchContentContainerV2_me on Me {
        emailFrequency
      }
    `,
  },
  graphql`
    query CreateSavedSearchContentContainerV2RefetchQuery {
      me {
        ...CreateSavedSearchContentContainerV2_me
      }
    }
  `
)

export const CreateSavedSearchAlertContentQueryRenderer: React.FC<
  CreateSavedSearchAlertContentQueryRendererProps
> = (props) => {
  return (
    <QueryRenderer<CreateSavedSearchContentContainerV2Query>
      environment={defaultEnvironment}
      query={graphql`
        query CreateSavedSearchContentContainerV2Query {
          me {
            ...CreateSavedSearchContentContainerV2_me
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
          <CreateSavedSearchContentContainerV2
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

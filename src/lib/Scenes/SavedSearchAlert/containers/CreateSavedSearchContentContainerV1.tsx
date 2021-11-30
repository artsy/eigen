import { useFocusEffect } from "@react-navigation/core"
import { StackNavigationProp } from "@react-navigation/stack"
import { CreateSavedSearchContentContainerV1_me } from "__generated__/CreateSavedSearchContentContainerV1_me.graphql"
import { useFeatureFlag } from "lib/store/GlobalStore"
import React, { useCallback, useState } from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { CreateSavedSearchContent } from "../Components/CreateSavedSearchContent"
import { CreateSavedSearchAlertNavigationStack, CreateSavedSearchAlertParams } from "../SavedSearchAlertModel"

interface ContainerProps extends Omit<CreateSavedSearchAlertParams, "me" | "onClosePress"> {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  relay: RelayRefetchProp
  me?: CreateSavedSearchContentContainerV1_me | null
}

const Container: React.FC<ContainerProps> = (props) => {
  const { me, relay, navigation, ...other } = props
  const enableSavedSearchToggles = useFeatureFlag("AREnableSavedSearchToggles")
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

  // make refetch only when toggles are displayed
  useFocusEffect(
    useCallback(() => {
      if (enableSavedSearchToggles) {
        refetch()
      }
    }, [enableSavedSearchToggles])
  )

  return (
    <CreateSavedSearchContent
      userAllowsEmails={me?.emailFrequency !== "none"}
      isLoading={refetching}
      onUpdateEmailPreferencesPress={handleUpdateEmailPreferencesPress}
      {...other}
    />
  )
}

export const CreateSavedSearchContentContainerV1 = createRefetchContainer(
  Container,
  {
    me: graphql`
      fragment CreateSavedSearchContentContainerV1_me on Me {
        emailFrequency
      }
    `,
  },
  graphql`
    query CreateSavedSearchContentContainerV1RefetchQuery {
      me {
        ...CreateSavedSearchContentContainerV1_me
      }
    }
  `
)

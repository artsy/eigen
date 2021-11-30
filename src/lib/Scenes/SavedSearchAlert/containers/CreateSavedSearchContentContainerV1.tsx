import { StackNavigationProp } from "@react-navigation/stack"
import { CreateSavedSearchContentContainerV1_me } from "__generated__/CreateSavedSearchContentContainerV1_me.graphql"
import React from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { CreateSavedSearchContent } from "../Components/CreateSavedSearchContent"
import { CreateSavedSearchAlertNavigationStack, CreateSavedSearchAlertParams } from "../SavedSearchAlertModel"

interface ContainerProps extends Omit<CreateSavedSearchAlertParams, "me" | "onClosePress"> {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  relay: RelayRefetchProp
  me?: CreateSavedSearchContentContainerV1_me | null
}

const Container: React.FC<ContainerProps> = (props) => {
  const { me, ...other } = props
  return <CreateSavedSearchContent {...other} userAllowsEmails={me?.emailFrequency !== "none"} />
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

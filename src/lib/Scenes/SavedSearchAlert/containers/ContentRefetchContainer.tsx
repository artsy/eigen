import { StackNavigationProp } from "@react-navigation/stack"
import { ContentRefetchContainer_me } from "__generated__/ContentRefetchContainer_me.graphql"
import React from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { Content } from "../Components/Content"
import { CreateSavedSearchAlertNavigationStack, CreateSavedSearchAlertParams } from "../SavedSearchAlertModel"

interface ContainerProps extends Omit<CreateSavedSearchAlertParams, "me" | "onClosePress"> {
  navigation: StackNavigationProp<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">
  relay: RelayRefetchProp
  me?: ContentRefetchContainer_me | null
}

const Container: React.FC<ContainerProps> = (props) => {
  const { me, ...other } = props
  return <Content {...other} userAllowsEmails={me?.emailFrequency !== "none"} />
}

export const ContentRefetchContainer = createRefetchContainer(
  Container,
  {
    me: graphql`
      fragment ContentRefetchContainer_me on Me {
        emailFrequency
      }
    `,
  },
  graphql`
    query ContentRefetchContainerQuery {
      me {
        ...ContentRefetchContainer_me
      }
    }
  `
)

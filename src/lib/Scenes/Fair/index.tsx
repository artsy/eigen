import { Fair_fair } from "__generated__/Fair_fair.graphql"
import React from "react"
import { Text, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props extends ViewProperties {
  fair: Fair_fair
}

export class Fair extends React.Component<Props> {
  render() {
    return <Text>{this.props.fair.name}</Text>
  }
}

export default createFragmentContainer(
  Fair,
  graphql`
    fragment Fair_fair on Fair {
      name
    }
  `
)

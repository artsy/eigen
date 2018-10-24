import React from "react"
import { Text } from "react-native"

interface Props {
  location: any
}

// TODO: implement

export class Location extends React.Component<Props> {
  render() {
    return <Text>{JSON.stringify(this.props.location)}</Text>
  }
}

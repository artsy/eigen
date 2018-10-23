import React from "react"
import { Text } from "react-native"

interface Props {
  artists: any
}

// TODO: implement

export class Artists extends React.Component<Props> {
  render() {
    return <Text>{JSON.stringify(this.props.artists)}</Text>
  }
}

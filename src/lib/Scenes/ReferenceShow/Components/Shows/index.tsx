import React from "react"
import { Text } from "react-native"

// TODO: implement

interface Props {
  shows: any[]
}

export class Shows extends React.Component<Props> {
  render() {
    return <Text>{JSON.stringify(this.props.shows)}</Text>
  }
}

import React from "react"
import { Text } from "react-native"

interface Props {
  artworks: any[]
}

// TODO: implement

export class Artworks extends React.Component<Props> {
  render() {
    return <Text>{JSON.stringify(this.props.artworks)}</Text>
  }
}

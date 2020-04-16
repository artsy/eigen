import { Sans, Theme } from "@artsy/palette"
import React from "react"

interface Props {
  viewingRoomID: string
}

export class ViewingRoomArtworks extends React.Component<Props> {
  render() {
    return (
      <Theme>
        <Sans size="3t">Hello world!</Sans>
        <Sans size="3t">{this.props.viewingRoomID}</Sans>
      </Theme>
    )
  }
}

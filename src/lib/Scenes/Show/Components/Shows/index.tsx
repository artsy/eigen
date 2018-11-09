import { Sans } from "@artsy/palette"
import { Shows_show } from "__generated__/Shows_show.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowItem } from "./Components/ShowItem"

interface Props {
  show: Shows_show
}
export class Shows extends React.Component<Props> {
  render() {
    if (!this.props.show) {
      return null
    }
    const { city } = this.props.show
    return (
      <>
        <Sans size="6">{"Current Shows In " + city}</Sans>
        <ShowItem show={this.props.show} />
      </>
    )
  }
}

export const ShowsContainer = createFragmentContainer(
  Shows,
  graphql`
    fragment Shows_show on Show {
      city
    }
  `
)

import { Serif } from "@artsy/palette"
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

    return (
      <>
        <Serif size="8">More Shows</Serif>
        <ShowItem show={this.props.show as any} />
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

import { Theme } from "@artsy/palette"
import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { DetailContainer as DetailScreen } from "./Screens/Detail"

import { Show_show } from "__generated__/Show_show.graphql"

interface Props extends ViewProperties {
  show: Show_show
}

export class Show extends React.Component<Props> {
  render() {
    return (
      <Theme>
        <DetailScreen show={this.props.show} />
      </Theme>
    )
  }
}

export const ShowContainer = createFragmentContainer(Show, {
  show: graphql`
    fragment Show_show on Show {
      ...Detail_show
      ...MoreInfo_show
      ...ShowArtists_show
      ...ShowArtworks_show
    }
  `,
})

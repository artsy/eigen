import { Theme } from "@artsy/palette"
import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { FairDetailContainer as FairDetailScreen } from "./Screens/FairDetail"

import { Fair_fair } from "__generated__/Fair_fair.graphql"

interface Props extends ViewProperties {
  fair: Fair_fair
}

export class Fair extends React.Component<Props> {
  render() {
    return (
      <Theme>
        <FairDetailScreen {...this.props} />
      </Theme>
    )
  }
}

export const FairContainer = createFragmentContainer(Fair, {
  fair: graphql`
    fragment Fair_fair on Fair {
      gravityID
      __id
      ...FairDetail_fair

      organizer {
        website
      }
      about
      ticketsLink
    }
  `,
})

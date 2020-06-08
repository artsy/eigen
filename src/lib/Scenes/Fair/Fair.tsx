import { Theme } from "@artsy/palette"
import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { FairDetailContainer as FairDetailScreen } from "./Screens/FairDetail"

import { Fair_fair } from "__generated__/Fair_fair.graphql"
import { FairQuery } from "__generated__/FairQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

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
      id
      ...FairDetail_fair
    }
  `,
})

interface FairQueryRendererProps {
  fairID: string
}

export const FairQueryRenderer: React.SFC<FairQueryRendererProps> = ({ fairID }) => {
  return (
    <QueryRenderer<FairQuery>
      environment={defaultEnvironment}
      query={graphql`
        query FairQuery($fairID: String!) {
          fair(id: $fairID) {
            ...Fair_fair
          }
        }
      `}
      variables={{ fairID }}
      render={renderWithLoadProgress(FairContainer)}
    />
  )
}

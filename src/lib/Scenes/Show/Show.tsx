import { Theme } from "@artsy/palette"
import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { DetailContainer as DetailScreen } from "./Screens/Detail"

import { Show_show } from "__generated__/Show_show.graphql"
import { ShowQuery } from "__generated__/ShowQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

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
    }
  `,
})

interface ShowQueryRendererProps {
  showID: string
}

export const ShowQueryRenderer: React.SFC<ShowQueryRendererProps> = ({ showID }) => {
  return (
    <QueryRenderer<ShowQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ShowQuery($showID: String!) {
          show(id: $showID) {
            ...Show_show
          }
        }
      `}
      variables={{ showID }}
      render={renderWithLoadProgress(ShowContainer)}
    />
  )
}

import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { DetailContainer as DetailScreen } from "./Screens/Detail"

import { Show_show } from "__generated__/Show_show.graphql"
import { ShowQuery } from "__generated__/ShowQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { FairBoothQueryRenderer } from "../Fair"

interface Props extends ViewProperties {
  show: Show_show
}

export class Show extends React.Component<Props> {
  render() {
    return <DetailScreen show={this.props.show} />
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
  entity?: string
}

export const ShowQueryRenderer: React.FC<ShowQueryRendererProps> = ({ showID, entity }) => {
  if (entity === "fair-booth") {
    return <FairBoothQueryRenderer showID={showID} />
  }
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

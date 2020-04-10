import { Flex, Theme } from "@artsy/palette"
import { ViewingRoom_viewingRoom } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { screenTrack } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ViewingRoomArtworksContainer } from "./Components/ViewingRoomArtworks"
import { ViewingRoomHeader } from "./Components/ViewingRoomHeader"
import { ViewingRoomStatement } from "./Components/ViewingRoomStatement"

interface ViewingRoomProps {
  viewingRoom: ViewingRoom_viewingRoom
}
// TODO: add tracking! For now this is just here because it crashes otherwise lol :/
@screenTrack(() => ({}))
export class ViewingRoom extends React.Component<ViewingRoomProps> {
  render() {
    return (
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <StickyTabPage
              headerContent={
                <ViewingRoomHeader artwork={this.props.viewingRoom.heroImageURL} title={this.props.viewingRoom.title} />
              }
              tabs={[
                {
                  title: "Statement",
                  initial: true,
                  content: <ViewingRoomStatement viewingRoom={this.props.viewingRoom} />,
                },
                {
                  title: "Artworks",
                  content: <ViewingRoomArtworksContainer viewingRoom={this.props.viewingRoom} />,
                },
              ]}
            />
          </Flex>
        </ProvideScreenDimensions>
      </Theme>
    )
  }
}

export const ViewingRoomFragmentContainer = createFragmentContainer(ViewingRoom, {
  viewingRoom: graphql`
    fragment ViewingRoom_viewingRoom on ViewingRoom {
      title
      body
      pullQuote
      introStatement
      startAt
      endAt
      heroImageURL
      ...ViewingRoomArtworks_viewingRoom
      ...ViewingRoomSubsections_viewingRoom
    }
  `,
})

// We'll eventually have this take in { viewingRoomID } as props and delete the hardcoded ID
export const ViewingRoomRenderer: React.SFC<{ viewingRoomID: string }> = () => {
  return (
    <QueryRenderer<ViewingRoomQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ViewingRoomQuery($viewingRoomID: ID!) {
          viewingRoom(id: $viewingRoomID) {
            ...ViewingRoom_viewingRoom
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        viewingRoomID: "0b7bb212-0e3a-45ba-b7f4-cd5bdb854a11",
      }}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
    />
  )
}

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
import { ViewingRoomStatementContainer } from "./Components/ViewingRoomStatement"

interface ViewingRoomProps {
  viewingRoom: ViewingRoom_viewingRoom
}
// TODO: add tracking! For now this is just here because it crashes otherwise lol :/

@screenTrack(() => ({})) // tslint:disable-line
export class ViewingRoom extends React.Component<ViewingRoomProps> {
  render() {
    const viewingRoom = this.props.viewingRoom
    return (
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <StickyTabPage
              headerContent={<ViewingRoomHeader artwork={viewingRoom.heroImageURL} title={viewingRoom.title} />}
              tabs={[
                {
                  title: "Statement",
                  initial: true,
                  content: <ViewingRoomStatementContainer viewingRoom={viewingRoom} />,
                },
                {
                  title: "Artworks",
                  content: <ViewingRoomArtworksContainer viewingRoom={viewingRoom} />,
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
      startAt
      endAt
      heroImageURL
      ...ViewingRoomArtworks_viewingRoom
      ...ViewingRoomStatement_viewingRoom
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
        viewingRoomID: "57df98ab-e39c-4681-b8ef-9b4d802afdac",
      }}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
    />
  )
}

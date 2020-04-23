import { Flex, Theme } from "@artsy/palette"
import { ViewingRoom_viewingRoom } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ViewingRoomHeaderContainer } from "./Components/ViewingRoomHeader"
import { ViewingRoomStatementContainer } from "./Components/ViewingRoomStatement"

interface ViewingRoomProps {
  viewingRoom: ViewingRoom_viewingRoom
}
// TODO: add tracking! For now this is just here because it crashes otherwise lol :/

export const ViewingRoom: React.FC<ViewingRoomProps> = props => {
  const viewingRoom = props.viewingRoom
  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen_owner_slug: "artistAboveTheFold.slug",
        context_screen_owner_id: "artistAboveTheFold.internalID",
      }}
    >
      <Theme>
        <Flex style={{ flex: 1 }}>
          <ScrollView>
            <ViewingRoomHeaderContainer viewingRoom={viewingRoom} />
            <ViewingRoomStatementContainer viewingRoom={viewingRoom} />
          </ScrollView>
        </Flex>
      </Theme>
    </ProvideScreenTracking>
  )
}

export const ViewingRoomFragmentContainer = createFragmentContainer(ViewingRoom, {
  viewingRoom: graphql`
    fragment ViewingRoom_viewingRoom on ViewingRoom {
      ...ViewingRoomHeader_viewingRoom
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
        viewingRoomID: "ef1f10be-5fc5-42d7-9ab4-9308dee5ed37",
      }}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
    />
  )
}

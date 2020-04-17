import { Flex, Theme } from "@artsy/palette"
import { ViewingRoom_viewingRoom } from "__generated__/ViewingRoom_viewingRoom.graphql"
import { ViewingRoomQuery } from "__generated__/ViewingRoomQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ViewingRoomHeader } from "./Components/ViewingRoomHeader"
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
            <ViewingRoomHeader artwork={viewingRoom.heroImageURL} title={viewingRoom.title} />
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
        viewingRoomID: "3b07810b-f43f-4761-ab09-a9e37ded9be0",
      }}
      render={renderWithLoadProgress(ViewingRoomFragmentContainer)}
    />
  )
}

import { Box, color, Flex, Sans, Serif, space, Spacer, Spinner, Theme } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useMemo, useRef, useState } from "react"
import { graphql, useQuery } from "relay-hooks"
const query = graphql`
  query ViewingRoomArtworkQuery($viewingRoomID: ID!) {
    viewingRoom(id: $viewingRoomID) {
      title
      # //             ...ViewingRoomArtwork_viewingRoom
    }
  }
`

export const ViewingRoomArtworkQueryRenderer: React.FC<{ viewingRoomID: string; artworkID: string }> = ({
  viewingRoomID,
  artworkID,
}) => {
  const { props, error } = useQuery(query, { viewingRoomID }, { networkCacheConfig: { force: true } })
  if (props) {
    // return <ViewingRoomArtworkContainer/>
    return <Sans size="8"> WOW {props.viewingRoom.title}</Sans>
  }
  if (error) {
    throw error
  }

  return <LoadingScreen />
}

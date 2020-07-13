import { Box, Button, Flex, Sans, Separator, Serif, space, Spacer, Spinner, Theme } from "@artsy/palette"
import { ViewingRoomArtwork_artworksList$key } from "__generated__/ViewingRoomArtwork_artworksList.graphql"
import { ViewingRoomArtwork_selectedArtwork$key } from "__generated__/ViewingRoomArtwork_selectedArtwork.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractNodes } from "lib/utils/extractNodes"
import { LoadingScreen } from "lib/utils/LoadingScreen"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useMemo, useRef, useState } from "react"
import { FlatList, ScrollView, TouchableHighlight } from "react-native"
import { graphql, useFragment, useQuery } from "relay-hooks"
import { ImageCarousel } from "../Artwork/Components/ImageCarousel/ImageCarousel"


interface ViewingRoomArtworkProps {
  selectedArtwork: ViewingRoomArtwork_selectedArtwork$key
  artworksList: ViewingRoomArtwork_artworksList$key
}

const selectedArtworkFragmentSpec = graphql`
  fragment ViewingRoomArtwork_selectedArtwork on Artwork {
    title
    artistNames
    date
    description
    saleMessage
    href
    image {
      url(version: "larger")
      aspectRatio
    }
  }
`

const artworksListFragmentSpec = graphql`
  fragment ViewingRoomArtwork_artworksList on ViewingRoom {
    artworksConnection(first: 1) {
      edges {
        node {
          # ...ImageCarousel_images
          title
          artistNames
          date
          description
          saleMessage
          image {
            url(version: "larger")
            aspectRatio
          }
        }
      }
    }
  }
`

export const ViewingRoomArtworkContainer: React.FC<ViewingRoomArtworkProps> = props => {
  const selectedArtwork = useFragment(selectedArtworkFragmentSpec, props.selectedArtwork)
  const artworksList = useFragment(artworksListFragmentSpec, props.artworksList)

  const navRef = useRef(null)

  return (
    <ScrollView ref={navRef}>
      <ImageView imageURL={selectedArtwork.image?.url} aspectRatio={selectedArtwork.image!.aspectRatio} />
      {/* <ImageCarousel images={artworks} /> */}
      <Box mt="2" mx="2">
        <Sans size="5t" color="black100" weight="medium">
          {selectedArtwork.artistNames}
        </Sans>
        <Sans size="4t" color="black60">
          {selectedArtwork.title}, {selectedArtwork.date}
        </Sans>
        <Spacer mt="2" />
        <Sans size="4t" color="black100">
          {selectedArtwork.saleMessage}
        </Sans>
        {!!selectedArtwork.description && (
          <>
            <Spacer mt="2" />
            <Serif size="4t">{selectedArtwork.description}</Serif>
          </>
        )}
        <Spacer mt="4" />
        <Button
          variant="primaryBlack"
          size="medium"
          block
          onPress={() => void SwitchBoard.presentNavigationViewController(navRef.current!, selectedArtwork.href!)}
        >
          View more details
        </Button>
        <Spacer mt="3" />
        <Separator />
        <Spacer mt="3" />
      </Box>
    </ScrollView>
  )
}

// export const ViewingRoomArtworkContainer = createPaginationContainer(
//       fragment ViewingRoomArtwork_viewingRoom on ViewingRoom
//         @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, cursor: { type: "String", defaultValue: "" }) {
//         internalID
//         slug
//         firstArtwork: artworksConnection(first: 1) {
//         }
//         artworksConnection(first: $count, after: $cursor) @connection(key: "ViewingRoomArtwork_artworksConnection") {
//           edges {
//             node {
//               # ...ImageCarousel_images
//               additionalInformation
//               href
//               slug
//               internalID
//               artistNames
//               date
//               image {
//                 url(version: "larger")
//                 aspectRatio
//               }
//               saleMessage
//               title
//             }
//           }
//         }
//       }
//     `,
//   },
// )

const query = graphql`
  query ViewingRoomArtworkQuery($viewingRoomID: ID!, $artworkID: String!) {
    artwork(id: $artworkID) {
      ...ViewingRoomArtwork_selectedArtwork
    }

    viewingRoom(id: $viewingRoomID) {
      title
      ...ViewingRoomArtwork_artworksList
    }
  }
`

export const ViewingRoomArtworkQueryRenderer: React.FC<{ viewingRoomID: string; artworkID: string }> = ({
  viewingRoomID,
  artworkID,
}) => {
  const { props, error } = useQuery(query, { viewingRoomID, artworkID }, { networkCacheConfig: { force: true } })
  if (props) {
    return <ViewingRoomArtworkContainer selectedArtwork={props.artwork} artworksList={props.viewingRoom} />
  }
  if (error) {
    throw error
  }

  return <LoadingScreen />
}

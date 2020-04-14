import { Box, Flex, Sans, space, Spinner } from "@artsy/palette"
import { ViewingRoomArtworks_viewingRoom } from "__generated__/ViewingRoomArtworks_viewingRoom.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { StickyTabPageFlatList, StickyTabSection } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useMemo, useRef, useState } from "react"
import { TouchableOpacity } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

const PAGE_SIZE = 32

interface ViewingRoomArtworkProps {
  relay: RelayPaginationProp
  viewingRoom: ViewingRoomArtworks_viewingRoom
}

export const ViewingRoomArtworks: React.FC<ViewingRoomArtworkProps> = ({ viewingRoom, relay }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const navRef = useRef()
  const artworks = viewingRoom.artworksConnection.edges

  const sections: StickyTabSection[] = useMemo(() => {
    return [
      {
        key: "artworks",
        content: (
          <>
            {artworks.map((artwork, index) => {
              const finalArtwork = artwork.node.artwork
              return (
                <TouchableOpacity
                  key={index}
                  ref={navRef}
                  onPress={() => {
                    SwitchBoard.presentNavigationViewController(navRef.current, finalArtwork.href)
                  }}
                >
                  <ImageView imageURL={finalArtwork.image.url} aspectRatio={finalArtwork.image.aspectRatio} />
                  <Box mt="2" mb="3">
                    <Sans size="3t" weight="medium">
                      {finalArtwork.artistNames}
                    </Sans>
                    <Sans size="3t" color="black60">
                      {finalArtwork.title}
                    </Sans>
                    <Sans size="3t" color="black60">
                      {finalArtwork.saleMessage}
                    </Sans>
                  </Box>
                </TouchableOpacity>
              )
            })}
          </>
        ),
      },
    ]
  }, [artworks])
  return (
    <>
      <StickyTabPageFlatList
        data={sections}
        onEndReachedThreshold={1}
        initialNumToRender={2}
        windowSize={5}
        onEndReached={() => {
          if (isLoadingMore || !relay.hasMore()) {
            return
          }
          setIsLoadingMore(true)
          relay.loadMore(PAGE_SIZE, error => {
            if (error) {
              // FIXME: Handle error
              console.error("ViewingRoomArtworks.tsx", error.message)
            }
            setIsLoadingMore(false)
          })
        }}
        refreshing={isLoadingMore}
        ListFooterComponent={() => (
          <Flex alignItems="center" justifyContent="center" height={space(6)}>
            {isLoadingMore ? <Spinner /> : null}
          </Flex>
        )}
      />
    </>
  )
}

export const ViewingRoomArtworksContainer = createPaginationContainer(
  // this is the component we're wrapping
  ViewingRoomArtworks,
  // this is the fragmentSpec, type GraphQLTaggedNode
  // from the docs: "specifies the data requirements for the component
  // via a GraphQL fragment"
  // Conventino is that name is <FileName>_<propName>
  {
    viewingRoom: graphql`
      fragment ViewingRoomArtworks_viewingRoom on ViewingRoom
        @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String", defaultValue: "" }) {
        internalID
        artworksConnection(first: $count, after: $cursor) @connection(key: "ViewingRoomArtworks_artworksConnection") {
          edges {
            node {
              artwork {
                href
                artistNames
                date
                image {
                  url(version: "larger")
                  aspectRatio
                }
                saleMessage
                title
              }
            }
          }
        }
      }
    `,
  },
  // and this is the connectionConfig
  {
    // indicates which connection to paginate over, given the props corresponding to the fragmentSpec
    getConnectionFromProps(props) {
      return props.viewingRoom.artworksConnection
    },
    // "returns the variables to pass to the pagination query when fetching it from the server"
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        id: fragmentVariables.internalID,
        count,
        cursor,
      }
    },
    // oh this is also a GraphQLTaggedNode, same as fragmentSpec -
    // this is the actual query being run then, yeah?
    // rather, it's the query being fetched upon calling loadMore
    query: graphql`
      query ViewingRoomArtworksQuery($id: ID!, $count: Int!, $cursor: String) {
        viewingRoom(id: $id) {
          ...ViewingRoomArtworks_viewingRoom @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

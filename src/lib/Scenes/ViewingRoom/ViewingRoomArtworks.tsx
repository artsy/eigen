import { Box, Flex, Sans, space, Spinner, Theme } from "@artsy/palette"
import { ViewingRoomArtworks_viewingRoom } from "__generated__/ViewingRoomArtworks_viewingRoom.graphql"
import { ViewingRoomArtworksRendererQuery } from "__generated__/ViewingRoomArtworksRendererQuery.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useMemo, useRef, useState } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

const PAGE_SIZE = 5
interface ViewingRoomArtworksProps {
  relay: RelayPaginationProp
  viewingRoom: ViewingRoomArtworks_viewingRoom
}

interface ArtworkSection {
  key: string
  content: JSX.Element
}

export const ViewingRoomArtworks: React.FC<ViewingRoomArtworksProps> = ({ viewingRoom, relay }) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const navRef = useRef()
  const tracking = useTracking()
  const artworks = viewingRoom.artworksConnection! /* STRICTNESS_MIGRATION */.edges! /* STRICTNESS_MIGRATION */

  const sections: ArtworkSection[] = useMemo(() => {
    return artworks.map((artwork, index) => {
      const finalArtwork = artwork! /* STRICTNESS_MIGRATION */.node! /* STRICTNESS_MIGRATION */
      return {
        key: `${index}`,
        content: (
          <TouchableOpacity
            ref={navRef as any /* STRICTNESS_MIGRATION */}
            onPress={() => {
              tracking.trackEvent({
                action: Schema.ActionNames.TappedArtworkGroup,
                context_module: Schema.ContextModules.ArtworkGrid,
                destination_screen: Schema.PageNames.ArtworkPage,
                destination_screen_owner_id: "TKTK",
                destination_screen_owner_slug: "TKTK",
              })
              SwitchBoard.presentNavigationViewController(
                navRef.current!,
                finalArtwork.href! /* STRICTNESS_MIGRATION */
              )
            }}
          >
            <ImageView
              imageURL={finalArtwork.image! /* STRICTNESS_MIGRATION */.url! /* STRICTNESS_MIGRATION */}
              aspectRatio={finalArtwork.image!.aspectRatio}
            />
            <Box mt="1" mb="2" mx="2">
              <Sans size="3t" weight="medium">
                {finalArtwork.artistNames}
              </Sans>
              <Sans size="3t" color="black60" key={index}>
                {finalArtwork.title}
              </Sans>
              <Sans size="3t" color="black60">
                {finalArtwork.saleMessage}
              </Sans>
            </Box>
          </TouchableOpacity>
        ),
      }
    })
  }, [artworks])

  return (
    <Theme>
      <ProvideScreenDimensions>
        <Flex style={{ flex: 1 }}>
          <Sans size="4" py={2} weight="medium" textAlign="center">
            Artworks
          </Sans>
          <FlatList
            data={sections}
            ItemSeparatorComponent={() => <Box px={2} my={2} />}
            contentInset={{ bottom: 40 }}
            renderItem={({ item }) => <Box>{item.content}</Box>}
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
        </Flex>
      </ProvideScreenDimensions>
    </Theme>
  )
}

export const ViewingRoomArtworksContainer = createPaginationContainer(
  // this is the component we're wrapping
  ViewingRoomArtworks,
  // this is the fragmentSpec, type GraphQLTaggedNode
  // from the docs: "specifies the data requirements for the component
  // via a GraphQL fragment"
  // Convention is that name is <FileName>_<propName>
  {
    viewingRoom: graphql`
      fragment ViewingRoomArtworks_viewingRoom on ViewingRoom
        @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, cursor: { type: "String", defaultValue: "" }) {
        internalID
        artworksConnection(first: $count, after: $cursor) @connection(key: "ViewingRoomArtworks_artworksConnection") {
          edges {
            node {
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
    `,
  },
  // and this is the connectionConfig
  {
    // indicates which connection to paginate over, given the props corresponding to the fragmentSpec
    getConnectionFromProps(props) {
      return props.viewingRoom.artworksConnection
    },
    // "returns the variables to pass to the pagination query when fetching it from the server"
    getVariables(props, { count, cursor }, _fragmentVariables) {
      return {
        id: props.viewingRoom.internalID,
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

// We'll eventually have this take in { viewingRoomID } as props and delete the hardcoded ID
export const ViewingRoomArtworksRenderer: React.SFC<{ viewingRoomID: string }> = () => {
  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ViewingRoomArtworks,
        context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
        context_screen_owner_id: "TKTK",
        context_screen_owner_slug: "TKTK",
      }}
    >
      <QueryRenderer<ViewingRoomArtworksRendererQuery>
        environment={defaultEnvironment}
        query={graphql`
          query ViewingRoomArtworksRendererQuery($viewingRoomID: ID!) {
            viewingRoom(id: $viewingRoomID) {
              ...ViewingRoomArtworks_viewingRoom
            }
          }
        `}
        cacheConfig={{ force: true }}
        variables={{
          viewingRoomID: "1489f6b2-39f2-449d-9cc2-6baa5782c756",
        }}
        render={renderWithLoadProgress(ViewingRoomArtworksContainer)}
      />
    </ProvideScreenTracking>
  )
}

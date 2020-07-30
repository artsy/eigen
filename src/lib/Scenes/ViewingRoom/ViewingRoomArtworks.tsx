import { Box, color, Flex, Sans, Separator, Serif, space, Spinner, Text, Theme } from "@artsy/palette"
import { ViewingRoomArtworks_viewingRoom } from "__generated__/ViewingRoomArtworks_viewingRoom.graphql"
import { ViewingRoomArtworksQueryRendererQuery } from "__generated__/ViewingRoomArtworksQueryRendererQuery.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useMemo, useRef, useState } from "react"
import { FlatList, TouchableHighlight } from "react-native"
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

export const ViewingRoomArtworks: React.FC<ViewingRoomArtworksProps> = props => {
  const { viewingRoom, relay } = props
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const navRef = useRef(null)
  const tracking = useTracking()
  const artworks = extractNodes(viewingRoom.artworksConnection)

  const sections: ArtworkSection[] = useMemo(() => {
    return artworks.map((artwork, index) => {
      return {
        key: `${index}`,
        content: (
          <Box>
            <TouchableHighlight
              ref={navRef}
              onPress={() => {
                tracking.trackEvent({
                  ...tracks.context(viewingRoom.internalID, viewingRoom.slug),
                  ...tracks.tappedArtworkGroup(
                    viewingRoom.internalID,
                    viewingRoom.slug,
                    artwork.internalID,
                    artwork.slug
                  ),
                })
                SwitchBoard.presentNavigationViewController(
                  navRef.current!,
                  `/viewing-room/${viewingRoom.slug}/${artwork.slug}`
                )
              }}
              underlayColor={color("white100")}
              activeOpacity={0.8}
            >
              <Box>
                <ImageView imageURL={artwork.image?.url} aspectRatio={artwork.image!.aspectRatio} />
                <Box mt="1" mx="2">
                  <Text variant="mediumText">{artwork.artistNames}</Text>
                  <Text variant="text" color="black60" key={index}>
                    {artwork.title}
                  </Text>
                  <Text variant="text" color="black60">
                    {artwork.saleMessage}
                  </Text>
                </Box>
              </Box>
            </TouchableHighlight>
            {!!artwork.additionalInformation && (
              <Flex mx="2" mt="1">
                <Text variant="text" data-test-id="artwork-additional-information">
                  {artwork.additionalInformation}
                </Text>
              </Flex>
            )}
          </Box>
        ),
      }
    })
  }, [artworks])

  return (
    <ProvideScreenTracking info={tracks.context(viewingRoom.internalID, viewingRoom.slug)}>
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <Sans size="4" py={2} weight="medium" textAlign="center">
              Artworks
            </Sans>
            <Separator />
            <FlatList
              data={sections}
              ItemSeparatorComponent={() => <Box px={2} mb={3} />}
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
    </ProvideScreenTracking>
  )
}

export const tracks = {
  context: (viewingRoomID: string, viewingRoomSlug: string) => ({
    context_screen: Schema.PageNames.ViewingRoomArtworks,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    context_screen_owner_id: viewingRoomID,
    context_screen_owner_slug: viewingRoomSlug,
  }),
  tappedArtworkGroup: (viewingRoomID: string, viewingRoomSlug: string, artworkID: string, artworkSlug: string) => ({
    action_name: Schema.ActionNames.TappedArtworkGroup,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkGrid,
    destination_screen: Schema.PageNames.ViewingRoomArtworkPage,
    destination_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    destination_screen_owner_id: viewingRoomID,
    destination_screen_owner_slug: viewingRoomSlug,
    artwork_id: artworkID,
    artwork_slug: artworkSlug,
  }),
}

export const ViewingRoomArtworksContainer = createPaginationContainer(
  ViewingRoomArtworks,
  {
    viewingRoom: graphql`
      fragment ViewingRoomArtworks_viewingRoom on ViewingRoom
        @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, cursor: { type: "String", defaultValue: "" }) {
        internalID
        slug
        artworksConnection(first: $count, after: $cursor) @connection(key: "ViewingRoomArtworks_artworksConnection") {
          edges {
            node {
              additionalInformation
              href
              slug
              internalID
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
  {
    getConnectionFromProps(props) {
      return props.viewingRoom.artworksConnection
    },
    getVariables(props, { count, cursor }, _fragmentVariables) {
      return {
        // We use slug here because slug is passed to the component from the switchboard, and we can't paginate
        // correctly when first using slug and then using internalID
        // https://github.com/artsy/eigen/pull/3363#discussion_r431045824
        viewingRoomID: props.viewingRoom.slug,
        count,
        cursor,
      }
    },
    query: graphql`
      query ViewingRoomArtworksQuery($viewingRoomID: ID!, $count: Int!, $cursor: String) {
        viewingRoom(id: $viewingRoomID) {
          ...ViewingRoomArtworks_viewingRoom @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

export const ViewingRoomArtworksQueryRenderer: React.FC<{ viewing_room_id: string }> = ({
  viewing_room_id: viewingRoomID,
}) => {
  return (
    <QueryRenderer<ViewingRoomArtworksQueryRendererQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ViewingRoomArtworksQueryRendererQuery($viewingRoomID: ID!) {
          viewingRoom(id: $viewingRoomID) {
            ...ViewingRoomArtworks_viewingRoom
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        viewingRoomID,
      }}
      render={renderWithLoadProgress(ViewingRoomArtworksContainer)}
    />
  )
}

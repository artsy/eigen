import { Flex, Box, useSpace, Text, Spinner, Separator, Touchable } from "@artsy/palette-mobile"
import { ViewingRoomArtworksQueryRendererQuery } from "__generated__/ViewingRoomArtworksQueryRendererQuery.graphql"
import { ViewingRoomArtworks_viewingRoom$data } from "__generated__/ViewingRoomArtworks_viewingRoom.graphql"
import ImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import { ReadMore } from "app/Components/ReadMore"
import { navigate } from "app/system/navigation/navigate"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useMemo, useState } from "react"
import { FlatList, useWindowDimensions } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

const PAGE_SIZE = 5
interface ViewingRoomArtworksProps {
  relay: RelayPaginationProp
  viewingRoom: ViewingRoomArtworks_viewingRoom$data
}

interface ArtworkSection {
  key: string
  content: JSX.Element
}

export const ViewingRoomArtworks: React.FC<ViewingRoomArtworksProps> = (props) => {
  const space = useSpace()
  const { viewingRoom, relay } = props
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const tracking = useTracking()
  const artworks = extractNodes(viewingRoom.artworksConnection)
  const { width } = useWindowDimensions()
  const enableNewOpaqueImageView = useFeatureFlag("AREnableNewOpaqueImageComponent")

  const sections: ArtworkSection[] = useMemo(() => {
    return artworks.map((artwork, index) => {
      return {
        key: `${index}`,
        content: (
          <Box>
            <Touchable
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
                navigate(`/viewing-room/${viewingRoom.slug}/${artwork.slug}`)
              }}
            >
              <Box>
                {enableNewOpaqueImageView ? (
                  <OpaqueImageView
                    imageURL={artwork.image?.url}
                    width={width}
                    aspectRatio={artwork.image!.aspectRatio}
                  />
                ) : (
                  <ImageView
                    imageURL={artwork.image?.url}
                    aspectRatio={artwork.image!.aspectRatio}
                  />
                )}
                <Box mt={1} mx={2}>
                  <Text variant="sm">{artwork.artistNames}</Text>
                  <Text variant="sm" color="black60" key={index}>
                    {artwork.title}
                  </Text>
                  <Text variant="sm" color="black60">
                    {artwork.saleMessage}
                  </Text>
                </Box>
              </Box>
            </Touchable>
            {!!artwork.additionalInformation && (
              <Flex mx={2} mt={1}>
                <ReadMore
                  content={artwork.additionalInformation}
                  maxChars={300}
                  textStyle="new"
                  testID="artwork-additional-information"
                />
              </Flex>
            )}
          </Box>
        ),
      }
    })
  }, [artworks])

  return (
    <ProvideScreenTracking info={tracks.context(viewingRoom.internalID, viewingRoom.slug)}>
      <Flex style={{ flex: 1 }}>
        <Text variant="sm-display" weight="medium" textAlign="center" mb={1} mt={2}>
          Artworks
        </Text>
        <Separator />
        <FlatList
          data={sections}
          ItemSeparatorComponent={() => <Box px={2} mb={4} />}
          renderItem={({ item }) => <Box>{item.content}</Box>}
          onEndReached={() => {
            if (isLoadingMore || !relay.hasMore()) {
              return
            }
            setIsLoadingMore(true)
            relay.loadMore(PAGE_SIZE, (error) => {
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
  tappedArtworkGroup: (
    viewingRoomID: string,
    viewingRoomSlug: string,
    artworkID: string,
    artworkSlug: string
  ) => ({
    action: Schema.ActionNames.TappedArtworkGroup,
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
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 5 }
        cursor: { type: "String", defaultValue: "" }
      ) {
        internalID
        slug
        artworksConnection(first: $count, after: $cursor)
          @connection(key: "ViewingRoomArtworks_artworksConnection") {
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

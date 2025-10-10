import { ActionType, OwnerType } from "@artsy/cohesion"
import { Flex, Spacer, Spinner } from "@artsy/palette-mobile"
import { ArtistCard_artist$data } from "__generated__/ArtistCard_artist.graphql"
import { RecommendedArtistsRailFollowMutation } from "__generated__/RecommendedArtistsRailFollowMutation.graphql"
import { RecommendedArtistsRail_me$data } from "__generated__/RecommendedArtistsRail_me.graphql"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { RailScrollProps } from "app/Scenes/HomeView/Components/types"
import HomeAnalytics from "app/Scenes/HomeView/helpers/homeAnalytics"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import React, { memo, useImperativeHandle, useRef, useState } from "react"
import { FlatList, ViewProps } from "react-native"
import {
  commitMutation,
  createPaginationContainer,
  graphql,
  RelayPaginationProp,
} from "react-relay"
import { useTracking } from "react-tracking"
import { ArtistCard } from "./ArtistCard"

const MAX_ARTISTS = 20
const PAGE_SIZE = 6

interface RecommendedArtistsRailProps extends ViewProps {
  title: string
  subtitle?: string
  relay: RelayPaginationProp
  me: RecommendedArtistsRail_me$data
}

export const RecommendedArtistsRail: React.FC<RecommendedArtistsRailProps & RailScrollProps> = ({
  title,
  subtitle,
  relay,
  me,
  scrollRef,
}) => {
  const { trackEvent } = useTracking()

  const listRef = useRef<FlatList<any>>(null)
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const artists = extractNodes(me.artistRecommendations)

  const { hasMore, isLoading, loadMore } = relay
  const [loadingMoreData, setLoadingMoreData] = useState(false)

  const loadMoreArtists = () => {
    if (!hasMore() || isLoading() || artists.length >= MAX_ARTISTS) {
      return
    }

    setLoadingMoreData(true)

    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error(error.message)
      }

      setLoadingMoreData(false)
    })
  }

  if (!artists.length) {
    return null
  }

  const handleFollowChange = (artist: ArtistCard_artist$data) => {
    trackEvent(
      tracks.tapFollowOrUnfollowArtist(!!artist.isFollowed, artist.internalID, artist.slug)
    )

    followOrUnfollowArtist(artist)
  }

  return (
    <Flex>
      <SectionTitle title={title} subtitle={subtitle} mx={2} />

      <CardRailFlatList<ArtistCard_artist$data>
        listRef={listRef}
        data={artists as any}
        keyExtractor={(artist) => artist.id}
        initialNumToRender={3}
        onEndReached={loadMoreArtists}
        renderItem={({ item: artist, index }) => {
          return (
            <ArtistCard
              artist={artist}
              onPress={() => {
                trackEvent(tracks.tapArtistCard(artist.internalID, artist.slug, index))
              }}
              onFollow={() => {
                handleFollowChange(artist)
              }}
            />
          )
        }}
        ItemSeparatorComponent={() => <Spacer x="15px" />}
        ListFooterComponent={() =>
          loadingMoreData ? (
            <Flex justifyContent="center" ml={4} mr={6} height="200">
              <Spinner />
            </Flex>
          ) : (
            <Spacer x={2} />
          )
        }
      />
    </Flex>
  )
}

export const RecommendedArtistsRailFragmentContainer = memo(
  createPaginationContainer(
    RecommendedArtistsRail,
    {
      me: graphql`
        fragment RecommendedArtistsRail_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 3 }, cursor: { type: "String" }) {
          artistRecommendations(first: $count, after: $cursor)
            @connection(key: "RecommendedArtistsRail_artistRecommendations") {
            edges {
              node {
                name
                id
                ...ArtistCard_artist @relay(mask: false)
              }
            }
          }
        }
      `,
    },
    {
      getConnectionFromProps(props) {
        return props?.me?.artistRecommendations
      },
      getFragmentVariables(prevVars, totalCount) {
        return {
          ...prevVars,
          count: totalCount,
        }
      },
      getVariables(_props, { count, cursor }, fragmentVariables) {
        return {
          ...fragmentVariables,
          cursor,
          count,
        }
      },
      query: graphql`
        query RecommendedArtistsRailQuery($cursor: String, $count: Int!) {
          me {
            ...RecommendedArtistsRail_me @arguments(cursor: $cursor, count: $count)
          }
        }
      `,
    }
  )
)

export const tracks = {
  tapArtistCard: (artistID: string, artistSlug: string, index: number) =>
    HomeAnalytics.artistThumbnailTapEvent("SUGGESTIONS", artistID, artistSlug, index),
  tapFollowOrUnfollowArtist: (isFollowed: boolean, artistID: string, artistSlug: string) => ({
    action: isFollowed ? ActionType.unfollowedArtist : ActionType.followedArtist,
    contextModule: HomeAnalytics.artistRailContextModule("SUGGESTIONS"),
    contextScreenOwnerType: OwnerType.home,
    destinationScreenOwnerType: OwnerType.artist,
    destinationScreenOwnerId: artistID,
    destinationScreenOwnerSlug: artistSlug,
  }),
}

export const followOrUnfollowArtist = (followArtist: ArtistCard_artist$data) => {
  return new Promise<void>((resolve, reject) => {
    commitMutation<RecommendedArtistsRailFollowMutation>(getRelayEnvironment(), {
      mutation: graphql`
        mutation RecommendedArtistsRailFollowMutation($input: FollowArtistInput!) {
          followArtist(input: $input) {
            artist {
              id
              isFollowed
            }
          }
        }
      `,
      variables: {
        input: { artistID: followArtist.internalID, unfollow: followArtist.isFollowed },
      },
      onError: reject,
      // @ts-ignore RELAY 12 MIGRATION
      optimisticResponse: {
        followArtist: {
          artist: {
            id: followArtist.id,
            isFollowed: !followArtist.isFollowed,
          },
        },
      },
      onCompleted: (_response, errors) => {
        if (errors && errors.length > 0) {
          reject(new Error(JSON.stringify(errors)))
        } else {
          resolve()
        }
      },
    })
  })
}

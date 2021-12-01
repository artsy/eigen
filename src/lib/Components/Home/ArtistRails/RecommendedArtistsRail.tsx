import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import { RecommendedArtistsRail_me } from "__generated__/RecommendedArtistsRail_me.graphql"
import { RecommendedArtistsRailFollowMutation } from "__generated__/RecommendedArtistsRailFollowMutation.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { RailScrollProps } from "lib/Scenes/Home/Components/types"
import HomeAnalytics from "lib/Scenes/Home/homeAnalytics"
import { extractNodes } from "lib/utils/extractNodes"
import { Schema } from "lib/utils/track"
import { Flex, Spacer, Spinner } from "palette"
import React, { useImperativeHandle, useRef, useState } from "react"
import { FlatList, View, ViewProps } from "react-native"
import { commitMutation, createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { CARD_WIDTH } from "../CardRailCard"
import { CardRailFlatList, INTER_CARD_PADDING } from "../CardRailFlatList"
import { ArtistCard } from "./ArtistCard"

const MAX_ARTISTS = 20
const PAGE_SIZE = 3

interface RecommendedArtistsRailProps extends ViewProps {
  title: string
  subtitle?: string
  relay: RelayPaginationProp
  me: RecommendedArtistsRail_me
  mb?: number
}

export const RecommendedArtistsRail: React.FC<RecommendedArtistsRailProps & RailScrollProps> = ({
  title,
  subtitle,
  relay,
  me,
  scrollRef,
  mb,
}) => {
  const { trackEvent } = useTracking()

  const listRef = useRef<FlatList<any>>()
  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const { hasMore, isLoading, loadMore } = relay
  const [loadingMoreData, setLoadingMoreData] = useState(false)

  const artists = extractNodes(me.artistRecommendations)

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

  const followOrUnfollowArtist = (followArtist: ArtistCard_artist) => {
    return new Promise<void>((resolve, reject) => {
      commitMutation<RecommendedArtistsRailFollowMutation>(relay.environment, {
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
            console.log({ _response }, followArtist.id)
            trackEvent({
              name: "Follow artist",
              artist_id: followArtist.internalID,
              artist_slug: followArtist.slug,
              source_screen: "home page",
              context_module: "artist rail",
            })

            resolve()
          }
        },
      })
    })
  }

  const handleFollowChange = async (followArtist: ArtistCard_artist) => {
    trackEvent({
      action_name: Schema.ActionNames.HomeArtistRailFollow,
      action_type: Schema.ActionTypes.Tap,
      owner_id: followArtist.internalID,
      owner_slug: followArtist.id,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })
    try {
      await followOrUnfollowArtist(followArtist)
    } catch (error) {
      console.warn(error)
    }
  }

  return (
    <Flex mb={mb}>
      <Flex pl="2" pr="2">
        <SectionTitle title={title} subtitle={subtitle} />
      </Flex>
      <CardRailFlatList<ArtistCard_artist>
        listRef={listRef}
        data={artists as any}
        keyExtractor={(artist) => artist.id}
        onEndReached={loadMoreArtists}
        onEndReachedThreshold={0.1}
        // I noticed that sometimes FlatList seemed to get confused about where cards should be
        // and making this explicit fixes that.
        getItemLayout={(_data, index) => ({
          index,
          offset: index * (CARD_WIDTH + INTER_CARD_PADDING),
          length: CARD_WIDTH + INTER_CARD_PADDING,
        })}
        renderItem={({ item: artist, index }) => {
          return (
            <View style={{ flexDirection: "row" }}>
              <ArtistCard
                artist={artist as any}
                onPress={() =>
                  trackEvent(HomeAnalytics.artistThumbnailTapEvent("SUGGESTED", artist.internalID, artist.slug, index))
                }
                onFollow={() => handleFollowChange(artist)}
              />
            </View>
          )
        }}
        ItemSeparatorComponent={() => <Spacer width={15} />}
        ListFooterComponent={
          loadingMoreData ? (
            <Flex justifyContent="center" ml={3} mr={5} height="200">
              <Spinner />
            </Flex>
          ) : (
            <Spacer mr={2} />
          )
        }
      />
    </Flex>
  )
}

export const RecommendedArtistsRailFragmentContainer = createPaginationContainer(
  RecommendedArtistsRail,
  {
    me: graphql`
      fragment RecommendedArtistsRail_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        artistRecommendations(first: $count, after: $cursor)
          @connection(key: "RecommendedArtistsRail_artistRecommendations") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
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

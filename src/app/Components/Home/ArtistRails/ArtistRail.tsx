// TODO: This file still has a bunch of faffing with rendering a relay based version of ArtistCard and a plain React
//       version. In reality it should be updated to never render the React component but instead update the store and
//       let Relay re-render the cards.

import React, { useImperativeHandle, useRef, useState } from "react"
import { FlatList, View, ViewProps } from "react-native"
import {
  commitMutation,
  createFragmentContainer,
  fetchQuery,
  graphql,
  RelayProp,
} from "react-relay"

import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { useTracking } from "react-tracking"

import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import { ArtistRail_rail } from "__generated__/ArtistRail_rail.graphql"
import { ArtistRailFollowMutation } from "__generated__/ArtistRailFollowMutation.graphql"
import {
  ArtistRailNewSuggestionQuery,
  ArtistRailNewSuggestionQueryResponse,
} from "__generated__/ArtistRailNewSuggestionQuery.graphql"
import { Disappearable } from "app/Components/Disappearable"
import { SectionTitle } from "app/Components/SectionTitle"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { defaultArtistVariables } from "app/Scenes/Artist/Artist"
import { RailScrollProps } from "app/Scenes/Home/Components/types"
import { Schema } from "app/utils/track"
import { sample, uniq } from "lodash"
import { Flex } from "palette"
import { CARD_WIDTH } from "../CardRailCard"
import { CardRailFlatList, INTER_CARD_PADDING } from "../CardRailFlatList"
import { ArtistCard } from "./ArtistCard"

interface SuggestedArtist
  extends Pick<ArtistCard_artist, Exclude<keyof ArtistCard_artist, " $refType">> {
  _disappearable: Disappearable | null
}

interface Props extends ViewProps {
  title: string
  subtitle?: string
  relay: RelayProp
  rail: ArtistRail_rail
  mb?: number
}

const ArtistRail: React.FC<Props & RailScrollProps> = (props) => {
  const { trackEvent } = useTracking()
  const dismissedArtistIds = useRef<string[]>([])

  const listRef = useRef<FlatList<any>>()
  useImperativeHandle(props.scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const [artists, setArtists] = useState<SuggestedArtist[]>(
    props.rail.results?.map((a) => ({ ...a, _ref: null })) ?? ([] as any)
  )

  const fetchNewSuggestion = async (): Promise<SuggestedArtist | null> => {
    // try to find a followed artist to base the suggestion on, or just fall back to any artist in the rail
    const basedOnArtist = sample(artists.filter((a) => a.isFollowed)) ?? sample(artists)
    if (!basedOnArtist) {
      // this shouldn't happen unless the rail is empty somehow
      return null
    }
    try {
      const result = await fetchQuery<ArtistRailNewSuggestionQuery>(
        defaultEnvironment,
        graphql`
          query ArtistRailNewSuggestionQuery(
            $basedOnArtistId: String!
            $excludeArtistIDs: [String!]!
          ) {
            artist(id: $basedOnArtistId) {
              related {
                suggestedConnection(
                  excludeArtistIDs: $excludeArtistIDs
                  first: 1
                  excludeFollowedArtists: true
                  excludeArtistsWithoutForsaleArtworks: true
                ) {
                  edges {
                    node {
                      ...ArtistCard_artist @relay(mask: false)
                    }
                  }
                }
              }
            }
          }
        `,
        {
          excludeArtistIDs: uniq(
            artists.map((a) => a.internalID).concat(dismissedArtistIds.current)
          ),
          basedOnArtistId: basedOnArtist.internalID,
        }
      ).toPromise()

      const artist =
        (result as ArtistRailNewSuggestionQueryResponse).artist?.related?.suggestedConnection
          ?.edges?.[0]?.node ?? null

      return (
        artist && {
          ...artist,
          _disappearable: null,
          // make the basedOn for this suggestion fall back to either the artist this was actually based on (if followed)
          // or whatever _that_ artist suggestion was based on, if available. Transient basedOn!
          basedOn:
            artist.basedOn ??
            (basedOnArtist.isFollowed ? { name: basedOnArtist.name } : basedOnArtist.basedOn),
        }
      )
    } catch (e) {
      console.error(e)
      return null
    }
  }

  const followOrUnfollowArtist = (followArtist: SuggestedArtist) => {
    return new Promise<void>((resolve, reject) => {
      commitMutation<ArtistRailFollowMutation>(props.relay.environment, {
        mutation: graphql`
          mutation ArtistRailFollowMutation($input: FollowArtistInput!) {
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
            trackEvent({
              name: "Follow artist",
              artist_id: followArtist.internalID,
              artist_slug: followArtist.slug,
              source_screen: "home page",
              context_module: "artist rail",
            })
            // since we manage the artists array ourselves we can't rely on the relay cache to keep the isFollowed
            // field up-to-date.
            setArtists((_artists) =>
              _artists.map((a) => {
                if (a.internalID === followArtist.internalID) {
                  return { ...a, isFollowed: !followArtist.isFollowed }
                } else {
                  return a
                }
              })
            )
            resolve()
          }
        },
      })
    })
  }

  const handleFollowChange = async (followArtist: SuggestedArtist) => {
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

  const handleDismiss = async (artist: SuggestedArtist) => {
    dismissedArtistIds.current = uniq([artist.internalID].concat(dismissedArtistIds.current)).slice(
      0,
      100
    )

    await artist._disappearable?.disappear()
    setArtists((_artists) => _artists.filter((a) => a.internalID !== artist.internalID))

    const suggestion = await fetchNewSuggestion()
    if (suggestion) {
      // make sure we add suggestion in there before making the card disappear, so the suggestion slides in from the
      // right if you're dismissing the last item in the array
      setArtists((_artists) => _artists.concat([suggestion]))
      await nextTick()
    }

    setArtists((_artists) => _artists.filter((a) => a.internalID !== artist.internalID))
  }

  return artists.length ? (
    <Flex mb={props.mb}>
      <Flex pl="2" pr="2">
        <SectionTitle title={props.title} subtitle={props.subtitle} />
      </Flex>
      <CardRailFlatList<SuggestedArtist>
        prefetchUrlExtractor={(item) => item?.href!}
        prefetchVariablesExtractor={defaultArtistVariables}
        listRef={listRef}
        data={artists}
        keyExtractor={(artist) => artist.id}
        ItemSeparatorComponent={null}
        // I noticed that sometimes FlatList seemed to get confused about where cards should be
        // and making this explicit fixes that.
        getItemLayout={(_data, index) => ({
          index,
          offset: index * (CARD_WIDTH + INTER_CARD_PADDING),
          length: CARD_WIDTH + INTER_CARD_PADDING,
        })}
        renderItem={({ item: artist, index }) => {
          return (
            <Disappearable ref={(ref) => (artist._disappearable = ref)}>
              <View style={{ flexDirection: "row" }}>
                <ArtistCard
                  artist={artist as any}
                  onPress={() =>
                    trackEvent(
                      HomeAnalytics.artistThumbnailTapEvent(
                        props.rail.key,
                        artist.internalID,
                        artist.slug,
                        index
                      )
                    )
                  }
                  onFollow={() => handleFollowChange(artist)}
                  onDismiss={
                    props.rail.key === "SUGGESTED" ? undefined : () => handleDismiss(artist)
                  }
                />
                {index === artists.length - 1 ? null : (
                  <View style={{ width: INTER_CARD_PADDING }} />
                )}
              </View>
            </Disappearable>
          )
        }}
      />
    </Flex>
  ) : null
}

const nextTick = () => new Promise((resolve) => requestAnimationFrame(resolve))

export const ArtistRailFragmentContainer = createFragmentContainer(ArtistRail, {
  rail: graphql`
    fragment ArtistRail_rail on HomePageArtistModule {
      id
      key
      results {
        # We get data for the artist card from three different queries, and we can't
        # use data masking for two of them because relay GCs the masked data if not fetched via a fragment container
        # so let's just not use masking for all three to keep things simple.
        ...ArtistCard_artist @relay(mask: false)
      }
    }
  `,
})

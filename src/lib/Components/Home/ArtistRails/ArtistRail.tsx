// TODO: This file still has a bunch of faffing with rendering a relay based version of ArtistCard and a plain React
//       version. In reality it should be updated to never render the React component but instead update the store and
//       let Relay re-render the cards.

import React, { useImperativeHandle, useRef, useState } from "react"
import { FlatList, View, ViewProperties } from "react-native"
import { commitMutation, createFragmentContainer, fetchQuery, graphql, RelayProp } from "react-relay"

import HomeAnalytics from "lib/Scenes/Home/homeAnalytics"
import { useTracking } from "react-tracking"

import { Flex } from "@artsy/palette"
import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import { ArtistRail_rail } from "__generated__/ArtistRail_rail.graphql"
import { ArtistRailFollowMutation } from "__generated__/ArtistRailFollowMutation.graphql"
import { ArtistRailNewSuggestionQuery } from "__generated__/ArtistRailNewSuggestionQuery.graphql"
import { Disappearable } from "lib/Components/Disappearable"
import { SectionTitle } from "lib/Components/SectionTitle"
import { postEvent } from "lib/NativeModules/Events"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { RailScrollProps } from "lib/Scenes/Home/Components/types"
import { sample, uniq } from "lodash"
import { CARD_WIDTH } from "../CardRailCard"
import { CardRailFlatList, INTER_CARD_PADDING } from "../CardRailFlatList"
import { ArtistCard } from "./ArtistCard"

interface SuggestedArtist extends Pick<ArtistCard_artist, Exclude<keyof ArtistCard_artist, " $refType">> {
  _disappearable: Disappearable | null
}

interface Props extends ViewProperties {
  relay: RelayProp
  rail: ArtistRail_rail
}

const ArtistRail: React.FC<Props & RailScrollProps> = props => {
  const { trackEvent } = useTracking()
  const dismissedArtistIds = useRef<string[]>([])

  const listRef = useRef<FlatList<any>>()
  useImperativeHandle(props.scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: true }),
  }))

  const [artists, setArtists] = useState<SuggestedArtist[]>(
    props.rail.results?.map(a => ({ ...a, _ref: null })) ?? ([] as any)
  )

  const fetchNewSuggestion = async (): Promise<SuggestedArtist | null> => {
    // try to find a followed artist to base the suggestion on, or just fall back to any artist in the rail
    const basedOnArtist = sample(artists.filter(a => a.isFollowed)) ?? sample(artists)
    if (!basedOnArtist) {
      // this shouldn't happen unless the rail is empty somehow
      return null
    }
    try {
      const result = await fetchQuery<ArtistRailNewSuggestionQuery>(
        defaultEnvironment,
        graphql`
          query ArtistRailNewSuggestionQuery($basedOnArtistId: String!, $excludeArtistIDs: [String!]!) {
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
          excludeArtistIDs: uniq(artists.map(a => a.internalID).concat(dismissedArtistIds.current)),
          basedOnArtistId: basedOnArtist.internalID,
        }
      )
      const artist = result.artist?.related?.suggestedConnection?.edges?.[0]?.node ?? null
      return (
        artist && {
          ...artist,
          _disappearable: null,
          // make the basedOn for this suggestion fall back to either the artist this was actually based on (if followed)
          // or whatever _that_ artist suggestion was based on, if available. Transient basedOn!
          basedOn: artist.basedOn ?? (basedOnArtist.isFollowed ? { name: basedOnArtist.name } : basedOnArtist.basedOn),
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
                isFollowed
              }
            }
          }
        `,
        variables: {
          input: { artistID: followArtist.internalID, unfollow: followArtist.isFollowed },
        },
        onError: reject,
        onCompleted: (_response, errors) => {
          if (errors && errors.length > 0) {
            reject(new Error(JSON.stringify(errors)))
          } else {
            postEvent({
              name: "Follow artist",
              artist_id: followArtist.internalID,
              artist_slug: followArtist.slug,
              source_screen: "home page",
              context_module: "artist rail",
            })
            // since we manage the artists array ourselves we can't rely on the relay cache to keep the isFollowed
            // field up-to-date.
            setArtists(_artists =>
              _artists.map(a => {
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

  const handleFollowChange = async (
    followArtist: SuggestedArtist,
    completionHandler: (followStatus: boolean) => void
  ) => {
    const followEvent = HomeAnalytics.artistFollowTapEvent(props.rail, followArtist.internalID, followArtist.slug)
    trackEvent(followEvent)
    try {
      await followOrUnfollowArtist(followArtist)
      completionHandler(!followArtist.isFollowed)
    } catch (error) {
      console.warn(error)
      completionHandler(!!followArtist.isFollowed)
    }
  }

  const handleDismiss = async (artist: SuggestedArtist) => {
    dismissedArtistIds.current = uniq([artist.internalID].concat(dismissedArtistIds.current)).slice(0, 100)
    const suggestion = await fetchNewSuggestion()
    if (suggestion) {
      // make sure we add suggestion in there before making the card disappear, so the suggestion slides in from the
      // right if you're dismissing the last item in the array
      setArtists(_artists => _artists.concat([suggestion]))
      await nextTick()
    }
    await artist._disappearable?.disappear()
    setArtists(_artists => _artists.filter(a => a.internalID !== artist.internalID))
  }

  const title = (): string => {
    switch (props.rail.key) {
      case "TRENDING":
        return "Trending Artists on Artsy"
      case "SUGGESTED":
        return "Recommended Artists"
      case "POPULAR":
        return "Popular Artists on Artsy"
      default:
        console.error("Unrecognized artist rail key", props.rail.key)
        return "Recommended Artists"
    }
  }

  const subtitle = (): string | null => {
    switch (props.rail.key) {
      case "TRENDING":
        return null
      case "SUGGESTED":
        return "Based on artists you follow"
      case "POPULAR":
        return null
      default:
        return null
    }
  }

  return artists.length ? (
    <View>
      <Flex pl="2" pr="2">
        <SectionTitle title={title()} subtitle={subtitle()} />
      </Flex>
      <CardRailFlatList<SuggestedArtist>
        listRef={listRef}
        data={artists}
        keyExtractor={artist => artist.id}
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
            <Disappearable ref={ref => (artist._disappearable = ref)}>
              <View style={{ flexDirection: "row" }}>
                <ArtistCard
                  artist={artist as any}
                  onTap={() =>
                    trackEvent(HomeAnalytics.artistThumbnailTapEvent(props.rail, artist.internalID, artist.slug))
                  }
                  onFollow={completionHandler => handleFollowChange(artist, completionHandler)}
                  onDismiss={() => handleDismiss(artist)}
                  showBasedOn={props.rail.key === "SUGGESTED"}
                />
                {index === artists.length - 1 ? null : <View style={{ width: INTER_CARD_PADDING }} />}
              </View>
            </Disappearable>
          )
        }}
      />
    </View>
  ) : null
}

const nextTick = () => new Promise(resolve => requestAnimationFrame(resolve))

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

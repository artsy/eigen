// TODO: This file still has a bunch of faffing with rendering a relay based version of ArtistCard and a plain React
//       version. In reality it should be updated to never render the React component but instead update the store and
//       let Relay re-render the cards.

import React, { useImperativeHandle, useRef, useState } from "react"
import { FlatList, View, ViewProperties } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

import { useTracking } from "react-tracking"

import { Schema } from "lib/utils/track"
import { ArtistCard, ArtistCardContainer } from "./ArtistCard"

import { Flex, Spacer } from "@artsy/palette"
import { ArtistCard_artist } from "__generated__/ArtistCard_artist.graphql"
import { ArtistRail_rail } from "__generated__/ArtistRail_rail.graphql"
import { ArtistRailFollowMutation } from "__generated__/ArtistRailFollowMutation.graphql"
import { Disappearable } from "lib/Components/Disappearable"
import { SectionTitle } from "lib/Components/SectionTitle"
import { postEvent } from "lib/NativeModules/Events"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { RailScrollProps } from "lib/Scenes/Home/Components/types"
import { CardRailFlatList } from "../CardRailFlatList"

interface SuggestedArtist extends Pick<ArtistCard_artist, Exclude<keyof ArtistCard_artist, " $refType">> {
  _disappearable: Disappearable | null
}

interface Props extends ViewProperties {
  relay: RelayProp
  rail: ArtistRail_rail
}

const ArtistRail: React.FC<Props & RailScrollProps> = props => {
  const { trackEvent } = useTracking()

  const listRef = useRef<FlatList<any>>()
  useImperativeHandle(props.scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: true }),
  }))

  const [artists, setArtists] = useState<SuggestedArtist[]>(
    props.rail.results?.map(a => ({ ...a, _ref: null })) ?? ([] as any)
  )

  const followArtistAndFetchNewSuggestion = (followArtist: SuggestedArtist) => {
    return new Promise<SuggestedArtist | null>((resolve, reject) => {
      commitMutation<ArtistRailFollowMutation>(defaultEnvironment, {
        mutation: graphql`
          mutation ArtistRailFollowMutation($input: FollowArtistInput!, $excludeArtistIDs: [String]!) {
            followArtist(input: $input) {
              artist {
                related {
                  suggestedConnection(
                    first: 1
                    excludeArtistIDs: $excludeArtistIDs
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
          }
        `,
        variables: {
          input: { artistID: followArtist.internalID },
          excludeArtistIDs: artists.map(({ internalID }) => internalID),
        },
        onError: reject,
        onCompleted: (response, errors) => {
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

            const node = response.followArtist?.artist?.related?.suggestedConnection?.edges?.[0]?.node
            resolve(node ? { ...node, _disappearable: null } : null)
          }
        },
      })
    })
  }

  const handleFollowChange = async (
    followArtist: SuggestedArtist,
    completionHandler: (followStatus: boolean) => void
  ) => {
    trackEvent({
      action_name: Schema.ActionNames.HomeArtistRailFollow,
      action_type: Schema.ActionTypes.Tap,
      owner_id: followArtist.internalID,
      owner_slug: followArtist.id,
      owner_type: Schema.OwnerEntityTypes.Artist,
    })
    try {
      const suggestion = await followArtistAndFetchNewSuggestion(followArtist)
      completionHandler(true)
      if (suggestion) {
        // Add suggestion to end of array before disappearing previous item.
        // Makes for more smoother animation if you are at the end of the list
        setArtists(_artists => _artists.concat([suggestion]))
        await nextTick()
      }
      await followArtist._disappearable?.disappear()
      setArtists(_artists => _artists.filter(a => a.id !== followArtist.id))
    } catch (error) {
      console.warn(error)
      completionHandler(false)
    }
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

  const titleRef = useRef<Disappearable>(null)

  return artists.length ? (
    <View>
      <Flex pl="2" pr="2">
        <Disappearable ref={titleRef}>
          <SectionTitle title={title()} subtitle={subtitle()} onPress={() => titleRef.current?.disappear()} />
        </Disappearable>
      </Flex>
      <CardRailFlatList<SuggestedArtist>
        listRef={listRef}
        data={artists}
        keyExtractor={artist => artist.id}
        ItemSeparatorComponent={null}
        renderItem={({ item: artist, index }) => {
          return (
            <Disappearable ref={ref => (artist._disappearable = ref)}>
              <View style={{ flexDirection: "row" }}>
                {artist.hasOwnProperty("__fragments") ? (
                  <ArtistCardContainer
                    artist={artist as any}
                    onFollow={completionHandler => handleFollowChange(artist, completionHandler)}
                  />
                ) : (
                  <ArtistCard
                    artist={artist as any}
                    onFollow={completionHandler => handleFollowChange(artist, completionHandler)}
                  />
                )}
                {index === artists.length - 1 ? null : <Spacer mr="15px" />}
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
        id
        internalID
        ...ArtistCard_artist
      }
    }
  `,
})

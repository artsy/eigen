// TODO: This file still has a bunch of faffing with rendering a relay based version of ArtistCard and a plain React
//       version. In reality it should be updated to never render the React component but instead update the store and
//       let Relay re-render the cards.

import { Flex } from "@artsy/palette-mobile"
import { ArtistCard_artist$data } from "__generated__/ArtistCard_artist.graphql"
import { ArtistRailFollowMutation } from "__generated__/ArtistRailFollowMutation.graphql"
import { ArtistRail_rail$data } from "__generated__/ArtistRail_rail.graphql"
import { Disappearable } from "app/Components/Disappearable"
import { CARD_WIDTH } from "app/Components/Home/CardRailCard"
import { CardRailFlatList, INTER_CARD_PADDING } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { defaultArtistVariables } from "app/Scenes/Artist/Artist"
import { RailScrollProps } from "app/Scenes/Home/Components/types"
import HomeAnalytics from "app/Scenes/Home/homeAnalytics"
import { Schema } from "app/utils/track"
import React, { useImperativeHandle, useRef, useState } from "react"
import { FlatList, View, ViewProps } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtistCard } from "./ArtistCard"

interface SuggestedArtist
  extends Pick<ArtistCard_artist$data, Exclude<keyof ArtistCard_artist$data, " $refType">> {
  _disappearable: Disappearable | null
}

interface Props extends ViewProps {
  title: string
  subtitle?: string
  relay: RelayProp
  rail: ArtistRail_rail$data
}

const ArtistRail: React.FC<Props & RailScrollProps> = (props) => {
  const { trackEvent } = useTracking()

  const listRef = useRef<FlatList<any>>()
  useImperativeHandle(props.scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const [artists, setArtists] = useState<SuggestedArtist[]>(
    props.rail.results?.map((a) => ({ ...a, _ref: null })) ?? ([] as any)
  )

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

  return artists.length ? (
    <Flex>
      <Flex pl={2} pr={2}>
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
                  onPress={() => {
                    trackEvent(
                      HomeAnalytics.artistThumbnailTapEvent(
                        props.rail.key,
                        artist.internalID,
                        artist.slug,
                        index
                      )
                    )
                  }}
                  onFollow={() => handleFollowChange(artist)}
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

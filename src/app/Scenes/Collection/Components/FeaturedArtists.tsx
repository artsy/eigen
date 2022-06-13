import { FeaturedArtists_collection$data } from "__generated__/FeaturedArtists_collection.graphql"
import { ArtistListItemContainer as ArtistListItem } from "app/Components/ArtistListItem"
import { navigate } from "app/navigation/navigate"
import { Schema, Track, track as _track } from "app/utils/track"
import { ContextModules } from "app/utils/track/schema"
import { Box, Flex, Sans } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { TrackingProp } from "react-tracking"
import styled from "styled-components/native"

interface FeaturedArtistsProps {
  collection: FeaturedArtists_collection$data
  tracking?: TrackingProp
}

const track: Track<FeaturedArtistsProps, {}> = _track

@track()
export class FeaturedArtists extends React.Component<FeaturedArtistsProps, {}> {
  getFeaturedArtistEntityCollection = (
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    artists: FeaturedArtists_collection$data["artworksConnection"]["merchandisableArtists"]
  ) => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    return artists.map((artist) => {
      return (
        <Box width="100%" key={artist.internalID} pb={20}>
          <ArtistListItem artist={artist} contextModule={ContextModules.FeaturedArtists} />
        </Box>
      )
    })
  }

  getFeaturedArtists = () => {
    const allArtists = this.props.collection?.artworksConnection?.merchandisableArtists || []
    const featuredArtistExclusionIds = this.props.collection?.featuredArtistExclusionIds || []
    const artistIDs = this.props.collection?.query?.artistIDs || []

    if (artistIDs.length > 0) {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return allArtists.filter((artist) => artistIDs.includes(artist.internalID))
    }

    if (featuredArtistExclusionIds.length > 0) {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return allArtists.filter((artist) => !featuredArtistExclusionIds.includes(artist.internalID))
    }
    return allArtists
  }

  render() {
    const artists = this.getFeaturedArtists()
    if (artists.length <= 0) {
      return null
    }

    const hasMultipleArtists = artists.length > 1

    const artistCount = 3
    const truncatedArtists = this.getFeaturedArtistEntityCollection(artists).slice(0, artistCount)
    const headlineLabel = "Featured Artist" + (hasMultipleArtists ? "s" : "")
    const { tracking } = this.props

    return (
      <Box pb={1}>
        <Flex justifyContent="space-between" pb={15} flexDirection="row">
          <Sans size="4">{headlineLabel}</Sans>
          {artists.length > artistCount && (
            <TouchableOpacity
              onPress={() => {
                navigate(`/collection/${this.props.collection.slug}/artists`)
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                tracking.trackEvent({
                  action_type: Schema.ActionTypes.Tap,
                  action_name: Schema.ActionNames.ViewMore,
                  context_screen: Schema.PageNames.Collection,
                  context_module: Schema.ContextModules.FeaturedArtists,
                  flow: Schema.Flow.FeaturedArtists,
                })
              }}
            >
              <ViewAll size="4" color="black60">
                View all
              </ViewAll>
            </TouchableOpacity>
          )}
        </Flex>
        <Flex flexWrap="wrap">{truncatedArtists}</Flex>
      </Box>
    )
  }
}

export const CollectionFeaturedArtistsContainer = createFragmentContainer(FeaturedArtists, {
  collection: graphql`
    fragment FeaturedArtists_collection on MarketingCollection {
      slug
      artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 0, sort: "-decayed_merch") {
        merchandisableArtists(size: 4) {
          internalID
          ...ArtistListItem_artist
        }
      }
      query {
        artistIDs
      }
      featuredArtistExclusionIds
    }
  `,
})

export const ViewAll = styled(Sans)`
  text-align: center;
`

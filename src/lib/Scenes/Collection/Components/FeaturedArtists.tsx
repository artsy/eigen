import { Box, Button, EntityHeader, Flex, Sans } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { TouchableHighlight, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface FeaturedArtistsProps {
  featuredArtists: any
}

interface FeaturedArtistsState {
  showMore: boolean
}

export class FeaturedArtists extends React.Component<FeaturedArtistsProps, FeaturedArtistsState> {
  state = {
    showMore: false,
  }

  handleTap = (context: any, href: string) => {
    SwitchBoard.presentNavigationViewController(context, href)
  }

  getFeaturedArtistEntityCollection = (artists: any) => {
    return artists.map((artist, index) => {
      const hasArtistMetaData = artist.nationality && artist.birthday
      return (
        <Box width="100%" key={index} pb={20}>
          <TouchableWithoutFeedback onPress={() => this.handleTap(this, `/artist/${artist.slug}`)}>
            <EntityHeader
              imageUrl={artist.imageUrl}
              name={artist.name}
              meta={hasArtistMetaData ? `${artist.nationality}, b. ${artist.birthday}` : undefined}
              href={`/artist/${artist.slug}`}
              FollowButton={
                <Button
                  variant={artist.isfollowed ? "primaryBlack" : "secondaryOutline"}
                  size="small"
                  longestText="Following"
                >
                  {artist.isfollowed ? "Following" : "Follow"}
                </Button>
              }
            />
          </TouchableWithoutFeedback>
        </Box>
      )
    })
  }

  render() {
    const { featuredArtists } = this.props
    const artists = featuredArtists.artworksConnection.merchandisableArtists
    const hasMultipleArtists = artists.length > 1
    const artistCount = 3
    const remainingCount = artists.length - artistCount
    const truncatedArtists = this.getFeaturedArtistEntityCollection(artists).slice(0, artistCount)
    const headlineLabel = "Featured Artist" + (hasMultipleArtists ? "s" : "")

    return (
      <Box pb={1}>
        <Sans size="2" weight="medium" pb={15}>
          {headlineLabel}
        </Sans>
        <Flex flexWrap="wrap">
          {this.state.showMore || featuredArtists.length <= artistCount ? (
            this.getFeaturedArtistEntityCollection(artists)
          ) : (
            <>
              {truncatedArtists}
              <TouchableHighlight
                onPress={() => {
                  this.setState({ showMore: true })
                }}
              >
                <EntityHeader initials={`+ ${remainingCount}`} name="View more" />
              </TouchableHighlight>
            </>
          )}
        </Flex>
      </Box>
    )
  }
}

export const CollectionFeaturedArtistsContainer = createFragmentContainer(FeaturedArtists, {
  featuredArtists: graphql`
    fragment FeaturedArtists_featuredArtists on MarketingCollection {
      artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 9, sort: "-decayed_merch") {
        merchandisableArtists {
          slug
          internalID
          name
          imageUrl
          birthday
          nationality
          isFollowed
        }
      }
    }
  `,
})

// artworks: graphql`
//     fragment Collection_artworks on MarketingCollection {
//       artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 20, sort: "-decayed_merch") {
//         # ...FeaturedArtists_featuredArtists
//         merchandisableArtists {
//           slug
//           internalID
//           name
//           imageUrl
//           birthday
//           nationality
//         }
//       }
//     }
//   `,

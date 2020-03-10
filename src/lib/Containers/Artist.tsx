import { Flex, Separator, Spacer, Theme } from "@artsy/palette"
import { Artist_artist } from "__generated__/Artist_artist.graphql"
import { ArtistQuery, ArtistQueryVariables } from "__generated__/ArtistQuery.graphql"
import ArtistAbout from "lib/Components/Artist/ArtistAbout"
import ArtistArtworks from "lib/Components/Artist/ArtistArtworks"
import ArtistHeader from "lib/Components/Artist/ArtistHeader"
import ArtistShows from "lib/Components/Artist/ArtistShows"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox, PlaceholderImage, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { track } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { ViewProperties } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface Props extends ViewProperties {
  artist: Artist_artist
}

// screen views are tracked in eigen
@track()
export class Artist extends React.Component<Props> {
  render() {
    const { artist } = this.props
    const tabs = []
    const displayAboutSection = artist.has_metadata || artist.counts.articles > 0 || artist.counts.related_artists > 0

    if (displayAboutSection) {
      tabs.push({
        title: "About",
        content: <ArtistAbout artist={artist} />,
      })
    }

    if (artist.counts.artworks) {
      tabs.push({
        title: "Artworks",
        initial: true,
        content: <ArtistArtworks artist={artist} />,
      })
    }

    if (artist.counts.partner_shows) {
      tabs.push({
        title: "Shows",
        content: <ArtistShows artist={artist} />,
      })
    }

    return (
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <StickyTabPage headerContent={<ArtistHeader artist={artist} />} tabs={tabs} />
          </Flex>
        </ProvideScreenDimensions>
      </Theme>
    )
  }
}

export const ArtistFragmentContainer = createFragmentContainer(Artist, {
  artist: graphql`
    fragment Artist_artist on Artist {
      internalID
      slug
      has_metadata: hasMetadata
      counts {
        artworks
        partner_shows: partnerShows
        related_artists: relatedArtists
        articles
      }
      ...ArtistHeader_artist
      ...ArtistAbout_artist
      ...ArtistShows_artist
      ...ArtistArtworks_artist
    }
  `,
})

export const ArtistQueryRenderer: React.SFC<ArtistQueryVariables> = ({ artistID, isPad }) => {
  return (
    <QueryRenderer<ArtistQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtistQuery($artistID: String!, $isPad: Boolean!) {
          artist(id: $artistID) {
            ...Artist_artist
          }
        }
      `}
      variables={{ artistID, isPad }}
      render={renderWithPlaceholder({
        Container: ArtistFragmentContainer,
        renderPlaceholder: () => <ArtistPlaceholder />,
      })}
    />
  )
}

const ArtistPlaceholder: React.FC = () => (
  <Theme>
    <Flex>
      <Flex alignItems="center">
        <Spacer mb={45} />
        {/* artist name */}
        <PlaceholderText width={120} />
        <Spacer mb={1} />
        {/* birthday, followers */}
        <PlaceholderText width={150} />
      </Flex>
      <Spacer mb={1} />
      {/* follow buton */}
      <PlaceholderBox height={42} marginHorizontal={20} />
      <Spacer mb={3} />
      {/* tabs */}
      <Flex justifyContent="space-around" flexDirection="row" px={2}>
        <PlaceholderText width={40} />
        <PlaceholderText width={50} />
        <PlaceholderText width={40} />
      </Flex>
      <Spacer mb={1} />
      <Separator />
      <Spacer mb={3} />
      {/* masonry grid */}
      <Flex mx={2} flexDirection="row">
        <Flex mr={1} style={{ flex: 1 }}>
          <PlaceholderImage height={92} />
          <PlaceholderImage height={172} />
          <PlaceholderImage height={82} />
        </Flex>
        <Flex ml={1} style={{ flex: 1 }}>
          <PlaceholderImage height={182} />
          <PlaceholderImage height={132} />
          <PlaceholderImage height={86} />
        </Flex>
      </Flex>
    </Flex>
  </Theme>
)

import {
  ArtistAboveTheFoldQuery,
  ArtistAboveTheFoldQueryVariables,
} from "__generated__/ArtistAboveTheFoldQuery.graphql"
import {
  ArtistBelowTheFoldQuery,
  ArtistBelowTheFoldQueryVariables,
} from "__generated__/ArtistBelowTheFoldQuery.graphql"
import ArtistAbout from "lib/Components/Artist/ArtistAbout"
import ArtistArtworks from "lib/Components/Artist/ArtistArtworks/ArtistArtworks"
import ArtistHeader from "lib/Components/Artist/ArtistHeader"
import ArtistShows from "lib/Components/Artist/ArtistShows/ArtistShows"
import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AboveTheFoldQueryRenderer } from "lib/utils/AboveTheFoldQueryRenderer"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { Flex, Message } from "palette"
import React from "react"
import { ActivityIndicator, View } from "react-native"
import { graphql } from "react-relay"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"

export const Artist: React.FC<{
  artistAboveTheFold: NonNullable<ArtistAboveTheFoldQuery["response"]["artist"]>
  artistBelowTheFold?: ArtistBelowTheFoldQuery["response"]["artist"]
}> = ({ artistAboveTheFold, artistBelowTheFold }) => {
  const tabs = []
  const displayAboutSection =
    artistAboveTheFold.has_metadata ||
    (artistAboveTheFold.counts?.articles ?? 0) > 0 ||
    (artistAboveTheFold.counts?.related_artists ?? 0) > 0

  if (displayAboutSection) {
    tabs.push({
      title: "About",
      content: artistBelowTheFold ? <ArtistAbout artist={artistBelowTheFold} /> : <LoadingPage />,
    })
  }

  if ((artistAboveTheFold.counts?.artworks ?? 0) > 0) {
    tabs.push({
      title: "Artworks",
      initial: true,
      content: <ArtistArtworks artist={artistAboveTheFold} />,
    })
  }

  if ((artistAboveTheFold.counts?.partner_shows ?? 0) > 0) {
    tabs.push({
      title: "Shows",
      content: artistBelowTheFold ? <ArtistShows artist={artistBelowTheFold} /> : <LoadingPage />,
    })
  }

  if (tabs.length === 0) {
    tabs.push({
      title: "Artworks",
      content: (
        <StickyTabPageScrollView>
          <Message>
            There aren’t any works available by the artist at this time. Follow to receive notifications when new works
            are added.
          </Message>
        </StickyTabPageScrollView>
      ),
    })
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen_owner_slug: artistAboveTheFold.slug,
        context_screen_owner_id: artistAboveTheFold.internalID,
      }}
    >
      <Flex style={{ flex: 1 }}>
        <StickyTabPage staticHeaderContent={<ArtistHeader artist={artistAboveTheFold!} />} tabs={tabs} />
      </Flex>
    </ProvideScreenTracking>
  )
}

interface ArtistQueryRendererProps extends ArtistAboveTheFoldQueryVariables, ArtistBelowTheFoldQueryVariables {
  environment?: RelayModernEnvironment
}

export const ArtistQueryRenderer: React.SFC<ArtistQueryRendererProps> = ({ artistID, isPad, environment }) => {
  return (
    <AboveTheFoldQueryRenderer<ArtistAboveTheFoldQuery, ArtistBelowTheFoldQuery>
      environment={environment || defaultEnvironment}
      above={{
        query: graphql`
          query ArtistAboveTheFoldQuery($artistID: String!) {
            artist(id: $artistID) {
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
              ...ArtistArtworks_artist
            }
          }
        `,
        variables: { artistID },
      }}
      below={{
        query: graphql`
          query ArtistBelowTheFoldQuery($artistID: String!, $isPad: Boolean!) {
            artist(id: $artistID) {
              ...ArtistAbout_artist
              ...ArtistShows_artist
            }
          }
        `,
        variables: { artistID, isPad },
      }}
      render={{
        renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
        renderComponent: ({ above, below }) => {
          if (!above.artist) {
            throw new Error("no artist data")
          }
          return <Artist artistAboveTheFold={above.artist} artistBelowTheFold={below?.artist} />
        },
      }}
    />
  )
}

/**
 * Be lazy and just have a simple loading spinner for the below-the-fold tabs
 * (as opposed to nice fancy placeholder screens) since people are really
 * unlikely to tap into them quick enough to see the loading state
 * @param param0
 */
const LoadingPage: React.FC<{}> = ({}) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <ActivityIndicator />
    </View>
  )
}

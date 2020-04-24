import { Flex, Separator, Spacer, Theme } from "@artsy/palette"
import {
  ArtistAboveTheFoldQuery,
  ArtistAboveTheFoldQueryVariables,
} from "__generated__/ArtistAboveTheFoldQuery.graphql"
import {
  ArtistBelowTheFoldQuery,
  ArtistBelowTheFoldQueryVariables,
} from "__generated__/ArtistBelowTheFoldQuery.graphql"
import ArtistAbout from "lib/Components/Artist/ArtistAbout"
import ArtistArtworks from "lib/Components/Artist/ArtistArtworks"
import ArtistHeader from "lib/Components/Artist/ArtistHeader"
import ArtistShows from "lib/Components/Artist/ArtistShows"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AboveTheFoldQueryRenderer } from "lib/utils/AboveTheFoldQueryRenderer"
import { PlaceholderButton, PlaceholderImage, PlaceholderText } from "lib/utils/placeholders"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { ActivityIndicator, View } from "react-native"
import { graphql } from "react-relay"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"

export const Artist: React.FC<{
  artistAboveTheFold: ArtistAboveTheFoldQuery["response"]["artist"] | null
  artistBelowTheFold: ArtistBelowTheFoldQuery["response"]["artist"] | null
}> = ({ artistAboveTheFold, artistBelowTheFold }) => {
  const tabs = []
  const displayAboutSection =
    // @ts-ignore STRICTNESS_MIGRATION
    artistAboveTheFold.has_metadata ||
    // @ts-ignore STRICTNESS_MIGRATION
    artistAboveTheFold.counts.articles > 0 ||
    // @ts-ignore STRICTNESS_MIGRATION
    artistAboveTheFold.counts.related_artists > 0

  if (displayAboutSection) {
    tabs.push({
      title: "About",
      content: artistBelowTheFold ? <ArtistAbout artist={artistBelowTheFold} /> : <LoadingPage />,
    })
  }

  // @ts-ignore STRICTNESS_MIGRATION
  if (artistAboveTheFold.counts.artworks) {
    tabs.push({
      title: "Artworks",
      initial: true,
      // @ts-ignore STRICTNESS_MIGRATION
      content: <ArtistArtworks artist={artistAboveTheFold} />,
    })
  }

  // @ts-ignore STRICTNESS_MIGRATION
  if (artistAboveTheFold.counts.partner_shows) {
    tabs.push({
      title: "Shows",
      content: artistBelowTheFold ? <ArtistShows artist={artistBelowTheFold} /> : <LoadingPage />,
    })
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        // @ts-ignore STRICTNESS_MIGRATION
        context_screen_owner_slug: artistAboveTheFold.slug,
        // @ts-ignore STRICTNESS_MIGRATION
        context_screen_owner_id: artistAboveTheFold.internalID,
      }}
    >
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <StickyTabPage
              headerContent={
                <ArtistHeader
                  // @ts-ignore STRICTNESS_MIGRATION
                  artist={artistAboveTheFold}
                />
              }
              tabs={tabs}
            />
          </Flex>
        </ProvideScreenDimensions>
      </Theme>
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
        renderPlaceholder: () => <ArtistPlaceholder />,
        renderComponent: ({ above, below }) => (
          // @ts-ignore STRICTNESS_MIGRATION
          <Artist artistAboveTheFold={above.artist} artistBelowTheFold={below?.artist} />
        ),
      }}
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
      <PlaceholderButton marginHorizontal={20} />
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

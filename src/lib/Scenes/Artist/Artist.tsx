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
import { getCurrentEmissionState } from "lib/store/AppStore"
import { AboveTheFoldQueryRenderer } from "lib/utils/AboveTheFoldQueryRenderer"
import { isPad } from "lib/utils/hardware"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { Flex, Message } from "palette"
import React from "react"
import { ActivityIndicator, View } from "react-native"
import { graphql } from "react-relay"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { ArtistAboveTheFoldQueryResponse } from "../../../__generated__/ArtistAboveTheFoldQuery.graphql"
import { ArtistBelowTheFoldQueryResponse } from "../../../__generated__/ArtistBelowTheFoldQuery.graphql"
import { ArtistInsightsFragmentContainer } from "../../Components/Artist/ArtistInsights/ArtistInsights"

interface Props {
  artist: NonNullable<ArtistAboveTheFoldQueryResponse["artist"]>
  belowTheFold: ArtistBelowTheFoldQueryResponse | null
}
// export const Artist: React.FC<{
//   aboveTheFold: NonNullable<aboveTheFoldQuery["response"]["artist"]>
//   belowTheFold?: belowTheFoldQuery["response"]["artist"]
// }> = ({ aboveTheFold, belowTheFold }) => {
export const Artist: React.FC<Props> = ({ artist, belowTheFold }) => {
  const tabs = []
  const displayAboutSection =
    artist.has_metadata || (artist.counts?.articles ?? 0) > 0 || (artist.counts?.related_artists ?? 0) > 0

  if (displayAboutSection) {
    tabs.push({
      title: "About",
      content: belowTheFold?.artist ? <ArtistAbout artist={belowTheFold.artist} /> : <LoadingPage />,
    })
  }

  if ((artist.counts?.artworks ?? 0) > 0) {
    tabs.push({
      title: "Artworks",
      initial: false, // TODO: To revert
      content: <ArtistArtworks artist={artist} />,
    })
  }

  if ((artist.counts?.partner_shows ?? 0) > 0) {
    tabs.push({
      title: "Shows",
      content: belowTheFold?.artist ? <ArtistShows artist={belowTheFold.artist} /> : <LoadingPage />,
    })
  }

  console.log({ belowTheFold })
  const isArtistInsightsEnabled = getCurrentEmissionState().options.AROptionsNewInsightsPage
  if (isArtistInsightsEnabled) {
    tabs.push({
      title: "Insights",
      initial: true, // TODO: To remove
      content: belowTheFold?.marketPriceInsights ? (
        <ArtistInsightsFragmentContainer marketPriceInsights={belowTheFold.marketPriceInsights} />
      ) : (
        <LoadingPage />
      ),
    })
  }

  if ((!isArtistInsightsEnabled && tabs.length === 0) || (isArtistInsightsEnabled && tabs.length === 1)) {
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
        context_screen_owner_slug: artist.slug,
        context_screen_owner_id: artist.internalID,
      }}
    >
      <Flex style={{ flex: 1 }}>
        <StickyTabPage staticHeaderContent={<ArtistHeader artist={artist!} />} tabs={tabs} />
      </Flex>
    </ProvideScreenTracking>
  )
}

interface ArtistQueryRendererProps extends ArtistAboveTheFoldQueryVariables, ArtistBelowTheFoldQueryVariables {
  environment?: RelayModernEnvironment
}

export const ArtistQueryRenderer: React.FC<ArtistQueryRendererProps> = ({ artistID, environment }) => {
  console.log({ artistID })
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
          query ArtistBelowTheFoldQuery($artistID: String!, $id: ID!, $isPad: Boolean!) {
            artist(id: $artistID) {
              ...ArtistAbout_artist
              ...ArtistShows_artist
            }
            marketPriceInsights(artistId: $artistID, medium: "painting") {
              ...ArtistInsights_marketPriceInsights
            }
          }
        `,
        variables: { artistID, id: artistID, isPad: isPad() },
      }}
      render={{
        renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
        renderComponent: ({ above, below }) => {
          if (!above.artist) {
            throw new Error("no artist data")
          }
          return <Artist artist={above.artist} belowTheFold={below} />
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

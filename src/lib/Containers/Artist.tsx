import { Flex, Separator, Spacer, Theme } from "@artsy/palette"
import { captureMessage, withScope } from "@sentry/react-native"
import { ArtistAboveTheFoldQuery } from "__generated__/ArtistAboveTheFoldQuery.graphql"
import { ArtistBelowTheFoldQuery } from "__generated__/ArtistBelowTheFoldQuery.graphql"
import {
  ArtistFullQuery,
  ArtistFullQueryResponse,
  ArtistFullQueryVariables,
} from "__generated__/ArtistFullQuery.graphql"
import { ArtistQuery, ArtistQueryResponse, ArtistQueryVariables } from "__generated__/ArtistQuery.graphql"
import ArtistAbout from "lib/Components/Artist/ArtistAbout"
import ArtistArtworks from "lib/Components/Artist/ArtistArtworks"
import ArtistHeader from "lib/Components/Artist/ArtistHeader"
import ArtistShows from "lib/Components/Artist/ArtistShows"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AboveTheFoldQueryRenderer } from "lib/utils/AboveTheFoldQueryRenderer"
import { PlaceholderBox, PlaceholderImage, PlaceholderText, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideTracking } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect, useMemo, useState } from "react"
import { createFragmentContainer, fetchQuery, graphql, QueryRenderer, RelayProp } from "react-relay"

export const Artist: React.FC<{
  artistAboveTheFold: ArtistAboveTheFoldQuery["response"]["artist"] | null
  artistBelowTheFold: ArtistBelowTheFoldQuery["response"]["artist"] | null
}> = ({ artistAboveTheFold, artistBelowTheFold }) => {
  if (!artistAboveTheFold) {
    return <ArtistPlaceholder />
  }

  const tabs = []
  const displayAboutSection =
    artistAboveTheFold.has_metadata ||
    artistAboveTheFold.counts.articles > 0 ||
    artistAboveTheFold.counts.related_artists > 0

  if (displayAboutSection) {
    tabs.push({
      title: "About",
      content: artistBelowTheFold ? <ArtistAbout artist={artistBelowTheFold} /> : <ArtistAboutPlaceholder />,
    })
  }

  if (artistAboveTheFold.counts.artworks) {
    tabs.push({
      title: "Artworks",
      initial: true,
      content: <ArtistArtworks artist={artistAboveTheFold} />,
    })
  }

  if (artistAboveTheFold.counts.partner_shows) {
    tabs.push({
      title: "Shows",
      content: artistBelowTheFold ? <ArtistShows artist={artistBelowTheFold} /> : <ArtistShowsPlaceholder />,
    })
  }

  return (
    <ProvideTracking>
      <Theme>
        <ProvideScreenDimensions>
          <Flex style={{ flex: 1 }}>
            <StickyTabPage headerContent={<ArtistHeader artist={artistAboveTheFold} />} tabs={tabs} />
          </Flex>
        </ProvideScreenDimensions>
      </Theme>
    </ProvideTracking>
  )
}

export const ArtistQueryRenderer: React.SFC<ArtistQueryVariables & ArtistFullQueryVariables> = ({
  artistID,
  isPad,
}) => {
  return (
    <AboveTheFoldQueryRenderer<ArtistAboveTheFoldQuery, ArtistBelowTheFoldQuery>
      environment={defaultEnvironment}
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
          <Artist artistAboveTheFold={above.artist} artistBelowTheFold={below?.artist} />
        ),
      }}
    />
  )
  // return (
  //   <QueryRenderer<ArtistQuery>
  //     environment={defaultEnvironment}
  //     query={graphql`
  //       query ArtistQuery($artistID: String!) {
  //         artist(id: $artistID) {
  //           ...Artist_artistAboveTheFold
  //         }
  //       }
  //     `}
  //     variables={{ artistID }}
  //     render={renderWithPlaceholder<ArtistQueryResponse>({
  //       Container,
  //       renderPlaceholder: () => <ArtistPlaceholder />,
  //     })}
  //   />
  // )
}

const ArtistPlaceholder: React.FC = () => (
  <ProvidePlaceholderContext>
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
  </ProvidePlaceholderContext>
)

const ArtistAboutPlaceholder: React.FC = () => {
  return null
}
const ArtistShowsPlaceholder: React.FC = () => {
  return null
}

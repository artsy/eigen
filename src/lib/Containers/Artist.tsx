import { Flex, Separator, Spacer, Theme } from "@artsy/palette"
import { captureMessage, withScope } from "@sentry/react-native"
import { Artist_artistAboveTheFold } from "__generated__/Artist_artistAboveTheFold.graphql"
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
import { PlaceholderBox, PlaceholderImage, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideTracking } from "lib/utils/track"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect, useMemo, useState } from "react"
import { createFragmentContainer, fetchQuery, graphql, QueryRenderer, RelayProp } from "react-relay"

export const Artist: React.FC<{
  artistAboveTheFold: Artist_artistAboveTheFold
  relay: RelayProp
  isPad: boolean
}> = ({ artistAboveTheFold, relay, isPad }) => {
  const [artistFull, setArtistFull] = useState<null | ArtistFullQueryResponse["artist"]>(null)
  useEffect(() => {
    fetchQuery<ArtistFullQuery>(
      relay.environment,
      graphql`
        query ArtistFullQuery($artistID: String!, $isPad: Boolean!) {
          artist(id: $artistID) {
            ...Artist_artistAboveTheFold
            ...ArtistAbout_artist
            ...ArtistShows_artist
          }
        }
      `,
      {
        artistID: artistAboveTheFold.internalID,
        isPad,
      }
    )
      .then(result => {
        if ("errors" in result) {
          throw new Error((result as any).errors)
        }
        setArtistFull(result.artist)
      })
      .catch(error => {
        if (__DEV__) {
          console.error(`Couldn't fetch full artist`, error)
        } else {
          withScope(scope => {
            scope.setExtra("slug", artistAboveTheFold.slug)
            scope.setExtra("stack", error.stack)
            captureMessage("couldn't fetch full artist")
          })
        }
      })
  }, [])

  const tabs = []
  const displayAboutSection =
    artistAboveTheFold.has_metadata ||
    artistAboveTheFold.counts.articles > 0 ||
    artistAboveTheFold.counts.related_artists > 0

  if (displayAboutSection) {
    tabs.push({
      title: "About",
      content: artistFull ? <ArtistAbout artist={artistFull} /> : <ArtistAboutPlaceholder />,
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
      content: artistFull ? <ArtistShows artist={artistFull} /> : <ArtistShowsPlaceholder />,
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

export const ArtistFragmentContainer = createFragmentContainer(Artist, {
  artistAboveTheFold: graphql`
    fragment Artist_artistAboveTheFold on Artist {
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
  `,
})

export const ArtistQueryRenderer: React.SFC<ArtistQueryVariables & ArtistFullQueryVariables> = ({
  artistID,
  isPad,
}) => {
  const Container = useMemo(() => {
    return ({ artist }) => <ArtistFragmentContainer artistAboveTheFold={artist} isPad={isPad} />
  }, [isPad])
  return (
    <QueryRenderer<ArtistQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtistQuery($artistID: String!) {
          artist(id: $artistID) {
            ...Artist_artistAboveTheFold
          }
        }
      `}
      variables={{ artistID }}
      render={renderWithPlaceholder<ArtistQueryResponse>({
        Container,
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

const ArtistAboutPlaceholder: React.FC = () => {
  return null
}
const ArtistShowsPlaceholder: React.FC = () => {
  return null
}

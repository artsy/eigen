import { MockRelayRendererFixtures_artist } from "__generated__/MockRelayRendererFixtures_artist.graphql"
import { MockRelayRendererFixtures_artwork } from "__generated__/MockRelayRendererFixtures_artwork.graphql"
import { MockRelayRendererFixtures_artworkMetadata } from "__generated__/MockRelayRendererFixtures_artworkMetadata.graphql"
import { MockRelayRendererFixturesArtistQuery } from "__generated__/MockRelayRendererFixturesArtistQuery.graphql"
import cheerio from "cheerio"
import { render } from "enzyme"
import * as React from "react"
import { Image, Text, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ContextConsumer } from "../../utils/Context"
import renderWithLoadProgress from "../../utils/renderWithLoadProgress"

const Metadata = createFragmentContainer(
  (props: { artworkMetadata: MockRelayRendererFixtures_artworkMetadata }) => <Text>{props.artworkMetadata.title}</Text>,
  {
    artworkMetadata: graphql`
      fragment MockRelayRendererFixtures_artworkMetadata on Artwork {
        title
      }
    `,
  }
)

export const Artwork = createFragmentContainer(
  (props: { artwork: MockRelayRendererFixtures_artwork }) => (
    <View>
      <Image source={{ uri: props.artwork.image.url }} />
      <Metadata artworkMetadata={props.artwork} />
      {/* FIXME: Should this be a slug? */}
      {props.artwork.artist && <ArtistQueryRenderer id={props.artwork.artist.slug} />}
    </View>
  ),
  {
    artwork: graphql`
      fragment MockRelayRendererFixtures_artwork on Artwork {
        image {
          url
        }
        artist {
          slug
        }
        ...MockRelayRendererFixtures_artworkMetadata
      }
    `,
  }
)

const Artist = createFragmentContainer(
  (props: { artist: MockRelayRendererFixtures_artist }) => <Text>{props.artist.name}</Text>,
  {
    artist: graphql`
      fragment MockRelayRendererFixtures_artist on Artist {
        name
      }
    `,
  }
)

const ArtistQueryRenderer = (props: { id: string }) => (
  <ContextConsumer>
    {({ relayEnvironment }) => {
      return (
        <QueryRenderer<MockRelayRendererFixturesArtistQuery>
          environment={relayEnvironment}
          variables={props}
          query={graphql`
            query MockRelayRendererFixturesArtistQuery($id: String!) {
              artist(id: $id) {
                ...MockRelayRendererFixtures_artist
              }
            }
          `}
          render={renderWithLoadProgress(Artist)}
        />
      )
    }}
  </ContextConsumer>
)

export const query = graphql`
  query MockRelayRendererFixturesQuery {
    artwork(id: "mona-lisa") {
      ...MockRelayRendererFixtures_artwork
    }
  }
`

// Bad query has a misnamed top-level property.
export const badQuery = graphql`
  query MockRelayRendererFixturesBadQuery {
    something_that_is_not_expected: artwork(id: "mona-lisa") {
      ...MockRelayRendererFixtures_artwork
    }
  }
`

export function renderToString(element: JSX.Element) {
  return cheerio.html(render(element))
}

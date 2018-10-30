import { View, Image, Text } from "react-native"
import { MockRelayRendererFixtures_artist } from "__generated__/MockRelayRendererFixtures_artist.graphql"
import { MockRelayRendererFixtures_artwork } from "__generated__/MockRelayRendererFixtures_artwork.graphql"
import { MockRelayRendererFixtures_artworkMetadata } from "__generated__/MockRelayRendererFixtures_artworkMetadata.graphql"
import { MockRelayRendererFixturesArtistQuery } from "__generated__/MockRelayRendererFixturesArtistQuery.graphql"
import renderWithLoadProgress from "../renderWithLoadProgress"
import { createMockNetworkLayer } from "../createMockNetworkLayer"
import { Environment, RecordSource, Store } from "relay-runtime"
import { render } from "enzyme"
import cheerio from "cheerio"
import * as React from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

const Metadata = createFragmentContainer(
  (props: { artworkMetadata: MockRelayRendererFixtures_artworkMetadata }) => <Text>{props.artworkMetadata.title}</Text>,
  graphql`
    fragment MockRelayRendererFixtures_artworkMetadata on Artwork {
      title
    }
  `
)

export const Artwork = createFragmentContainer(
  (props: { artwork: MockRelayRendererFixtures_artwork }) => (
    <View>
      <Image source={{ uri: props.artwork.image.url }} />
      <Metadata artworkMetadata={props.artwork} />
      {props.artwork.artist && <ArtistQueryRenderer id={props.artwork.artist.id} />}
    </View>
  ),
  graphql`
    fragment MockRelayRendererFixtures_artwork on Artwork {
      image {
        url
      }
      artist {
        id
      }
      ...MockRelayRendererFixtures_artworkMetadata
    }
  `
)

const Artist = createFragmentContainer(
  (props: { artist: MockRelayRendererFixtures_artist }) => <div>{props.artist.name}</div>,
  graphql`
    fragment MockRelayRendererFixtures_artist on Artist {
      name
    }
  `
)

const relayEnvironment = () => {
  const network = createMockNetworkLayer({
    Query: () => ({}),
  })
  const source = new RecordSource()
  const store = new Store(source)
  const environment = new Environment({
    network,
    store,
  })
  return environment
}

const ArtistQueryRenderer = (props: { id: string }) => (
  <QueryRenderer<MockRelayRendererFixturesArtistQuery>
    environment={relayEnvironment()}
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

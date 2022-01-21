import { ArtworkAutosuggestResults_viewer } from "__generated__/ArtworkAutosuggestResults_viewer.graphql"
import { ArtworkAutosuggestResultsContainerQuery } from "__generated__/ArtworkAutosuggestResultsContainerQuery.graphql"
import { GenericGridPlaceholder } from "lib/Components/ArtworkGrids/GenericGrid"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { FadeIn } from "lib/Components/FadeIn"
import { LoadFailureView } from "lib/Components/LoadFailureView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex } from "palette"
import React from "react"
import { QueryRenderer , createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export interface ArtworkAutosuggestResultsProps {
  viewer: ArtworkAutosuggestResults_viewer
  relay: RelayPaginationProp
  keyword: string
  onPress?: (artworkID: string) => void
  onSkipPress?: () => void
}

const ArtworkAutosuggestResults: React.FC<ArtworkAutosuggestResultsProps> = ({
  viewer,
  relay,
  keyword,
  onPress,
  onSkipPress,
}) => {
  const handlePress = (artworkId: string) => {
    // TODO: Tracking
    onPress?.(artworkId)
  }

  return (
    <Flex py="2">
      <InfiniteScrollArtworksGridContainer
        connection={viewer.artworks!}
        loadMore={relay.loadMore}
        hasMore={relay.hasMore}
        contextScreenQuery={keyword}
        useParentAwareScrollView={false}
        itemComponentProps={{ hideSaleInfo: true, hidePartner: true, onPress: handlePress }}
        FooterComponent={() => (
          <Flex alignItems="center">
            {/* Using `FadeIn` prevents the button from being displayed too early. */}
            <FadeIn delay={100} slide={false}>
              <Button variant="outline" onPress={onSkipPress} mt={3}>
                Don't see your artwork? Skip ahead
              </Button>
            </FadeIn>
          </Flex>
        )}
      />
    </Flex>
  )
}

export const ArtworkAutosuggestResultsPaginationContainer = createPaginationContainer(
  ArtworkAutosuggestResults,
  {
    viewer: graphql`
      fragment ArtworkAutosuggestResults_viewer on Viewer
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
        keyword: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        artworks: artworksConnection(first: $count, after: $cursor, keyword: $keyword, input: $input)
          @connection(key: "ArtworkAutosuggestResults_artworks") {
          edges {
            node {
              title
              id
              slug
              image {
                aspectRatio
              }
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.artworks
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query ArtworkAutosuggestResultsQuery(
        $count: Int!
        $cursor: String
        $keyword: String
        $input: FilterArtworksInput
      ) {
        viewer {
          ...ArtworkAutosuggestResults_viewer
            @arguments(count: $count, cursor: $cursor, keyword: $keyword, input: $input)
        }
      }
    `,
  }
)

export const ArtworkAutosuggestResultsQueryRenderer: React.FC<{
  keyword: string
  artistSlug: string
  onPress?: (artworkId: string) => void
  onSkipPress?: () => void
}> = ({ keyword, artistSlug, onPress, onSkipPress }) => {
  return (
    <QueryRenderer<ArtworkAutosuggestResultsContainerQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtworkAutosuggestResultsContainerQuery(
          $count: Int!
          $cursor: String
          $keyword: String
          $input: FilterArtworksInput
        ) {
          viewer {
            ...ArtworkAutosuggestResults_viewer
              @arguments(count: $count, cursor: $cursor, keyword: $keyword, input: $input)
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: ArtworkAutosuggestResultsPaginationContainer,
        renderPlaceholder: () => <ArtworkAutosuggestResultsPlaceholder />,
        initialProps: { keyword, artistSlug, onPress, onSkipPress },
        renderFallback: ({ retry }) => <LoadFailureView onRetry={retry!} />,
      })}
      variables={{ count: 20, keyword, input: { artistIDs: [artistSlug] } }}
      cacheConfig={{ force: true }}
    />
  )
}

export const ArtworkAutosuggestResultsPlaceholder: React.FC = () => {
  const screen = useScreenDimensions()

  return (
    <Flex accessibilityLabel="Artwork results are loading" mt={2} mr={2}>
      <GenericGridPlaceholder width={screen.width - 40} />
    </Flex>
  )
}

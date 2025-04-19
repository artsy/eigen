import {
  Box,
  Flex,
  quoteLeft,
  quoteRight,
  Spacer,
  Spinner,
  Text,
  useSpace,
} from "@artsy/palette-mobile"
import { MasonryFlashList } from "@shopify/flash-list"
import { ArtworkAutosuggestResultsContainerQuery } from "__generated__/ArtworkAutosuggestResultsContainerQuery.graphql"
import { ArtworkAutosuggestResults_viewer$data } from "__generated__/ArtworkAutosuggestResults_viewer.graphql"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { PAGE_SIZE } from "app/Components/constants"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { useCallback, useEffect } from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

export interface ArtworkAutosuggestResultsProps {
  viewer: ArtworkAutosuggestResults_viewer$data
  relay: RelayPaginationProp
  keyword: string
  onPress?: (artworkID: string) => void
  setShowSkipAheadToAddArtworkLink: (showSkipAheadLink: boolean) => void
}

const ArtworkAutosuggestResults: React.FC<ArtworkAutosuggestResultsProps> = ({
  viewer,
  relay,
  keyword,
  onPress,
  setShowSkipAheadToAddArtworkLink,
}) => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  const handlePress = (artworkId: string) => {
    // TODO: Tracking
    onPress?.(artworkId)
  }

  const artworks = extractNodes(viewer.artworks)
  const shouldDisplaySpinner = !!artworks.length && !!relay.isLoading() && !!relay.hasMore()

  const loadMore = useCallback(() => {
    if (relay.hasMore() && !relay.isLoading()) {
      relay.loadMore(PAGE_SIZE)
    }
  }, [relay.hasMore(), relay.isLoading()])

  useEffect(() => {
    setShowSkipAheadToAddArtworkLink(!!viewer.artworks?.edges?.length)
  }, [viewer.artworks?.edges?.length])

  return (
    <MasonryFlashList
      contentContainerStyle={{ paddingBottom: space(12) }}
      showsVerticalScrollIndicator={false}
      data={artworks}
      numColumns={NUM_COLUMNS_MASONRY}
      keyExtractor={(item) => item.id}
      estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
      keyboardShouldPersistTaps="handled"
      onEndReached={loadMore}
      onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
      ListFooterComponent={
        shouldDisplaySpinner ? (
          <Flex my={4} flexDirection="row" justifyContent="center">
            <Spinner />
          </Flex>
        ) : (
          <Spacer y={6} />
        )
      }
      ListEmptyComponent={
        <Box pt={4}>
          <Box px={2}>
            <Text variant="sm-display" textAlign="center">
              Sorry, we couldn’t find any Artworks for {quoteLeft}
              {keyword}.{quoteRight}
            </Text>
            <Text variant="sm-display" color="mono60" textAlign="center">
              Please try searching again with a different spelling.
            </Text>
          </Box>
        </Box>
      }
      renderItem={({ item, index, columnIndex }) => {
        const imgAspectRatio = item.image?.aspectRatio ?? 1
        const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)

        const imgHeight = imgWidth / imgAspectRatio

        return (
          <Flex
            pl={columnIndex === 0 ? 0 : 1}
            pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
            mt={2}
          >
            <ArtworkGridItem
              hideSaveIcon
              itemIndex={index}
              contextScreenQuery={keyword}
              artwork={item}
              height={imgHeight}
              onPress={handlePress}
            />
          </Flex>
        )
      }}
    />
  )
}

export const ArtworkAutosuggestResultsPaginationContainer = createPaginationContainer(
  ArtworkAutosuggestResults,
  {
    viewer: graphql`
      fragment ArtworkAutosuggestResults_viewer on Viewer
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 30 }
        cursor: { type: "String" }
        keyword: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        artworks: artworksConnection(
          first: $count
          after: $cursor
          keyword: $keyword
          input: $input
        ) @connection(key: "ArtworkAutosuggestResults_artworks") {
          edges {
            node {
              title
              id
              slug
              image(includeAll: false) {
                aspectRatio
              }
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
            }
          }
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
  setShowSkipAheadToAddArtworkLink: (showSkipAheadLink: boolean) => void
}> = ({ keyword, artistSlug, onPress, setShowSkipAheadToAddArtworkLink }) => {
  return (
    <QueryRenderer<ArtworkAutosuggestResultsContainerQuery>
      environment={getRelayEnvironment()}
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
        initialProps: {
          keyword,
          artistSlug,
          onPress,
          setShowSkipAheadToAddArtworkLink,
        },
        renderFallback: ({ retry, error }) => (
          <LoadFailureView error={error} onRetry={retry || (() => {})} trackErrorBoundary={false} />
        ),
      })}
      variables={{ count: 20, keyword, input: { artistIDs: [artistSlug] } }}
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

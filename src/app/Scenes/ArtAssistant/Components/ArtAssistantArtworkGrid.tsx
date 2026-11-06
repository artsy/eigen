import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Skeleton, Text, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { ArtAssistantArtworkGridQuery } from "__generated__/ArtAssistantArtworkGridQuery.graphql"
import ArtworkGridItem, {
  ArtworkGridItemPlaceholder,
} from "app/Components/ArtworkGrids/ArtworkGridItem"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { memo, useMemo } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const MAX_ARTWORK_COUNT = 8
const NUM_COLUMNS = 2

interface ArtAssistantArtworkGridProps {
  /** `internalID`s from the answer's artworks section, in the order it chose. */
  artworkIDs: string[]
}

type Artwork = ExtractNodeType<ArtAssistantArtworkGridQuery["response"]["artworksConnection"]>

// Fixed pixel column width, deliberately not `flex: 1`. This grid lives inside the conversation's
// FlashList, whose cells are auto-height; a flexed column has no definite height to grow against and
// collapses when the cell re-measures (e.g. when a turn's suggested replies unmount).
const useColumnWidth = () => {
  const { width: screenWidth } = useScreenDimensions()
  const space = useSpace()
  return (screenWidth - space(1) * 2 - space(1) * (NUM_COLUMNS - 1)) / NUM_COLUMNS
}

const ArtworkGridLoading: React.FC = () => {
  const columnWidth = useColumnWidth()

  return (
    <Skeleton>
      <Flex flexDirection="row" px={1} testID="art-assistant-artwork-grid-loading">
        {Array.from({ length: NUM_COLUMNS }).map((_, columnIndex) => (
          <Flex key={columnIndex} width={columnWidth} ml={columnIndex === 0 ? 0 : 1}>
            {[columnIndex, columnIndex + NUM_COLUMNS].map((seed) => (
              <Flex key={seed} mb={1}>
                <ArtworkGridItemPlaceholder seed={seed} />
              </Flex>
            ))}
          </Flex>
        ))}
      </Flex>
    </Skeleton>
  )
}

const ArtworkGridEmpty: React.FC = () => (
  <Text color="mono60" px={2} variant="xs" testID="art-assistant-artwork-grid-empty">
    No matching artworks found.
  </Text>
)

const ArtworkGridError: React.FC = () => (
  <Text color="mono60" px={2} variant="xs" testID="art-assistant-artwork-grid-error">
    Artwork suggestions are unavailable.
  </Text>
)

export const ArtAssistantArtworkGrid: React.FC<ArtAssistantArtworkGridProps> = memo(
  ({ artworkIDs }) => {
    const cappedIDs = useMemo(() => artworkIDs.slice(0, MAX_ARTWORK_COUNT), [artworkIDs])

    if (cappedIDs.length === 0) {
      return <ArtworkGridEmpty />
    }

    return <ArtAssistantArtworkGridQueryRenderer artworkIDs={cappedIDs} />
  }
)

const ArtAssistantArtworkGridQueryRenderer: React.FC<ArtAssistantArtworkGridProps> = withSuspense({
  Component: ({ artworkIDs }) => {
    const data = useLazyLoadQuery<ArtAssistantArtworkGridQuery>(
      artworkGridQuery,
      { artworkIDs, first: artworkIDs.length },
      { fetchPolicy: "store-or-network" }
    )
    const artworks = extractNodes(data.artworksConnection).slice()
    const rankByID = new Map(artworkIDs.map((id, index) => [id, index]))

    // Gravity's batch endpoint answers with a set, not a sequence, so the answer's own ordering
    // -- the only relevance signal the cards carry -- is restored here.
    artworks.sort(
      (a, b) =>
        (rankByID.get(a.internalID) ?? Number.MAX_SAFE_INTEGER) -
        (rankByID.get(b.internalID) ?? Number.MAX_SAFE_INTEGER)
    )

    if (artworks.length === 0) {
      return <ArtworkGridEmpty />
    }

    return <ReadyArtworkGrid artworks={artworks} />
  },
  LoadingFallback: ArtworkGridLoading,
  ErrorFallback: () => <ArtworkGridError />,
})

const ReadyArtworkGrid: React.FC<{ artworks: Artwork[] }> = ({ artworks }) => {
  const columnWidth = useColumnWidth()
  const space = useSpace()
  const imageWidth = columnWidth - space(1) * 2

  const columns = useMemo(() => {
    const result: Artwork[][] = Array.from({ length: NUM_COLUMNS }, () => [])
    artworks.forEach((artwork, index) => result[index % NUM_COLUMNS].push(artwork))
    return result
  }, [artworks])

  return (
    <Flex flexDirection="row" px={1} testID="art-assistant-artwork-grid">
      {columns.map((column, columnIndex) => (
        <Flex key={columnIndex} width={columnWidth} ml={columnIndex === 0 ? 0 : 1}>
          {column.map((artwork, rowIndex) => {
            const height = imageWidth / (artwork.image?.aspectRatio ?? 1)
            return (
              <Flex key={artwork.internalID} mb={1}>
                <ArtworkGridItem
                  artwork={artwork}
                  contextModule={ContextModule.artAssistantResults}
                  contextScreenOwnerType={OwnerType.artAssistant}
                  height={height}
                  itemIndex={rowIndex * NUM_COLUMNS + columnIndex}
                />
              </Flex>
            )
          })}
        </Flex>
      ))}
    </Flex>
  )
}

const artworkGridQuery = graphql`
  query ArtAssistantArtworkGridQuery($artworkIDs: [String], $first: Int!) {
    artworksConnection(artworkIDs: $artworkIDs, first: $first) {
      edges {
        node {
          internalID
          image(includeAll: false) {
            aspectRatio
          }
          ...ArtworkGridItem_artwork
        }
      }
    }
  }
`

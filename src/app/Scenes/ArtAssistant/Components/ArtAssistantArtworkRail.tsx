import { Flex, Text } from "@artsy/palette-mobile"
import { ArtAssistantArtworkRailQuery } from "__generated__/ArtAssistantArtworkRailQuery.graphql"
import { ArtworkRail, ArtworkRailPlaceholder } from "app/Components/ArtworkRail/ArtworkRail"
import { ArtAssistantArtworkRailState } from "app/Scenes/ArtAssistant/types"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ArtAssistantArtworkRailProps {
  state: ArtAssistantArtworkRailState
}

const ArtworkRailLoading: React.FC = () => (
  <Flex pl={1} testID="art-assistant-artwork-rail-loading">
    <ArtworkRailPlaceholder />
  </Flex>
)

const ArtworkRailEmpty: React.FC = () => (
  <Text color="mono60" px={2} variant="xs" testID="art-assistant-artwork-rail-empty">
    No matching artworks found.
  </Text>
)

const ArtworkRailError: React.FC<{ message?: string }> = ({ message }) => (
  <Text color="mono60" px={2} variant="xs" testID="art-assistant-artwork-rail-error">
    {message ?? "Artwork suggestions are unavailable."}
  </Text>
)

export const ArtAssistantArtworkRail: React.FC<ArtAssistantArtworkRailProps> = ({ state }) => {
  if (state.status === "loading") {
    return <ArtworkRailLoading />
  }

  if (state.status === "empty") {
    return <ArtworkRailEmpty />
  }

  if (state.status === "error") {
    return <ArtworkRailError message={state.message} />
  }

  if (state.artworkIDs.length === 0) {
    return <ArtworkRailEmpty />
  }

  return <ArtAssistantArtworkRailQueryRenderer artworkIDs={state.artworkIDs} />
}

interface ArtAssistantArtworkRailQueryRendererProps {
  artworkIDs: string[]
}

const ArtAssistantArtworkRailQueryRenderer: React.FC<ArtAssistantArtworkRailQueryRendererProps> =
  withSuspense({
    Component: ({ artworkIDs }) => {
      const data = useLazyLoadQuery<ArtAssistantArtworkRailQuery>(
        artworkRailQuery,
        {
          artworkIDs,
          first: artworkIDs.length,
        },
        { fetchPolicy: "store-or-network" }
      )
      const artworks = extractNodes(data.artworksConnection).slice()
      const rankByID = new Map(artworkIDs.map((id, index) => [id, index]))

      artworks.sort(
        (firstArtwork, secondArtwork) =>
          (rankByID.get(firstArtwork.internalID) ?? Number.MAX_SAFE_INTEGER) -
          (rankByID.get(secondArtwork.internalID) ?? Number.MAX_SAFE_INTEGER)
      )

      if (artworks.length === 0) {
        return <ArtworkRailEmpty />
      }

      return <ReadyArtworkRail artworks={artworks} />
    },
    LoadingFallback: ArtworkRailLoading,
    ErrorFallback: () => <ArtworkRailError />,
  })

const ReadyArtworkRail: React.FC<{
  artworks: React.ComponentProps<typeof ArtworkRail>["artworks"]
}> = ({ artworks }) => (
  <Flex testID="art-assistant-artwork-rail">
    <ArtworkRail artworks={artworks} showSaveIcon />
  </Flex>
)

const artworkRailQuery = graphql`
  query ArtAssistantArtworkRailQuery($artworkIDs: [String], $first: Int!) {
    artworksConnection(artworkIDs: $artworkIDs, first: $first) {
      edges {
        node {
          internalID
          ...ArtworkRail_artworks
        }
      }
    }
  }
`

import { Box, Spacer, Text } from "@artsy/palette-mobile"
import { FilterArtworksInput } from "__generated__/ArtworkAutosuggestResultsContainerQuery.graphql"
import { ConfirmationScreenArtworksQuery } from "__generated__/ConfirmationScreenArtworksQuery.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { useLazyLoadQuery } from "react-relay"
import { graphql } from "relay-runtime"

const artworksQuery = graphql`
  query ConfirmationScreenArtworksQuery($input: FilterArtworksInput) {
    artworksConnection(first: 20, input: $input) {
      counts {
        total
      }
      edges {
        node {
          ...GenericGrid_artworks
        }
      }
    }
  }
`

export const MatchingArtworks: React.FC<{ input: FilterArtworksInput }> = (props) => {
  const screen = useScreenDimensions()

  const { input } = props
  const data = useLazyLoadQuery<ConfirmationScreenArtworksQuery>(artworksQuery, { input })

  const artworks = extractNodes(data.artworksConnection)
  const total = data?.artworksConnection?.counts?.total

  if (artworks.length === 0) {
    return <GenericGridPlaceholder width={screen.width - 40} />
  }

  return (
    <Box borderTopWidth={1} borderTopColor="black30" pt={1}>
      <Text variant="sm" color="black60">
        You might like these {total} works currently on Artsy that match your criteria
      </Text>
      <Spacer y={2} />
      <GenericGrid artworks={artworks} />
    </Box>
  )
}

import { Box, Flex, Join, Spacer } from "@artsy/palette-mobile"
import { SelectArtworkListsForArtworkQuery } from "__generated__/SelectArtworkListsForArtworkQuery.graphql"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkLists } from "app/Components/ArtworkLists/components/ArtworkLists"
import { PlaceholderBox, RandomWidthPlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const LOADING_PLACEHOLDER_COUNT = 10

const SelectArtworkListsForArtworkContent = () => {
  const { state } = useArtworkListsContext()
  const artwork = state.artwork
  const queryData = useLazyLoadQuery<SelectArtworkListsForArtworkQuery>(
    Query,
    {
      artworkID: artwork?.internalID as string,
    },
    {
      fetchPolicy: "network-only",
    }
  )

  if (!queryData.me) {
    return null
  }

  return <ArtworkLists me={queryData.me} />
}

export const SelectArtworkListsForArtwork = () => {
  return (
    <Suspense fallback={<ArtworkListsPlaceholder />}>
      <SelectArtworkListsForArtworkContent />
    </Suspense>
  )
}

const ArtworkListLoadingPlaceholder = () => {
  return (
    <Flex py={1} px={2} flexDirection="row" alignItems="center">
      <Join separator={<Spacer x={1} />}>
        {/* Artwork list preview */}
        <PlaceholderBox width={50} height={50} />

        <Flex flex={1}>
          {/* Artwork list name */}
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} height={15} />

          {/* Artworks count */}
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} height={14} marginBottom={0} />
        </Flex>

        {/* Selected/Unselected icon */}
        <PlaceholderBox width={24} height={24} borderRadius={24} />
      </Join>
    </Flex>
  )
}

const ArtworkListsPlaceholder = () => {
  return (
    <Box>
      {times(LOADING_PLACEHOLDER_COUNT).map((index) => (
        <ArtworkListLoadingPlaceholder key={`artwork-list-placeholder-${index}`} />
      ))}
    </Box>
  )
}

const Query = graphql`
  query SelectArtworkListsForArtworkQuery($artworkID: String!) {
    me {
      ...ArtworkLists_me @arguments(artworkID: $artworkID)
    }
  }
`

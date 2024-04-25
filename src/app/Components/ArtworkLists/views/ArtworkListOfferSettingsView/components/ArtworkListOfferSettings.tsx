import { Box, Flex, Join, SkeletonBox, Spacer } from "@artsy/palette-mobile"
import { ArtworkListOfferSettingsQuery } from "__generated__/ArtworkListOfferSettingsQuery.graphql"
import { ArtworkLists } from "app/Components/ArtworkLists/components/ArtworkLists"
import { RandomWidthPlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"
import { Suspense } from "react"
import { Platform } from "react-native"
import { graphql, useLazyLoadQuery } from "react-relay"

const LOADING_PLACEHOLDER_COUNT = 10

const ArtworkListOfferSettingsContent = () => {
  const queryData = useLazyLoadQuery<ArtworkListOfferSettingsQuery>(
    Query,
    {},
    { fetchPolicy: "network-only" }
  )

  if (!queryData.me) {
    return null
  }

  return <ArtworkLists me={queryData.me} />
}

export const ArtworkListOfferSettings = () => {
  return (
    <Suspense fallback={<ArtworkListOfferSettingsPlaceholder />}>
      <ArtworkListOfferSettingsContent />
    </Suspense>
  )
}

const ArtworkListLoadingPlaceholder = () => {
  return (
    <Flex py={1} px={2} flexDirection="row" alignItems="center">
      <Join separator={<Spacer x={1} />}>
        {/* Artwork list preview */}
        <SkeletonBox width={50} height={50} />

        <Flex flex={1}>
          {/* Artwork list name */}
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} height={15} />

          {/* Artworks count */}
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} height={14} marginBottom={0} />
        </Flex>

        {/* Sharing switch */}
        {Platform.OS === "ios" ? (
          <SkeletonBox width={50} height={30} borderRadius={16} />
        ) : (
          <Flex justifyContent="center" mr={0.5}>
            <SkeletonBox position="absolute" right={0} width={20} height={20} borderRadius={15} />
            <SkeletonBox width={30} height={15} borderRadius={16} />
          </Flex>
        )}
      </Join>
    </Flex>
  )
}

const ArtworkListOfferSettingsPlaceholder = () => {
  return (
    <Box>
      {times(LOADING_PLACEHOLDER_COUNT).map((index) => (
        <ArtworkListLoadingPlaceholder key={`artwork-list-placeholder-${index}`} />
      ))}
    </Box>
  )
}

const Query = graphql`
  query ArtworkListOfferSettingsQuery {
    me {
      ...ArtworkLists_me @arguments(artworkID: "", includeArtwork: false)
    }
  }
`

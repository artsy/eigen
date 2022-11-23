import {
  PlaceholderBox,
  PlaceholderRaggedText,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { times } from "lodash"
import { Box, Flex, Join, Spacer } from "palette"
import { MAX_SHOWN_RECENT_SEARCHES, useRecentSearches } from "../../SearchModel"
import { useDisplayCuratedCollections } from "../../useDisplayCuratedCollections"
import { IMAGE_SIZE } from "../SearchResultImage"

const RecentSearchesPlaceholder = () => {
  const recentSearches = useRecentSearches(MAX_SHOWN_RECENT_SEARCHES)

  if (recentSearches.length === 0) {
    return (
      <>
        <PlaceholderText width="50%" height={25} />
        <Spacer mt={1} />
        <PlaceholderText height={67} />
        <Spacer mt={1} />
      </>
    )
  }

  return (
    <>
      <PlaceholderText width="50%" height={25} />
      <Spacer mt={1} />
      <Join separator={<Spacer mt={2} />}>
        {times(recentSearches.length).map((index) => (
          <Flex key={`search-placeholder-${index}`} height={IMAGE_SIZE} flexDirection="row">
            <PlaceholderBox width={IMAGE_SIZE} height={IMAGE_SIZE} />
            <Flex flex={1} ml={1}>
              <PlaceholderRaggedText textHeight={15} numLines={2} />
            </Flex>
          </Flex>
        ))}
      </Join>
    </>
  )
}

const TrendingArtistPlaceholder = () => {
  return (
    <>
      <PlaceholderText width="50%" height={25} />
      <Flex flexDirection="row" mt={1}>
        <Join separator={<Spacer ml={1} />}>
          {times(3).map((index) => (
            <Flex key={index}>
              <PlaceholderBox key={index} height={180} width={295} />
              <Spacer mt={1} />
              <PlaceholderText width={120} height={20} />
              <RandomWidthPlaceholderText minWidth={30} maxWidth={90} height={20} />
            </Flex>
          ))}
        </Join>
      </Flex>
    </>
  )
}

export const SearchPlaceholder: React.FC = () => {
  const displayCuratedCollections = useDisplayCuratedCollections()

  return (
    <ProvidePlaceholderContext>
      <Box m={2} mb={0}>
        {/* Search input */}
        <PlaceholderBox height={50} />
        <Spacer mt={2} />

        <RecentSearchesPlaceholder />
        <Spacer mt={4} />

        {!!displayCuratedCollections && <TrendingArtistPlaceholder />}
      </Box>
    </ProvidePlaceholderContext>
  )
}

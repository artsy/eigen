import {
  Box,
  Flex,
  Join,
  SEARCH_INPUT_CONTAINER_BORDER_RADIUS,
  SEARCH_INPUT_CONTAINER_HEIGHT,
  Spacer,
} from "@artsy/palette-mobile"
import { CARD_WIDTH } from "app/Components/Home/CardRailCard"
import { MAX_SHOWN_RECENT_SEARCHES, useRecentSearches } from "app/Scenes/Search/SearchModel"
import { IMAGE_SIZE } from "app/Scenes/Search/components/SearchResultImage"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import {
  PlaceholderBox,
  PlaceholderRaggedText,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { times } from "lodash"
import { isTablet } from "react-native-device-info"

const RecentSearchesPlaceholder = () => {
  const recentSearches = useRecentSearches(MAX_SHOWN_RECENT_SEARCHES)

  if (recentSearches.length === 0) {
    return (
      <>
        <PlaceholderText width="50%" height={25} />
        <Spacer y={1} />
        <PlaceholderText height={66} marginBottom={0} />
      </>
    )
  }

  return (
    <>
      <PlaceholderText width="50%" height={25} />
      <Spacer y={1} />
      <Join separator={<Spacer y={2} />}>
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

const TrendingArtistLargeCard = () => {
  return (
    <>
      <PlaceholderBox width={295} height={180} />
      <Spacer y={1} />
      <PlaceholderText width={120} height={20} />
      <RandomWidthPlaceholderText minWidth={30} maxWidth={90} height={20} marginBottom={0} />
    </>
  )
}

const TrendingArtistSmallCard = () => {
  return (
    <>
      <PlaceholderBox width={140} height={105} />
      <Spacer y={1} />
      <PlaceholderText width={120} height={15} />
      <RandomWidthPlaceholderText minWidth={30} maxWidth={90} height={15} marginBottom={0} />
    </>
  )
}

const TrendingArtistPlaceholder = () => {
  return (
    <>
      <PlaceholderText width="50%" height={25} />
      <Flex flexDirection="row" mt={1}>
        <Join separator={<Spacer x={1} />}>
          {times(3).map((index) => (
            <Flex key={index}>
              {isTablet() ? <TrendingArtistLargeCard /> : <TrendingArtistSmallCard />}
            </Flex>
          ))}
        </Join>
      </Flex>
    </>
  )
}

const CuratedCollectionCardPlaceholder: React.FC = (props) => {
  return (
    <Box borderRadius={4} border="1px solid" borderColor="black10" overflow="hidden" {...props}>
      <PlaceholderBox width={CARD_WIDTH} borderRadius={0} height={180} />
      <Box m="15px" mb={1}>
        <PlaceholderText width={120} height={20} />
        <RandomWidthPlaceholderText minWidth={30} maxWidth={90} height={20} />
      </Box>
    </Box>
  )
}

const CuratedCollectionsPlaceholder = () => {
  return (
    <>
      <PlaceholderText width="50%" height={25} />
      <Flex flexDirection="row" mt={1}>
        <Join separator={<Spacer x={1} />}>
          {times(3).map((index) => (
            <CuratedCollectionCardPlaceholder key={`curated-collaction-card-${index}`} />
          ))}
        </Join>
      </Flex>
    </>
  )
}

export const SearchPlaceholder: React.FC = () => {
  const enableNewSearchModal = useFeatureFlag("AREnableNewSearchModal")
  return (
    <ProvidePlaceholderContext>
      <Box m={2} mb={0} testID="search-placeholder">
        {/* Search input */}
        {enableNewSearchModal ? (
          <PlaceholderBox
            height={SEARCH_INPUT_CONTAINER_HEIGHT}
            borderRadius={SEARCH_INPUT_CONTAINER_BORDER_RADIUS}
          />
        ) : (
          <PlaceholderBox height={50} />
        )}

        <Spacer y={2} />

        {!enableNewSearchModal && (
          <>
            <RecentSearchesPlaceholder />
            <Spacer y={4} />
          </>
        )}

        <TrendingArtistPlaceholder />
        <Spacer y={4} />
        <CuratedCollectionsPlaceholder />
      </Box>
    </ProvidePlaceholderContext>
  )
}

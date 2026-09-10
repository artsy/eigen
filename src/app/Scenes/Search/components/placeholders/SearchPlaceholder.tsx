import {
  Box,
  Flex,
  Join,
  SEARCH_INPUT_CONTAINER_BORDER_RADIUS,
  SEARCH_INPUT_CONTAINER_HEIGHT,
  SkeletonBox,
  Spacer,
} from "@artsy/palette-mobile"
import { CARD_WIDTH } from "app/Components/CardRail/CardRailCard"
import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"
import {
  PlaceholderBox,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { times } from "lodash"
import { isTablet } from "react-native-device-info"

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
    <Box borderRadius={4} border="1px solid" borderColor="mono10" overflow="hidden" {...props}>
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
  const showArtAssistant = useEnableArtAssistant()

  return (
    <ProvidePlaceholderContext>
      <Box m={2} mb={0} testID="search-placeholder">
        <Flex flexDirection="row" gap={1}>
          <SkeletonBox
            flex={1}
            height={SEARCH_INPUT_CONTAINER_HEIGHT}
            borderRadius={SEARCH_INPUT_CONTAINER_BORDER_RADIUS}
          />

          {!!showArtAssistant && (
            <SkeletonBox
              borderRadius={50}
              height={SEARCH_INPUT_CONTAINER_HEIGHT}
              testID="art-assistant-search-button-placeholder"
              width={SEARCH_INPUT_CONTAINER_HEIGHT}
            />
          )}
        </Flex>

        <Spacer y={2} />

        <TrendingArtistPlaceholder />

        <Spacer y={4} />

        <CuratedCollectionsPlaceholder />
      </Box>
    </ProvidePlaceholderContext>
  )
}

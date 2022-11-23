import {
  PlaceholderBox,
  PlaceholderRaggedText,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
  useMemoizedRandom,
} from "app/utils/placeholders"
import { times } from "lodash"
import { Box, Flex, Join, Spacer } from "palette"
import { useDisplayCuratedCollections } from "../../useDisplayCuratedCollections"

export const SearchPlaceholder: React.FC = () => {
  const displayCuratedCollections = useDisplayCuratedCollections()

  return (
    <ProvidePlaceholderContext>
      <Box p={2} pb={0}>
        <PlaceholderBox height={46} />
        <Spacer mt={30} />
        <PlaceholderText width="50%" height={20} />
        <Spacer mt={1} />
        {times(4).map((index) => (
          <Flex key={`search-placeholder-${index}`} flexDirection="row" mb={2}>
            <PlaceholderBox width={40} height={40} />
            <Flex flex={1} ml={1}>
              <PlaceholderRaggedText textHeight={15} numLines={2} />
            </Flex>
          </Flex>
        ))}
      </Box>

      {!!displayCuratedCollections && (
        <Box mx={2}>
          <PlaceholderText width="50%" height={20} />
          <Flex flexDirection="row" mt={2}>
            <Join separator={<Spacer ml={1} />}>
              {times(3 + useMemoizedRandom() * 10).map((index) => (
                <Flex key={index}>
                  <PlaceholderBox key={index} height={180} width={295} />
                  <Spacer mt={1} />
                  <PlaceholderText width={120} height={20} />
                  <RandomWidthPlaceholderText minWidth={30} maxWidth={90} height={20} />
                </Flex>
              ))}
            </Join>
          </Flex>
        </Box>
      )}
    </ProvidePlaceholderContext>
  )
}

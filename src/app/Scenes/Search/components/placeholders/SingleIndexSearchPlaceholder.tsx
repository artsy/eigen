import { Box, Flex } from "@artsy/palette-mobile"
import { IMAGE_SIZE } from "app/Scenes/Search/components/SearchResultImage"
import {
  PlaceholderBox,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { times } from "lodash"

interface SingleIndexSearchPlaceholderProps {
  hasRoundedImages: boolean
}

export const SingleIndexSearchPlaceholder: React.FC<SingleIndexSearchPlaceholderProps> = ({
  hasRoundedImages,
}) => (
  <ProvidePlaceholderContext>
    <Box px={2} testID="SingleIndexSearchPlaceholder">
      {times(20).map((index) => (
        <Flex key={`algolia-search-placeholder-${index}`} flexDirection="row" my={1}>
          <PlaceholderBox
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
            borderRadius={hasRoundedImages ? IMAGE_SIZE / 2 : 0}
          />
          <Flex flex={1} justifyContent="center" ml={1}>
            <RandomWidthPlaceholderText
              minWidth={100}
              maxWidth={200}
              height={14}
              marginBottom={0}
            />
          </Flex>
        </Flex>
      ))}
    </Box>
  </ProvidePlaceholderContext>
)

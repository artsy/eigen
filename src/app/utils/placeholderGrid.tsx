import { Flex } from "@artsy/palette-mobile"
import { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { useScreenDimensions } from "app/utils/hooks"

export const PlaceholderGrid = () => (
  <Flex mx={2} flexDirection="row" testID="PlaceholderGrid">
    <GenericGridPlaceholder width={useScreenDimensions().width - 40} />
  </Flex>
)

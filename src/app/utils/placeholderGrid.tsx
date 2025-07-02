import { Flex, FlexProps } from "@artsy/palette-mobile"
import { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { useScreenDimensions } from "app/utils/hooks"

export const PlaceholderGrid: React.FC<FlexProps> = (props) => (
  <Flex mx={2} flexDirection="row" testID="PlaceholderGrid" {...props}>
    <GenericGridPlaceholder width={useScreenDimensions().width - 40} />
  </Flex>
)

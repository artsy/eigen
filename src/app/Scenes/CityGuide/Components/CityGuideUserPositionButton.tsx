import { Box, Flex } from "@artsy/palette-mobile"
import Crosshair from "app/Components/Icons/Crosshair"
import { BOX_SHADOW } from "app/Components/constants"
import { TouchableOpacity } from "react-native"

interface Props {
  onPress?: () => void
  highlight?: boolean
}

const HEIGHT = 30

export const CityGuideUserPositionButton: React.FC<Props> = ({ highlight, onPress }) => {
  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress}>
      <Flex
        flexDirection="row"
        alignItems="center"
        alignContent="center"
        alignSelf="flex-end"
        backgroundColor="mono0"
        height={HEIGHT}
        width={HEIGHT}
        borderRadius={HEIGHT / 2}
        style={BOX_SHADOW}
      >
        <Box style={{ marginLeft: "auto", marginRight: "auto" }}>
          <Crosshair color={highlight ? "blue100" : "mono100"} />
        </Box>
      </Flex>
    </TouchableOpacity>
  )
}

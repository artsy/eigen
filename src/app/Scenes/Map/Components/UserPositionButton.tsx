import { Box, Flex } from "@artsy/palette-mobile"
import Crosshair from "app/Components/Icons/Crosshair"
import { BOX_SHADOW } from "app/Components/constants"
import { TouchableOpacity } from "react-native"

interface Props {
  onPress?: () => void
  highlight?: boolean
}

export const UserPositionButton: React.FC<Props> = ({ highlight, onPress }) => {
  return (
    <TouchableOpacity accessibilityRole="button" onPress={onPress}>
      <Flex
        flexDirection="row"
        alignItems="center"
        alignContent="center"
        alignSelf="flex-end"
        backgroundColor="mono0"
        height={40}
        width={40}
        borderRadius={20}
        style={BOX_SHADOW}
      >
        <Box style={{ marginLeft: "auto", marginRight: "auto" }}>
          <Crosshair color={highlight ? "blue100" : "mono100"} />
        </Box>
      </Flex>
    </TouchableOpacity>
  )
}

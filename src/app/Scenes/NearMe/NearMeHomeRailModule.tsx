import { Flex, Spacer, Text, useColor } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { Image, TouchableOpacity } from "react-native"

interface NearMeHomeRailModuleProps {
  nothing?: any
}

export const NearMeHomeRailModule: React.FC<NearMeHomeRailModuleProps> = ({}) => {
  const color = useColor()
  const cityGuideMapImage = require("images/city-guide-bg.webp")

  return (
    <Flex px={2}>
      <SectionTitle title="fairs and shows near you" />
      <TouchableOpacity onPress={() => navigate("/nearMe")}>
        <Flex
          style={{
            borderWidth: 1,
            borderColor: color("black10"),
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Image source={cityGuideMapImage} style={{ width: "100%" }} />
          <Flex m="15px">
            <Text variant="sm" style={{ color: color("black60") }}>
              Browse fairs and shows wherever you are
            </Text>
            <Spacer y={1} />
          </Flex>
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}

import { Flex, Text } from "@artsy/palette-mobile"
import { useEffect, useState } from "react"
import { LayoutAnimation } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export const CollapseMenu: React.FC<{ title: string }> = ({ title, children }) => {
  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [showContent])

  return (
    <Flex>
      <TouchableOpacity onPress={() => void setShowContent(!showContent)}>
        <Flex ml={2} mt={1} mb={1}>
          <Text variant="sm-display">{title}</Text>
        </Flex>
      </TouchableOpacity>

      {showContent ? children : null}
    </Flex>
  )
}

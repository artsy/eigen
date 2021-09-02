import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, useColor } from "palette"
import { Tab } from "palette/elements/Tabs"
import React, { useState } from "react"
import Animated, { interpolate } from "react-native-reanimated"
import { TabsProps, timingFunction, validateTabs } from "./tabHelpers"

/**
 * Renders a list of tabs. Evenly-spaces them across the screen with
 * each tab label centered on the tab
 */
export const NavigationTabs: React.FC<TabsProps> = ({ setActiveTab, activeTabId, tabs }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)

  const color = useColor()
  const tabWidth = useScreenDimensions().width / tabs.length

  const onTabPress = (id: string, index: number) => {
    setPrevIndex(currentIndex)
    setCurrentIndex(index)
    setActiveTab(id)
  }

  if (validateTabs(tabs)) {
    console.error("Each tab object in the tabs array prop passed in StepTabs much have a unique id")
    return null
  }
  return (
    <>
      <Flex flexDirection="row">
        {tabs.map(({ label, id }, index) => {
          const active = activeTabId === id
          return (
            <Box width={tabWidth} key={id}>
              <Tab label={label} onPress={() => onTabPress(id, index)} active={active} />
            </Box>
          )
        })}
      </Flex>
      <Box borderBottomWidth={1} borderBottomColor={color("black10")} />
      <Animated.View
        style={{
          width: tabWidth,
          left: interpolate(timingFunction(), {
            inputRange: [0, 1],
            outputRange: [prevIndex * tabWidth, currentIndex * tabWidth],
          }),
          height: 1,
          top: -1,
          backgroundColor: color("black100"),
        }}
      />
    </>
  )
}

import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, useColor } from "palette"
import { Tab } from "palette/elements/Tabs"
import React, { useMemo, useState } from "react"
import { ScrollView } from "react-native"
import Animated, { interpolate } from "react-native-reanimated"
import { TabsProps, timingFunction } from "./tabHelpers"

/**
 * Renders a list of tabs. Evenly-spaces them across the screen with
 * each tab label centered on the tab
 */
export const NavigationTabs: React.FC<TabsProps> = ({ setActiveTab, activeTab, tabs }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)

  const color = useColor()
  const tabWidth = useScreenDimensions().width / tabs.length

  const onTabPress = (index: number) => {
    setActiveTab(index)
    setPrevIndex(currentIndex)
    setCurrentIndex(index)
  }

  return useMemo(() => {
    return (
      <>
        <ScrollView horizontal>
          <Flex flexDirection="row">
            {tabs.map(({ label }, index) => {
              const active = activeTab === index
              return (
                <Box width={tabWidth} key={label + index}>
                  <Tab label={label} onPress={() => onTabPress(index)} active={active} />
                </Box>
              )
            })}
          </Flex>
        </ScrollView>
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
  }, [currentIndex])
}

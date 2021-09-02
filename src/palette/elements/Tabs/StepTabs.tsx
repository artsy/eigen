import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Tab } from "palette/elements/Tabs"
import { CheckIcon, ChevronIcon } from "palette/svgs"
import React, { useState } from "react"
import { TouchableOpacity } from "react-native"
import Animated, { interpolate } from "react-native-reanimated"
import { useColor } from "../../hooks"
import { Box } from "../Box"
import { TabsProps, timingFunction, validateTabs } from "./tabHelpers"

/**
 * Renders a list of tabs. Evenly-spaces them across the screen with
 * each tab label and chevron evenly spaced
 */
export const StepTabs: React.FC<TabsProps> = ({ setActiveTab, activeTabId, tabs }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)

  const color = useColor()

  const onTabPress = (id: string, index: number) => {
    setPrevIndex(currentIndex)
    setCurrentIndex(index)
    setActiveTab(id)
  }

  const tabWidth = useScreenDimensions().width / tabs.length

  if (validateTabs(tabs)) {
    console.error("Each tab object in the tabs array prop passed in StepTabs much have a unique id")
    return null
  }
  return (
    <>
      <Box flexDirection={"row"}>
        {tabs.map(({ label, id, completed }, index) => {
          const active = activeTabId === id
          return (
            <TouchableOpacity onPress={() => onTabPress(id, index)} key={id}>
              <Box width={tabWidth} justifyContent={"space-between"} flexDirection={"row"} alignItems={"center"}>
                <Box flexDirection={"row"} alignItems={"center"}>
                  <Tab
                    label={label}
                    onPress={() => onTabPress(id, index)}
                    active={active}
                    style={{ paddingHorizontal: 0, paddingLeft: 8, paddingRight: 5 }}
                  />
                  {!!completed && <CheckIcon fill={"green100"} height={15} width={15} />}
                </Box>
                <ChevronIcon fill={"black60"} height={10} width={10} />
              </Box>
            </TouchableOpacity>
          )
        })}
      </Box>

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

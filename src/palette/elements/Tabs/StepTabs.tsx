import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Tab } from "palette/elements/Tabs"
import { CheckIcon, ChevronIcon } from "palette/svgs"
import React, { Dispatch, SetStateAction, useState } from "react"
import { TouchableOpacity } from "react-native"
import Animated, { Easing, interpolate } from "react-native-reanimated"
import { useColor } from "../../hooks"
import { Box } from "../Box"

export type StepTabsType = Array<{
  label: string
  id: string
  completed?: boolean
}>

interface StepTabsProps {
  setActiveTab: Dispatch<SetStateAction<string>>
  activeTabId: string
  tabs: StepTabsType
}

export const StepTabs: React.FC<StepTabsProps> = ({ setActiveTab, activeTabId, tabs }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)

  const color = useColor()

  const animation = () => {
    const { Value, set, cond, startClock, clockRunning, timing, block, Clock } = Animated
    const clock = new Clock()
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    }

    const config = {
      duration: 500,
      toValue: new Value(1),
      easing: Easing.linear,
    }

    return block([
      cond(
        clockRunning(clock),
        [set(config.toValue, 1)],
        [
          set(state.finished, 0),
          set(state.time, 0),
          set(state.position, 0),
          set(state.frameTime, 0),
          set(config.toValue, 1),
          startClock(clock),
        ]
      ),
      timing(clock, state, config),
      state.position,
    ])
  }

  const validateTabs = (): boolean => {
    interface Obj {
      [key: string]: boolean
    }
    const obj: Obj = {}
    for (const tab of tabs) {
      if (obj[tab.id]) {
        return true
      }
      obj[tab.id] = true
    }
    return false
  }
  const onTabPress = (id: string, index: number) => {
    setPrevIndex(currentIndex)
    setCurrentIndex(index)
    setActiveTab(id)
  }

  const tabWidth = useScreenDimensions().width / tabs.length
  if (validateTabs()) {
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
                  {!!completed && <CheckIcon color={"green100"} height={15} width={15} />}
                </Box>
                <ChevronIcon color={"black60"} height={10} width={10} />
              </Box>
            </TouchableOpacity>
          )
        })}
      </Box>

      <Box borderBottomWidth={1} borderBottomColor={color("black10")} />
      <Animated.View
        style={{
          width: tabWidth,
          left: interpolate(animation(), {
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

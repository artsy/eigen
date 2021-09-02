import { useAnimatedValue } from "lib/Components/StickyTabPage/reanimatedHelpers"
import { Tab } from "palette/elements/Tabs"
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { MutableRefObject } from "react"
import { View, ViewStyle } from "react-native"
import Animated, { Easing, interpolate } from "react-native-reanimated"
import { useColor } from "../../hooks"
import { Box } from "../Box"

interface TabAttributes {
  width: number
  height: number
  x: number
  y: number
  pageX: number
  pageY: number
}
interface ItemProps {
  active: boolean
  getTabAttributes: (attributes: TabAttributes) => void
  setActiveTabRef: (current: View) => void
  style: ViewStyle
  label: string
  onPress: () => void
}

const TabItem: React.FC<ItemProps> = ({ active, getTabAttributes, label, onPress, setActiveTabRef }) => {
  const boxRef = useRef<View>(null)
  const setActiveTabRefOnParent = (current: View) => {
    setActiveTabRef(current)
  }
  useEffect(() => {
    if (active && !!boxRef.current) {
      boxRef.current.measure((x, y, width, height, pageX, pageY) => {
        const tabAttributes = {
          x,
          y,
          pageX,
          pageY,
          width,
          height,
        }
        setActiveTabRefOnParent(boxRef.current as View)
        getTabAttributes(tabAttributes)
      })
    }
  }, [active])

  return (
    <View ref={boxRef}>
      <Tab style={{ paddingHorizontal: 8 }} label={label} onPress={onPress} active={active} />
    </View>
  )
}

export type ContentTabsType = Array<{
  label: string
  id: string
}>

interface ContentTabsProps {
  setActiveTab: Dispatch<SetStateAction<string>>
  activeTabId: string
  tabs: ContentTabsType
}

export const ContentTabs: React.FC<ContentTabsProps> = ({ setActiveTab, activeTabId, tabs }) => {
  const initalTabAttributes = {
    x: 0,
    y: 0,
    pageX: 0,
    pageY: 0,
    width: 0,
    height: 0,
  }
  const color = useColor()

  const activeTabRef = useRef<View>(null)

  const [currentTabAttributes, setCurrentTabAttributes] = useState<TabAttributes>(initalTabAttributes)
  const [previousTabAttributes, setPreviousTabAttributes] = useState<TabAttributes>(initalTabAttributes)

  const xOffset = useAnimatedValue(0)

  const getAttributes = (attributes: TabAttributes) => {
    setPreviousTabAttributes(currentTabAttributes)
    setCurrentTabAttributes(attributes)
    xOffset.setValue(-attributes.pageX)
  }

  const setActiveTabRef = (current: View) => {
    ;(activeTabRef as MutableRefObject<View>).current = current
  }

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
      duration: 300,
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

  if (validateTabs()) {
    console.error("Each tab object in the tabs array prop passed in ContentTabs much have a unique id")
    return null
  }
  return (
    <Box>
      <Box borderBottomWidth={1} borderBottomColor={color("black10")} top={currentTabAttributes.height ?? 55 - 0.8} />
      <Animated.ScrollView
        scrollEventThrottle={10}
        onScroll={() => {
          // Measuring instead of computing nativeEvent.contentOffset.x - currentTabAttributes.pageX
          // because of occassional drifting of values in long lists TODO:- Investigate
          activeTabRef.current?.measure((_x, _y, _width, _height, pageX, _pageY) => {
            xOffset.setValue(-pageX)
          })
        }}
        alwaysBounceVertical={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
        }}
        horizontal
      >
        {tabs.map(({ label, id }) => {
          const active = activeTabId === id
          return (
            <TabItem
              key={id}
              active={active}
              style={{ paddingHorizontal: 8 }}
              label={label}
              onPress={() => {
                setActiveTab(id)
              }}
              getTabAttributes={getAttributes}
              setActiveTabRef={setActiveTabRef}
            />
          )
        })}
      </Animated.ScrollView>
      <Animated.View
        style={{
          width: interpolate(animation(), {
            inputRange: [0, 1],
            outputRange: [previousTabAttributes.width, currentTabAttributes.width],
          }),
          height: 1,
          top: -1,
          backgroundColor: color("black100"),
          transform: [
            {
              translateX: xOffset.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -1],
              }),
            },
          ],
        }}
      />
    </Box>
  )
}

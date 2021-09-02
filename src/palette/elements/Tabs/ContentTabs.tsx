import { useAnimatedValue } from "lib/Components/StickyTabPage/reanimatedHelpers"
import { Tab } from "palette/elements/Tabs"
import React, { useEffect, useRef, useState } from "react"
import { MutableRefObject } from "react"
import { View, ViewStyle } from "react-native"
import Animated, { interpolate } from "react-native-reanimated"
import { useColor } from "../../hooks"
import { Box } from "../Box"
import { TabsProps, timingFunction, validateTabs } from "./tabHelpers"

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

/**
 * Renders a  scrollable list of tabs.
 */
export const ContentTabs: React.FC<TabsProps> = ({ setActiveTab, activeTabId, tabs }) => {
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

  if (validateTabs(tabs)) {
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
          width: interpolate(timingFunction(), {
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

import { Box, color, Flex, Sans, space } from "@artsy/palette"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect } from "react"
import { TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./reanimatedHelpers"
import { useStickyTabPageContext } from "./StickyTabPage"

export const TAB_BAR_HEIGHT = 48

export const StickyTabPageTabBar: React.FC = () => {
  const { tabLabels, activeTabIndex, setActiveTabIndex } = useStickyTabPageContext()
  activeTabIndex.useUpdates()
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: color("black30"),
        height: TAB_BAR_HEIGHT,
        flexDirection: "row",
        paddingHorizontal: space(2),
      }}
    >
      {tabLabels.map((label, index) => (
        <StickyTab
          key={index}
          label={label}
          active={index === activeTabIndex.current}
          onPress={() => {
            setActiveTabIndex(index)
          }}
        />
      ))}
      <ActiveTabBorder />
    </View>
  )
}

export const StickyTab: React.FC<{ label: string; active: boolean; onPress(): void }> = ({
  label,
  active,
  onPress,
}) => {
  return (
    <Flex style={{ flex: 1, height: TAB_BAR_HEIGHT }}>
      <TouchableOpacity onPress={onPress}>
        <Box
          style={{
            height: TAB_BAR_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sans size="3" weight={active ? "medium" : "regular"}>
            {label}
          </Sans>
        </Box>
      </TouchableOpacity>
    </Flex>
  )
}

const ActiveTabBorder: React.FC = () => {
  const { tabLabels, activeTabIndex } = useStickyTabPageContext()
  activeTabIndex.useUpdates()

  const { width: screenWidth } = useScreenDimensions()
  const width = (screenWidth - space(2) * 2) / tabLabels.length
  const leftOffset = useAnimatedValue(activeTabIndex.current * width)

  useEffect(() => {
    // .start() not supported by the test mocks for reanimated
    if (__TEST__) {
      return
    }
    Animated.spring(leftOffset, {
      ...Animated.SpringUtils.makeDefaultConfig(),
      stiffness: 700,
      damping: 220,
      toValue: activeTabIndex.current * width,
    }).start()
  }, [activeTabIndex.current])

  return (
    <Animated.View
      style={{
        height: 2,
        width,
        backgroundColor: "black",
        position: "absolute",
        bottom: -1,
        left: space(2),
        transform: [
          {
            translateX: leftOffset,
          },
        ],
      }}
    />
  )
}

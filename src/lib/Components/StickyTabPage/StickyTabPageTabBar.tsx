import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { compact } from "lodash"
import { color, Sans, space } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { Animated, LayoutRectangle, ScrollView, TouchableOpacity, View, ViewProperties } from "react-native"
import { useStickyTabPageContext } from "./StickyTabPage"

export const TAB_BAR_HEIGHT = 48

export const StickyTabPageTabBar: React.FC<{ onTabPress?(tab: { label: string; index: number }): void }> = ({
  onTabPress,
}) => {
  const screen = useScreenDimensions()
  const { tabLabels, activeTabIndex, setActiveTabIndex } = useStickyTabPageContext()
  activeTabIndex.useUpdates()

  const [tabLayouts, setTabLayouts] = useState<Array<LayoutRectangle | null>>(tabLabels.map(() => null))

  useEffect(() => {
    if (tabLayouts.length !== tabLabels.length) {
      console.error("sticky tab page tab bar does not support a dynamic list of tabs yet")
    }
  }, [tabLabels.length])

  const allTabLayoutsArePresent = tabLayouts.every(l => l)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (allTabLayoutsArePresent) {
      // attempt to center the active tab
      let left = 20
      for (let i = 0; i < activeTabIndex.current; i++) {
        left += tabLayouts[i]!.width
      }
      const center = left + tabLayouts[activeTabIndex.current]!.width / 2
      const scrollLeft = center - screen.width / 2
      scrollViewRef.current?.scrollTo({ x: scrollLeft })
    }
  }, [activeTabIndex.current])

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: color("black30"),
      }}
    >
      <View
        style={{
          flex: 1,
          minWidth: "100%",
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
            onLayout={e => {
              const layout = e.nativeEvent.layout
              setTabLayouts(layouts => {
                const result = layouts.slice(0)
                result[index] = layout
                return result
              })
            }}
            onPress={() => {
              setActiveTabIndex(index)
              onTabPress?.({ label, index })
            }}
          />
        ))}
        {!!allTabLayoutsArePresent && (
          <ActiveTabBorder tabLayouts={compact(tabLayouts)} activeTabIndex={activeTabIndex.current} />
        )}
      </View>
    </ScrollView>
  )
}

export const StickyTab: React.FC<{
  label: string
  active: boolean
  onLayout: ViewProperties["onLayout"]
  onPress(): void
}> = ({ label, active, onPress, onLayout }) => {
  return (
    <View onLayout={onLayout} style={{ flex: 1, height: TAB_BAR_HEIGHT }}>
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            height: TAB_BAR_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 15,
          }}
        >
          <Sans size="3" weight={active ? "medium" : "regular"}>
            {label}
          </Sans>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export function spring(node: Animated.Value, toValue: number) {
  return Animated.spring(node, { toValue, useNativeDriver: true, bounciness: -7, speed: 13 })
}

const ActiveTabBorder: React.FC<{ tabLayouts: LayoutRectangle[]; activeTabIndex: number }> = ({
  tabLayouts,
  activeTabIndex,
}) => {
  // We resize this border using the `scaleX` transform property rather than the `width` property, to avoid running
  // animations on the JS thread, so we need to set an initial, pre-transform span for the border.
  const preTransformSpan = 100

  const span = tabLayouts[activeTabIndex].width

  let left = 0
  for (let i = 0; i < activeTabIndex; i++) {
    left += tabLayouts[i].width
  }

  const translateX = useRef(new Animated.Value(left)).current
  const scaleX = useRef(new Animated.Value(span / preTransformSpan)).current

  useEffect(() => {
    Animated.parallel([spring(translateX, left), spring(scaleX, span / preTransformSpan)]).start()
  }, [left, span])

  const scaleXOffset = Animated.divide(
    Animated.subtract(preTransformSpan, Animated.multiply(scaleX, preTransformSpan)),
    2
  )

  return (
    <Animated.View
      style={{
        height: 2,
        width: preTransformSpan,
        backgroundColor: "black",
        position: "absolute",
        bottom: -1,
        left: space(2),
        transform: [
          {
            translateX: Animated.subtract(translateX, scaleXOffset),
          },
          {
            scaleX,
          },
        ],
      }}
    />
  )
}

import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Sans } from "palette"
import { NavigationalTabs } from "palette/elements/Tabs"
import React, { useEffect, useRef, useState } from "react"
import {
  Animated,
  LayoutRectangle,
  ScrollView,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native"
import { useStickyTabPageContext } from "./StickyTabPageContext"

export const TAB_BAR_HEIGHT = 48

export const StickyTabPageTabBar: React.FC<{
  onTabPress?(tab: { label: string; index: number }): void
}> = ({ onTabPress }) => {
  const screen = useScreenDimensions()
  const { tabLabels, activeTabIndex, setActiveTabIndex, tabSuperscripts } =
    useStickyTabPageContext()
  activeTabIndex.useUpdates()

  const [tabLayouts] = useState<Array<LayoutRectangle | null>>(tabLabels.map(() => null))

  useEffect(() => {
    if (tabLayouts.length !== tabLabels.length) {
      console.error("sticky tab page tab bar does not support a dynamic list of tabs yet")
    }
  }, [tabLabels.length])

  const allTabLayoutsArePresent = tabLayouts.every((l) => l)
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

  const v3Tabs = tabLabels.map((label, index) => ({ label, superscript: tabSuperscripts[index] }))
  return (
    <NavigationalTabs
      tabs={v3Tabs}
      onTabPress={(label, index) => {
        setActiveTabIndex(index)
        onTabPress?.({ label, index })
      }}
      activeTab={activeTabIndex.current}
    />
  )
}

export const StickyTab: React.FC<{
  label: string
  active: boolean
  onLayout: ViewProps["onLayout"]
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

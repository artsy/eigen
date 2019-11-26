import { color, Spacer } from "@artsy/palette"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useMemo, useState } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"
import { useTracking } from "react-tracking"
import { useAnimatedValue } from "./reanimatedHelpers"
import { SnappyHorizontalRail } from "./SnappyHorizontalRail"
import { StickyTabPageTabBar } from "./StickyTabPageTabBar"
import { StickyTabScrollView } from "./StickyTabScrollView"

interface TabProps {
  initial?: boolean
  title: string
  content: JSX.Element
}

/**
 * This page wrapper encapsulates a disappearing header and sticky tabs each with their own content
 *
 * At the moment all tabs are rendered at all times, as this isn't designed for more than 3 tabs
 * but if we need to have conditional rendering of tab content in the future it should be possible.
 *
 * Each tab optionally consumes a 'scroll view context' which could potentialy contain information
 * about whether the tab is being shown currently etc.
 */
export const StickyTabPage: React.FC<{
  tabs: TabProps[]
  headerContent: JSX.Element
}> = ({ tabs, headerContent }) => {
  const { width } = useScreenDimensions()
  const initialActiveIndex = useMemo(() => Math.max(tabs.findIndex(tab => tab.initial), 0), [])
  const [activeTabIndex, setActiveTabIndex] = useState(initialActiveIndex)
  const [headerHeight, setHeaderHeight] = useState<null | number>(null)
  const tracking = useTracking()
  const headerOffsetY = useAnimatedValue(0)

  return (
    <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* put tab content first because we want the header to be absolutely positioned _above_ it */}
      {headerHeight !== null && (
        <SnappyHorizontalRail offset={activeTabIndex * width}>
          {tabs.map(({ content }, index) => {
            return (
              <View style={{ flex: 1, width }} key={index}>
                <StickyTabScrollView
                  headerHeight={headerHeight}
                  content={content}
                  headerOffsetY={headerOffsetY}
                  isActive={index === activeTabIndex}
                />
              </View>
            )
          })}
        </SnappyHorizontalRail>
      )}
      <Animated.View
        style={{
          width,
          top: 0,
          position: "absolute",
          backgroundColor: color("white100"),
          transform: [{ translateY: headerOffsetY as any }],
        }}
      >
        <View onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
          {headerContent}
          <Spacer mb={1} />
        </View>
        <StickyTabPageTabBar
          labels={tabs.map(({ title }) => title)}
          initialActiveIndex={initialActiveIndex}
          onIndexChange={index => {
            setActiveTabIndex(index)
            tracking.trackEvent({
              action_name: tabs[index].title,
              action_type: Schema.ActionTypes.Tap,
            })
          }}
        />
      </Animated.View>
    </View>
  )
}

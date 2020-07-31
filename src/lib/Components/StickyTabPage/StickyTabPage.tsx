import { color } from "@artsy/palette"
import { Schema } from "lib/utils/track"
import { GlobalState, useGlobalState } from "lib/utils/useGlobalState"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useMemo, useRef, useState } from "react"
import { NativeModules, View } from "react-native"
import Animated from "react-native-reanimated"
import { useTracking } from "react-tracking"
import { useAnimatedValue } from "./reanimatedHelpers"
import { SnappyHorizontalRail } from "./SnappyHorizontalRail"
import { StickyTabPageFlatListContext } from "./StickyTabPageFlatList"
import { StickyTabPageTabBar } from "./StickyTabPageTabBar"

const { ARSwitchBoardModule } = NativeModules

const StickyTabPageContext = React.createContext<{
  staticHeaderHeight: Animated.Node<number> | null
  headerOffsetY: Animated.Value<number>
  tabLabels: string[]
  activeTabIndex: GlobalState<number>
  setActiveTabIndex(index: number): void
}>(
  __TEST__
    ? {
        staticHeaderHeight: new Animated.Value(0),
        headerOffsetY: new Animated.Value(0),
        tabLabels: ["test"],
        // tslint:disable-next-line:no-empty
        activeTabIndex: { current: 0, set() {}, useUpdates() {} },
        // tslint:disable-next-line:no-empty
        setActiveTabIndex() {},
      }
    : (null as any)
)

export function useStickyTabPageContext() {
  return React.useContext(StickyTabPageContext)
}

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
  staticHeaderContent: JSX.Element
  stickyHeaderContent?: JSX.Element
}> = ({ tabs, staticHeaderContent, stickyHeaderContent = <StickyTabPageTabBar /> }) => {
  const { width } = useScreenDimensions()
  const initialTabIndex = useMemo(
    () =>
      Math.max(
        tabs.findIndex(tab => tab.initial),
        0
      ),
    []
  )
  const activeTabIndexNative = useAnimatedValue(initialTabIndex)
  const [activeTabIndex, setActiveTabIndex] = useGlobalState(initialTabIndex)
  const { jsx: staticHeader, nativeHeight: staticHeaderHeight } = useAutoCollapsingMeasuredView(staticHeaderContent)
  const tracking = useTracking()
  const headerOffsetY = useAnimatedValue(0)
  const railRef = useRef<SnappyHorizontalRail>(null)

  const shouldHideBackButton = Animated.lessOrEq(headerOffsetY, -10)

  Animated.useCode(
    () =>
      Animated.onChange(
        shouldHideBackButton,
        Animated.call([shouldHideBackButton], ([shouldHide]) => {
          ARSwitchBoardModule.updateShouldHideBackButton(shouldHide)
        })
      ),
    []
  )

  return (
    <StickyTabPageContext.Provider
      value={{
        activeTabIndex,
        staticHeaderHeight,
        headerOffsetY,
        tabLabels: tabs.map(tab => tab.title),
        setActiveTabIndex(index) {
          setActiveTabIndex(index)
          activeTabIndexNative.setValue(index)
          railRef.current?.setOffset(index * width)
          tracking.trackEvent({
            action_name: tabs[index].title,
            action_type: Schema.ActionTypes.Tap,
          })
        },
      }}
    >
      <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* put tab content first because we want the header to be absolutely positioned _above_ it */}
        {staticHeaderHeight !== null && (
          <SnappyHorizontalRail ref={railRef} initialOffset={initialTabIndex * width} width={width * tabs.length}>
            {tabs.map(({ content }, index) => {
              return (
                <View style={{ flex: 1, width }} key={index}>
                  <StickyTabPageFlatListContext.Provider
                    value={{
                      tabIsActive: Animated.eq(index, activeTabIndexNative),
                    }}
                  >
                    {content}
                  </StickyTabPageFlatListContext.Provider>
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
          {staticHeader}
          {stickyHeaderContent}
        </Animated.View>
      </View>
    </StickyTabPageContext.Provider>
  )
}

function useAutoCollapsingMeasuredView(content: React.ReactChild) {
  const [nativeHeight, setNativeHeight] = useState<Animated.Value<number> | null>(
    __TEST__ ? new Animated.Value(100) : null
  )
  const animation = useRef<Animated.BackwardCompatibleWrapper | null>(null)

  return {
    nativeHeight,
    jsx: (
      <Animated.View style={{ height: nativeHeight!, overflow: "hidden" }}>
        <View
          onLayout={e => {
            if (nativeHeight) {
              if (animation.current) {
                animation.current.stop()
              }
              animation.current = Animated.spring(nativeHeight, {
                ...Animated.SpringUtils.makeDefaultConfig(),
                stiffness: 600,
                damping: 120,
                toValue: e.nativeEvent.layout.height,
              })
              animation.current.start(() => {
                animation.current = null
              })
            } else {
              setNativeHeight(new Animated.Value(e.nativeEvent.layout.height))
            }
          }}
        >
          {content}
        </View>
      </Animated.View>
    ),
  }
}

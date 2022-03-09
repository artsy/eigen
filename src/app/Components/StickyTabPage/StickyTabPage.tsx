import { useUpdateShouldHideBackButton } from "app/utils/hideBackButtonOnScroll"
import { Schema } from "app/utils/track"
import { useAutoCollapsingMeasuredView } from "app/utils/useAutoCollapsingMeasuredView"
import { useGlobalState } from "app/utils/useGlobalState"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Box } from "palette"
import React, { EffectCallback, useEffect, useMemo, useRef, useState } from "react"
import { LayoutAnimation, View } from "react-native"
import Animated from "react-native-reanimated"
import { useTracking } from "react-tracking"
import { useAnimatedValue } from "./reanimatedHelpers"
import { SnappyHorizontalRail } from "./SnappyHorizontalRail"
import { StickyTabPageContext, useStickyTabPageContext } from "./StickyTabPageContext"
import { StickyTabPageFlatListContext } from "./StickyTabPageFlatList"
import { StickyTabPageTabBar } from "./StickyTabPageTabBar"

export interface TabProps {
  initial?: boolean
  title: string
  content: JSX.Element | ((tabIndex: number) => JSX.Element)
  superscript?: string
}

interface StickyTabPageProps {
  tabs: TabProps[]
  staticHeaderContent?: JSX.Element
  stickyHeaderContent?: JSX.Element
  bottomContent?: JSX.Element
  // disableBackButtonUpdate allows the original BackButton visibility state. Useful when using StickyTabPage
  // as a root view where you don't want BackButton to ever be visible.
  disableBackButtonUpdate?: boolean
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
export const StickyTabPage: React.FC<StickyTabPageProps> = ({
  tabs,
  staticHeaderContent = <></>,
  stickyHeaderContent = <StickyTabPageTabBar />,
  bottomContent,
  disableBackButtonUpdate,
}) => {
  const { width } = useScreenDimensions()
  const initialTabIndex = useMemo(
    () =>
      Math.max(
        tabs.findIndex((tab) => tab.initial),
        0
      ),
    []
  )
  const activeTabIndexNative = useAnimatedValue(initialTabIndex)
  const [activeTabIndex, setActiveTabIndex] = useGlobalState(initialTabIndex)
  const [tabSpecificStickyHeaderContent, setTabSpecificStickyHeaderContent] = useState<
    Array<JSX.Element | null>
  >([])
  const [isStaticHeaderVisible, setIsStaticHeaderVisible] = useState(true)

  const { jsx: staticHeader, nativeHeight: staticHeaderHeight } = useAutoCollapsingMeasuredView(
    isStaticHeaderVisible ? staticHeaderContent : null
  )

  const stickyRailRef = useRef<SnappyHorizontalRail>(null)

  // This breaks the rules of hooks - you're not supposed to call them inside loops.
  // We're doing it anyway because useAutoCollapsingMeasuredView is a pure function and all we're
  // doing with tabSpecificStickyHeaderContentArray is rendering.
  // It's not involved in any conditionals. We're reasonably confident it will be deterministic, and
  // the alternative (making the hook take in an array of tabs) gets very complicated very quickly.
  const tabSpecificStickyHeaderContentArray = tabs.map((_, i) => {
    return useAutoCollapsingMeasuredView(tabSpecificStickyHeaderContent[i])
  })

  const { jsx: stickyHeader, nativeHeight: stickyHeaderHeight } =
    useAutoCollapsingMeasuredView(stickyHeaderContent)

  const tracking = useTracking()

  const headerOffsetY = useAnimatedValue(0)

  // We need to set the header offset to 0 after hiding or showing the static header.
  useEffect(() => {
    requestAnimationFrame(() => headerOffsetY.setValue(0))
  }, [isStaticHeaderVisible])

  const railRef = useRef<SnappyHorizontalRail>(null)

  const shouldHideBackButton = Animated.lessOrEq(headerOffsetY, -10)
  const updateShouldHideBackButton = useUpdateShouldHideBackButton()

  Animated.useCode(
    () =>
      Animated.cond(
        Animated.not(disableBackButtonUpdate),
        Animated.onChange(
          shouldHideBackButton,
          Animated.call([shouldHideBackButton], ([shouldHide]) => {
            updateShouldHideBackButton(!!shouldHide)
          })
        )
      ),
    []
  )

  return (
    <StickyTabPageContext.Provider
      value={{
        activeTabIndex,
        staticHeaderHeight,
        stickyHeaderHeight,
        headerOffsetY,
        tabLabels: tabs.map((tab) => tab.title),
        tabSuperscripts: tabs.map((tab) => tab.superscript),
        hideStaticHeader() {
          LayoutAnimation.spring()
          setIsStaticHeaderVisible(false)
        },
        showStaticHeader() {
          LayoutAnimation.spring()
          setIsStaticHeaderVisible(true)
        },
        setActiveTabIndex(index) {
          setActiveTabIndex(index)
          activeTabIndexNative.setValue(index)
          railRef.current?.setOffset(index * width)
          stickyRailRef.current?.setOffset(index * width)
          tracking.trackEvent({
            action_name: tabs[index].title,
            action_type: Schema.ActionTypes.Tap,
          })
        },
      }}
    >
      <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* put tab content first because we want the header to be absolutely positioned _above_ it */}

        {!!Animated.neq(stickyHeaderHeight, new Animated.Value(-1)) &&
          !!Animated.neq(staticHeaderHeight, new Animated.Value(-1)) && (
            <SnappyHorizontalRail
              ref={railRef}
              initialOffset={initialTabIndex * width}
              width={width * tabs.length}
            >
              {tabs.map(({ content }, index) => {
                return (
                  <View style={{ flex: 1, width }} key={index}>
                    <StickyTabPageFlatListContext.Provider
                      value={{
                        tabIsActive: Animated.eq(index, activeTabIndexNative),
                        tabSpecificContentHeight:
                          tabSpecificStickyHeaderContentArray[index].nativeHeight!,
                        setJSX: (jsx) =>
                          setTabSpecificStickyHeaderContent((prev) => {
                            const newArray = prev.slice(0)
                            newArray[index] = jsx
                            return newArray
                          }),
                      }}
                    >
                      {typeof content === "function" ? content(index) : content}
                    </StickyTabPageFlatListContext.Provider>
                  </View>
                )
              })}
            </SnappyHorizontalRail>
          )}
        <Animated.View
          style={{
            width,
            position: "absolute",
            transform: [{ translateY: headerOffsetY as any }],
          }}
          pointerEvents="box-none"
        >
          <Box backgroundColor="white">
            {staticHeader}
            {stickyHeader}
          </Box>
          <SnappyHorizontalRail
            width={width * tabs.length}
            ref={stickyRailRef}
            initialOffset={initialTabIndex * width}
            style={{ flex: undefined, alignItems: "flex-start" }}
          >
            {tabSpecificStickyHeaderContentArray.map((t, i) => (
              <Box key={i} width={width} backgroundColor="white">
                {t.jsx}
              </Box>
            ))}
          </SnappyHorizontalRail>
        </Animated.View>
        {bottomContent}
      </View>
    </StickyTabPageContext.Provider>
  )
}

export function useOnTabFocusedEffect(effect: EffectCallback, tabIndex: number) {
  const { activeTabIndex } = useStickyTabPageContext()
  activeTabIndex.useUpdates()

  useEffect(() => {
    if (activeTabIndex.current === tabIndex) {
      effect()
    }
  }, [activeTabIndex.current])
}

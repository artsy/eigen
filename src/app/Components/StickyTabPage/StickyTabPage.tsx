import { Box } from "@artsy/palette-mobile"
import { VisualClueName } from "app/store/config/visualClues"
import { useUpdateShouldHideBackButton } from "app/utils/hideBackButtonOnScroll"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { useAutoCollapsingMeasuredView } from "app/utils/useAutoCollapsingMeasuredView"
import { useGlobalState } from "app/utils/useGlobalState"
import React, { EffectCallback, useEffect, useMemo, useRef, useState } from "react"
import { FlatList, View } from "react-native"
import Animated from "react-native-reanimated"
import { useTracking } from "react-tracking"
import { SnappyHorizontalRail } from "./SnappyHorizontalRail"
import { StaticHeaderContainer } from "./StaticHeaderContainer"
import { StickyTabPageContext, useStickyTabPageContext } from "./StickyTabPageContext"
import { StickyTabPageFlatListContext } from "./StickyTabPageFlatList"
import { StickyTabPageTabBar } from "./StickyTabPageTabBar"
import { useAnimatedValue } from "./reanimatedHelpers"

export type RegisteredListRefs = Record<number, FlatList<any>>
export interface TabProps {
  initial?: boolean
  title: string
  content: JSX.Element | ((tabIndex: number) => JSX.Element)
  visualClues?: TabVisualClues
}

export type TabVisualClues = Array<{
  jsx: JSX.Element
  visualClueName: VisualClueName | string
}>

interface StickyTabPageProps {
  tabs: TabProps[]
  staticHeaderContent?: JSX.Element
  stickyHeaderContent?: JSX.Element
  bottomContent?: JSX.Element
  // disableBackButtonUpdate allows the original BackButton visibility state. Useful when using StickyTabPage
  // as a root view where you don't want BackButton to ever be visible.
  disableBackButtonUpdate?: boolean
  shouldTrackEventOnTabClick?: boolean
  onTabPress?: (tabIndex: number) => void
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
  shouldTrackEventOnTabClick = true,
  onTabPress,
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

  const enablePanOnStaticHeader = useFeatureFlag("AREnablePanOnStaticHeader")

  const { jsx: staticHeader, nativeHeight: staticHeaderHeight } =
    useAutoCollapsingMeasuredView(staticHeaderContent)

  const stickyRailRef = useRef<SnappyHorizontalRail>(null)

  // This breaks the rules of hooks - you're not supposed to call them inside loops.
  // We're doing it anyway because useAutoCollapsingMeasuredView is a pure function and all we're
  // doing with tabSpecificStickyHeaderContentArray is rendering.
  // It's not involved in any conditionals. We're reasonably confident it will be deterministic, and
  // the alternative (making the hook take in an array of tabs) gets very complicated very quickly.
  const tabSpecificStickyHeaderContentArray = tabs.map((_, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useAutoCollapsingMeasuredView(tabSpecificStickyHeaderContent[i])
  })

  const { jsx: stickyHeader, nativeHeight: stickyHeaderHeight } =
    useAutoCollapsingMeasuredView(stickyHeaderContent)

  const tracking = useTracking()

  const headerOffsetY = useAnimatedValue(0)

  const railRef = useRef<SnappyHorizontalRail>(null)

  const registeredListRefs = useRef<RegisteredListRefs>({})

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
        tabVisualClues: tabs.map((tab) => tab.visualClues),
        setActiveTabIndex(index) {
          setActiveTabIndex(index)
          activeTabIndexNative.setValue(index)
          railRef.current?.setOffset(index * width)
          stickyRailRef.current?.setOffset(index * width)

          if (shouldTrackEventOnTabClick) {
            tracking.trackEvent({
              action_name: tabs[index].title,
              action_type: Schema.ActionTypes.Tap,
            })
          }

          onTabPress?.(index)
        },
        adjustCurrentOffset() {
          railRef.current?.setOffset(activeTabIndex.current * width)
          stickyRailRef.current?.setOffset(activeTabIndex.current * width)
        },
        __INTERNAL__registerFlatListRef(ref: typeof FlatList, index: number) {
          registeredListRefs.current[index] = ref as any
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
                        __INTERNAL__indexInRail: index,
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
          {enablePanOnStaticHeader ? (
            <StaticHeaderContainer registeredListRefs={registeredListRefs.current}>
              {staticHeader}
              {stickyHeader}
            </StaticHeaderContainer>
          ) : (
            <Box backgroundColor="white100">
              {staticHeader}
              {stickyHeader}
            </Box>
          )}
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

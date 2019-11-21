import { Box, color, Flex, Sans, space, Spacer } from "@artsy/palette"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"

const TAB_BAR_HEIGHT = 48
const SHOW_HEADER_VELOCITY = 10

interface Tab {
  initial?: boolean
  title: string
  renderContent(): React.ReactNode
}

const SnappyHorizontalRail: React.FC<{ offset: number }> = ({ offset, children }) => {
  const currentOffset = useAnimatedValue(-offset)
  const { width } = useScreenDimensions()

  useEffect(
    () => {
      Animated.spring(currentOffset, {
        ...Animated.SpringUtils.makeDefaultConfig(),
        stiffness: 600,
        damping: 120,
        toValue: -offset,
      }).start()
    },
    [offset]
  )

  return (
    <Animated.View
      style={{
        flex: 1,
        width: width * 3,
        flexDirection: "row",
        transform: [
          {
            translateX: currentOffset as any,
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  )
}

export const StickyHeaderScrollView: React.FC<{
  tabs: Tab[]
  headerContent: JSX.Element
}> = ({ tabs, headerContent }) => {
  const { width } = useScreenDimensions()
  const [activeTabIndex, setActiveTabIndex] = useState(Math.max(tabs.findIndex(tab => tab.initial), 0))
  const [headerHeight, setHeaderHeight] = useState<null | number>(null)

  const headerOffsetY = useAnimatedValue(0)

  return (
    <Animated.View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* put tab content first because we want the header to be absolutely positioned _above_ it */}
      {headerHeight !== null && (
        <SnappyHorizontalRail offset={activeTabIndex * width}>
          {tabs.map(({ renderContent }, index) => {
            return (
              <View style={{ flex: 1, width }} key={index}>
                <TabContent
                  headerHeight={headerHeight}
                  renderContent={renderContent}
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
          backgroundColor: "white",
          transform: [{ translateY: headerOffsetY as any }],
        }}
      >
        <View onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}>
          {headerContent}
          <Spacer mb={1} />
        </View>
        <TabBar>
          {tabs.map(({ title }, index) => (
            <Tab
              key={title}
              label={title}
              active={activeTabIndex === index}
              onPress={() => {
                setActiveTabIndex(index)
              }}
            />
          ))}
        </TabBar>
      </Animated.View>
    </Animated.View>
  )
}

const TabBar: React.FC<{}> = ({ children }) => {
  return (
    <Flex
      style={{
        borderBottomWidth: 1,
        borderBottomColor: color("black30"),
        height: TAB_BAR_HEIGHT,
        flexDirection: "row",
        paddingRight: space(2),
        paddingLeft: space(2),
      }}
    >
      {children}
    </Flex>
  )
}

const Tab: React.FC<{ label: string; active: boolean; onPress(): void }> = ({ label, active, onPress }) => {
  return (
    <Flex style={{ flex: 1, height: TAB_BAR_HEIGHT }}>
      <TouchableOpacity onPress={onPress}>
        <Box
          style={{
            height: TAB_BAR_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: active ? color("black100") : color("black30"),
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

const StickyHeaderScrollTabContext = React.createContext<{
  scrollOffsetY: Animated.Node<number>
  contentHeight: Animated.Node<number>
  layoutHeight: Animated.Node<number>
}>(null)

export const useStickyTabContext = () => {
  return useContext(StickyHeaderScrollTabContext)
}

const TabContent: React.FC<{
  headerHeight: number
  headerOffsetY: Animated.Value<number>
  isActive: boolean
  renderContent(): React.ReactNode
}> = ({ headerHeight, headerOffsetY, renderContent, isActive }) => {
  // TODO: Decide if this should go back to 9999
  const contentHeight = useAnimatedValue(0)
  const layoutHeight = useAnimatedValue(0)
  const scrollOffsetY = useAnimatedValue(0)

  const { lockHeaderPosition } = useStickyHeaderPositioning({
    headerOffsetY,
    contentHeight,
    layoutHeight,
    headerHeight,
    scrollOffsetY,
  })

  const scrollViewRef = useRef<Animated.ScrollView>()

  const readVals = useValueReader({ headerOffsetY, scrollOffsetY })

  // make sure that when the tab becomes active it does not have any unsightly padding at the top in cases
  // where the header has been retracted but this tab is near the top of its content
  useEffect(
    () => {
      // this should only happen once each time the tab becomes active
      if (isActive) {
        readVals().then(vals => {
          if (-vals.headerOffsetY > vals.scrollOffsetY) {
            scrollViewRef.current.getNode().scrollTo({ y: -vals.headerOffsetY, animated: false })
          }
          setTimeout(() => {
            lockHeaderPosition.setValue(0)
          }, 10)
        })
      } else {
        lockHeaderPosition.setValue(1)
      }
    },
    [isActive]
  )

  return (
    <StickyHeaderScrollTabContext.Provider value={{ contentHeight, layoutHeight, scrollOffsetY }}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollOffsetY },
                contentSize: { height: contentHeight },
                layoutMeasurement: { height: layoutHeight },
              },
            },
          ],
          {
            useNativeDriver: true,
          }
        )}
        // we want every frame to trigger an update on the native side
        scrollEventThrottle={0.0000000001}
      >
        <Spacer mb={headerHeight + TAB_BAR_HEIGHT} />
        {renderContent()}
      </Animated.ScrollView>
    </StickyHeaderScrollTabContext.Provider>
  )
}

/**
 * returns a function which can asynchronously read the value of some native animated nodes
 * This is useful for values that change frequently on the native side but which you only
 * want to read occasionally on the JS side. It helps you avoid the perf hit of sending change
 * events over the bridge.
 * @param vals the animated vals to make the reader function for
 * @example
 * const scrollOffset = useMemo(() => new Animated.Value(0), [])
 * const readVals = useValueReader({scrollOffset})
 * // later, e.g. in a callback
 * const {scrollOffset} = await readVals()
 * console.log(scrollOffset) // => 632
 */
function useValueReader<T extends { [k: string]: Animated.Adaptable<number> }>(
  props: T
): () => Promise<{ [k in keyof T]: number }> {
  // this works by running some reanimated code every time an 'epoch' value
  // is incremented. That code calls a callback with the current values
  // to resolve a promise set up for the consumer
  const epochRef = useRef(0)
  const epoch = useAnimatedValue(0)
  const lastEpoch = useAnimatedValue(0)

  const readCallback = useRef<(vals: ReadonlyArray<number>) => void>()

  const keys = useMemo(
    () => {
      return Object.keys(props)
    },
    [props]
  )

  const vals = useMemo(
    () => {
      return keys.map(k => props[k])
    },
    [keys]
  )

  Animated.useCode(
    () =>
      Animated.cond(Animated.neq(epoch, lastEpoch), [
        Animated.set(lastEpoch, epoch),
        Animated.call([...vals], vs => {
          const cb = readCallback.current
          readCallback.current = null
          result.current = null
          cb(
            keys.reduce(
              (acc, k, i) => {
                acc[k] = vs[i]
                return acc
              },
              {} as any
            )
          )
        }),
      ]),
    [vals, keys]
  )

  const result = useRef<Promise<any>>()

  return () => {
    if (!result.current) {
      result.current = new Promise(resolve => {
        readCallback.current = resolve
        epochRef.current += 1
        epoch.setValue(epochRef.current)
      })
    }
    return result.current
  }
}

/**
 * returns a stable Animated.Value instance which starts off with the
 * given number. Note that the initialization parameter will be ignored
 * on subsequent renders
 * @param init
 */
function useAnimatedValue(init: number) {
  return useMemo(() => {
    return new Animated.Value(init)
  }, [])
}

function useStickyHeaderPositioning({
  headerHeight,
  scrollOffsetY,
  headerOffsetY,
  contentHeight,
  layoutHeight,
}: {
  headerHeight: number
  scrollOffsetY: Animated.Node<number>
  headerOffsetY: Animated.Value<number>
  contentHeight: Animated.Node<number>
  layoutHeight: Animated.Node<number>
}) {
  const lockHeaderPosition = useAnimatedValue(1)
  Animated.useCode(
    () => {
      // scrollDiff is the amount the header has scrolled since last time this code ran
      const scrollDiff = Animated.diff(scrollOffsetY)

      const upwardVelocityBreached = Animated.lessOrEq(scrollDiff, -SHOW_HEADER_VELOCITY)
      const headerIsNotFullyUp = Animated.neq(headerOffsetY, -headerHeight)

      const nearTheTop = Animated.lessOrEq(scrollOffsetY, headerHeight)

      // this is the code which actually performs the update to headerOffsetY, according to which direction
      // the scrolling is going
      const updateHeaderOffset = Animated.cond(
        Animated.greaterThan(scrollDiff, 0),
        [
          // y offset got bigger so scrolling down (content travels up the screen)
          // move the header up (hide it) unconditionally
          Animated.set(headerOffsetY, Animated.max(-headerHeight, Animated.sub(headerOffsetY, scrollDiff))),
        ],
        [
          // y offset got smaller so scrolling up (content travels down the screen)
          // if velocity is high enough or we're already moving the header up or we're near the top of the scroll view
          // then move the header down (show it)
          Animated.cond(Animated.or(upwardVelocityBreached, headerIsNotFullyUp, nearTheTop), [
            Animated.set(headerOffsetY, Animated.min(0, Animated.sub(headerOffsetY, scrollDiff))),
          ]),
        ]
      )

      // we don't want to manipulate the header position while bouncing at the top or the bottom of the scroll view
      // cause it feels weeeird
      const notBouncingAtTheTop = Animated.greaterThan(scrollOffsetY, 0)
      const notBouncingAtTheBottom = Animated.lessThan(scrollOffsetY, Animated.sub(contentHeight, layoutHeight))

      const updateHeaderOffsetWhenNotBouncingOrLocked = Animated.cond(
        Animated.and(notBouncingAtTheTop, notBouncingAtTheBottom, Animated.not(lockHeaderPosition)),
        updateHeaderOffset,
        // deref scroll diff to prevent diff buildup when ignoring changes
        scrollDiff
      )

      // on first eval (when the component mounts) the scroll values will be nonsensical so ignore
      const firstEval = new Animated.Value(1)
      return Animated.cond(
        firstEval,
        [
          Animated.set(firstEval, 0),
          // again, deref scrollDiff to prevent buildup
          scrollDiff,
        ],
        updateHeaderOffsetWhenNotBouncingOrLocked
      )
    },
    [headerHeight]
  )

  return { lockHeaderPosition }
}

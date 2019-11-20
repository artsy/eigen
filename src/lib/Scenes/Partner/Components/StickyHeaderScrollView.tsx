import { Box, color, Flex, Sans, space, Spacer } from "@artsy/palette"
import { PAGE_END_THRESHOLD } from "lib/utils/isCloseToBottom"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"

const TAB_BAR_HEIGHT = 48

interface Tab {
  initial?: boolean
  title: string
  renderContent(props: { onCloseToBottom(cb: () => void): void }): React.ReactNode
}

export const StickyHeaderScrollView: React.FC<{
  tabs: Tab[]
  headerContent: JSX.Element
}> = ({ tabs, headerContent }) => {
  const { width } = useScreenDimensions()
  const [activeTabIndex, setActiveTabIndex] = useState(Math.max(tabs.findIndex(tab => tab.initial), 0))
  const activeTabIndexNative = useMemo(() => {
    return new Animated.Value(activeTabIndex)
  }, [])

  useEffect(
    () => {
      Animated.spring(activeTabIndexNative, {
        ...Animated.SpringUtils.makeDefaultConfig(),
        stiffness: 600,
        damping: 120,
        toValue: activeTabIndex,
      }).start()
    },
    [activeTabIndex]
  )

  const scrollViewRefs: Animated.ScrollView[] = useMemo(
    () => {
      return tabs.map(() => null)
    },
    [tabs]
  )
  const yOffsets: Array<Animated.Value<number>> = useMemo(
    () => {
      return tabs.map(() => new Animated.Value(0))
    },
    [tabs]
  )

  const [headerHeight, setHeaderHeight] = useState<null | number>(null)
  // todo: set header height

  const stickyContentRef = useRef<Animated.View>()
  const headerContentRef = useRef<Animated.View>()

  useEffect(() => {
    headerContentRef.current.getNode().measure((_x, _y, _w, height) => {
      setHeaderHeight(height)
    })
  }, [])

  const readYOffsets = useDeref(yOffsets)

  const headerContentOffset = useMemo(
    () => {
      return Animated.multiply(-1, yOffsets[activeTabIndex])
    },
    [activeTabIndex]
  )

  return (
    <View style={{ flex: 1, position: "relative" }}>
      {headerHeight !== null && (
        <Animated.View
          style={{
            flex: 1,
            width: width * 3,
            flexDirection: "row",
            transform: [
              {
                translateX: Animated.interpolate(activeTabIndexNative, {
                  inputRange: [0, 1],
                  outputRange: [0, -width],
                }) as any,
              },
            ],
          }}
        >
          {tabs.map(({ renderContent }, index) => {
            return (
              <View style={{ flex: 1, width }}>
                <TabContent
                  headerHeight={headerHeight}
                  renderContent={renderContent}
                  yOffset={yOffsets[index]}
                  scrollViewRef={node => (scrollViewRefs[index] = node)}
                />
              </View>
            )
          })}
        </Animated.View>
      )}
      <View style={{ width, top: 0, position: "absolute" }}>
        <Animated.View ref={headerContentRef} style={{ transform: [{ translateY: headerContentOffset as any }] }}>
          {headerContent}
          <Spacer mb={1} />
        </Animated.View>
        <Animated.View
          ref={stickyContentRef}
          style={{
            transform: [{ translateY: Animated.max(-headerHeight, headerContentOffset) as any }],
            backgroundColor: "white",
          }}
        >
          <TabBar>
            {tabs.map(({ title }, index) => (
              <Tab
                key={title}
                label={title}
                active={activeTabIndex === index}
                onPress={async () => {
                  const ys = await readYOffsets()
                  const nextTabScrollOffset = ys[index]
                  const currentTabScrollOffset = ys[activeTabIndex]
                  if (nextTabScrollOffset < headerHeight) {
                    scrollViewRefs[index]
                      .getNode()
                      .scrollTo({ y: Math.min(currentTabScrollOffset, headerHeight), animated: false })
                  }
                  setActiveTabIndex(index)
                }}
              />
            ))}
          </TabBar>
        </Animated.View>
      </View>
    </View>
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

const TabContent: React.FC<{
  headerHeight: number
  scrollViewRef: React.Ref<Animated.ScrollView>
  yOffset: Animated.Value<number>
  renderContent(props: { onCloseToBottom(cb: () => void): void }): React.ReactNode
}> = ({ headerHeight, scrollViewRef, yOffset, renderContent }) => {
  const contentHeight = useMemo(() => {
    // start off super high to avoid triggering on initial load
    return new Animated.Value(+99999999)
  }, [])

  const layoutHeight = useMemo(() => {
    return new Animated.Value(0 as number)
  }, [])

  const isCloseToBottom = useMemo(() => {
    const bottomYOffset = Animated.sub(contentHeight, layoutHeight)
    const distanceFromBottom = Animated.sub(bottomYOffset, yOffset)
    return Animated.lessOrEq(distanceFromBottom, PAGE_END_THRESHOLD)
  }, [])

  const onCloseToBottom = useRef<() => void>()

  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      ref={scrollViewRef}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: { y: yOffset },
              contentSize: { height: contentHeight },
              layoutMeasuremet: { height: layoutHeight },
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
      <Animated.Code>
        {() =>
          // TODO: debounce on native side 🤔
          Animated.cond(
            isCloseToBottom,
            Animated.call([], () => {
              if (onCloseToBottom.current) {
                onCloseToBottom.current()
              }
            })
          )
        }
      </Animated.Code>
      <Spacer mb={headerHeight + TAB_BAR_HEIGHT} />
      {renderContent({
        onCloseToBottom(cb) {
          onCloseToBottom.current = cb
        },
      })}
    </Animated.ScrollView>
  )
}

function useDeref(vals: ReadonlyArray<Animated.Node<number>>) {
  const epochRef = useRef(0)
  const epoch = useMemo(() => {
    return new Animated.Value(0 as number)
  }, [])

  const readCallback = useRef<(vals: ReadonlyArray<number>) => void>()

  Animated.useCode(
    () =>
      Animated.onChange(epoch, [
        Animated.call(vals, vs => {
          const cb = readCallback.current
          readCallback.current = null
          result.current = null
          cb(vs)
        }),
      ]),
    []
  )

  const result = useRef<Promise<ReadonlyArray<number>>>()

  return () => {
    if (!result.current) {
      result.current = new Promise<ReadonlyArray<number>>(resolve => {
        readCallback.current = resolve
        epoch.setValue(++epochRef.current)
      })
    }
    return result.current
  }
}

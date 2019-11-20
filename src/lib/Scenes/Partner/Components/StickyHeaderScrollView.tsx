import { Box, color, Flex, Sans, space, Spacer } from "@artsy/palette"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { FlatList, TouchableOpacity, View } from "react-native"
import Animated from "react-native-reanimated"

const TAB_BAR_HEIGHT = 48

interface Tab {
  initial?: boolean
  title: string
  renderContent(props: { yOffset: Animated.Node<number> }): React.ReactNode
}

export const StickyHeaderScrollView: React.FC<{
  tabs: Tab[]
  headerContent: JSX.Element
}> = ({ tabs, headerContent }) => {
  const { width } = useScreenDimensions()
  const [activeTabIndex, setActiveTabIndex] = useState(Math.max(tabs.findIndex(tab => tab.initial), 0))
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

  const flatListRef = useRef<FlatList<any>>()
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
        <FlatList
          ref={flatListRef}
          horizontal
          data={tabs}
          scrollEnabled={false}
          snapToInterval={width}
          style={{ flex: 1 }}
          keyExtractor={(_, index) => index.toLocaleString()}
          renderItem={({ item, index }) => {
            return (
              <Animated.ScrollView
                key={index}
                style={{ flex: 1, paddingTop: headerHeight + TAB_BAR_HEIGHT, width }}
                showsVerticalScrollIndicator={false}
                ref={node => (scrollViewRefs[index] = node)}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: yOffsets[index] } } }], {
                  useNativeDriver: true,
                })}
                // we want every frame to trigger an update on the native side
                scrollEventThrottle={0.0000000001}
              >
                {item.renderContent({ yOffset: yOffsets[index] })}
              </Animated.ScrollView>
            )
          }}
        />
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
                  flatListRef.current.scrollToOffset({ animated: true, offset: width * index })
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

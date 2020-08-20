import React, { useRef, useState } from "react"
import { FlatList, FlatListProps, ScrollViewProps, ViewabilityConfig, ViewToken } from "react-native"

export const LazyScrollView: React.FC<{
  children: Array<React.ReactElement | null | React.ReactElement[]> // only allow react elements as children (not string for example like `Text`)
  initialNumToRender?: number
  onVisiblePointsChanged?: ({ visiblePoints, changed }: { visiblePoints: string[]; changed: string[] }) => void

  // FlatList specific stuff
  windowSize?: FlatListProps<any>["windowSize"]
  viewabilityConfig?: { itemVisiblePercentThreshold: number }
} & ScrollViewProps> = ({
  initialNumToRender = 1,
  onVisiblePointsChanged,
  windowSize,
  viewabilityConfig: propViewabilityConfig,
  ...restProps
}) => {
  const [userHasScrolled, setUserHasScrolled] = useState(false)

  const sections = React.Children.toArray(restProps.children) as React.ReactElement[]

  const viewabilityConfig = useRef<ViewabilityConfig>(propViewabilityConfig ?? { itemVisiblePercentThreshold: 50 })
  const handleVisiblePoints = useRef(
    ({ viewableItems, changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      // SOMETHING FUNKY IS GOING ON HERE!!
      // I should be able to use the func just with `onVisiblePointsChanged?({visible: [], changed: []})`
      if (!onVisiblePointsChanged) {
        return
      }

      onVisiblePointsChanged({
        visiblePoints: viewableItems.map(token => token.key),
        changed: changed.map(token => token.key),
      })
    }
  )

  return (
    <FlatList
      {...restProps}
      initialNumToRender={initialNumToRender}
      data={sections}
      renderItem={({ item }) => item}
      onViewableItemsChanged={handleVisiblePoints.current}
      viewabilityConfig={viewabilityConfig.current}
      onScrollBeginDrag={() => setUserHasScrolled(true)}
      windowSize={userHasScrolled ? windowSize || 5 : 1}
    />
  )
}

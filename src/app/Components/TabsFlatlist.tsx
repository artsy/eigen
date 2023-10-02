import { Tabs } from "@artsy/palette-mobile"
import { FlatList, FlatListProps } from "react-native"

export interface TabsFlatListProps
  extends Omit<
    FlatListProps<any>,
    "onScroll" | "data" | "scrollEventThrottle" | "ListHeaderComponent" | "renderItem"
  > {
  data: any[]
  paddingHorizontal?: number
  innerRef?: React.MutableRefObject<{ getNode(): FlatList<any> } | null>
}

/**
 * This component was introduced to solve https://artsyproduct.atlassian.net/browse/DIA-63 issue and only this.
 * Please do not use it for any other purpose. It will be removed once we have a better solution.
 * Used **only** for sticky surfaces that include the infiniteScrollArtworkGrid
 */
export const TabsFlatList: React.FC<Omit<TabsFlatListProps, "data">> = ({
  children,
  ...others
}) => {
  return (
    <Tabs.FlatList
      data={[{ key: "content", content: <>{children}</> }]}
      {...others}
      renderItem={({ item }) => item.content}
    />
  )
}

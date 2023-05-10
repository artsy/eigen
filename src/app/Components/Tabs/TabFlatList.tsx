import { useSpace } from "@artsy/palette-mobile"
import { FlatListProps } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"

export function TabFlatList<T>(props: FlatListProps<T>) {
  const space = useSpace()

  const contentContainerStyle = (props.contentContainerStyle ?? {}) as object

  return (
    <Tabs.FlatList
      contentContainerStyle={{
        marginHorizontal: space(2),
        ...contentContainerStyle,
      }}
      {...props}
    />
  )
}

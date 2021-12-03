import { PropsWithChildren } from "react"
import { FlatListProps, ScrollView } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { withCollapsableHeader } from "./withCollapsableHeader"

export const CollapsableHeaderFlatList = withCollapsableHeader(FlatList) as <T>(
  props: PropsWithChildren<FlatListProps<T>>
) => JSX.Element

export const CollapsableHeaderScrollView = withCollapsableHeader(ScrollView)

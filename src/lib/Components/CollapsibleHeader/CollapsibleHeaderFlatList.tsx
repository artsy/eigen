import { PropsWithChildren } from "react"
import { FlatListProps, ScrollView } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { withCollapsibleHeader } from "./withCollapsibleHeader"

export const CollapsibleHeaderFlatList = withCollapsibleHeader(FlatList) as <T>(
  props: PropsWithChildren<FlatListProps<T>>
) => JSX.Element

export const CollapsibleHeaderScrollView = withCollapsibleHeader(ScrollView)

import { PropsWithChildren } from "react"
import { FlatList, FlatListProps, ScrollView } from "react-native"
import { withCollapsibleHeader } from "./withCollapsibleHeader"

export const CollapsibleHeaderFlatList = withCollapsibleHeader(FlatList) as <T>(
  props: PropsWithChildren<FlatListProps<T>>
) => JSX.Element

export const CollapsibleHeaderScrollView = withCollapsibleHeader(ScrollView)

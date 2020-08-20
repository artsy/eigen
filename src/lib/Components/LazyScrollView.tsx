import React from "react"
import { ScrollViewProps } from "react-native"
import { AboveTheFoldFlatList } from "./AboveTheFoldFlatList"

export const LazyScrollView: React.FC<{
  children: Array<React.ReactElement | null> // only allow react elements as children (not string for example like `Text`)
  initialNumToRender?: number
} & ScrollViewProps> = ({ initialNumToRender = 1, ...props }) => {
  const sections = React.Children.toArray(props.children) as React.ReactElement[]

  return (
    <AboveTheFoldFlatList
      {...props}
      initialNumToRender={initialNumToRender}
      data={sections}
      renderItem={({ item }) => {
        return item
      }}
    />
  )
}

import React from "react"
import { AboveTheFoldFlatList } from "./AboveTheFoldFlatList"

export const LazyScrollView: React.FC<{ initialNumToRender: number }> = props => {
  const sections = React.Children.toArray(props.children) as React.ReactElement[]

  return (
    <AboveTheFoldFlatList
      {...props}
      data={sections}
      renderItem={({ item }) => {
        return item
      }}
    />
  )
}

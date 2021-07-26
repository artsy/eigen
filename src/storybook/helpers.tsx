import { Spacer } from "palette"
import React from "react"
import { FlatList, ScrollView } from "react-native"

export const DList = <ItemT,>({
  data,
  keyExtractor,
  renderItem,
}: {
  data: ItemT[]
  keyExtractor?: (item: ItemT, index: number) => string
  renderItem: (info: { item: ItemT; index: number }) => React.ReactElement | null
}) => (
  <FlatList
    data={data}
    keyExtractor={keyExtractor ?? ((item) => `${item}`)}
    renderItem={renderItem}
    ItemSeparatorComponent={() => <Spacer mb="4" />}
    contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}
  />
)

export const List = ({ children }: { children: React.ReactElement[] }) => (
  <FlatList
    data={children}
    keyExtractor={(_, index) => `${index}`}
    renderItem={({ item: child }) => child}
    ItemSeparatorComponent={() => <Spacer mb="4" />}
    contentContainerStyle={{ flexGrow: 1, alignItems: "center", justifyContent: "center" }}
  />
)

export const CenterView = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
      }}
    >
      {children}
    </ScrollView>
  )
}

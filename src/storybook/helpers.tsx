import { Flex, Spacer } from "palette"
import React from "react"
import { FlatList, StyleProp, ViewStyle } from "react-native"

export const DataList = <ItemT,>({
  data,
  keyExtractor,
  renderItem,
  contentContainerStyle,
}: {
  data: ItemT[]
  keyExtractor?: (item: ItemT, index: number) => string
  renderItem: (info: { item: ItemT; index: number }) => React.ReactElement | null
  contentContainerStyle?: StyleProp<ViewStyle>
}) => (
  <FlatList
    data={data}
    keyExtractor={keyExtractor ?? ((item) => `${item}`)}
    renderItem={renderItem}
    ItemSeparatorComponent={() => <Spacer mb="4" />}
    contentContainerStyle={[
      {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30,
      },
      contentContainerStyle,
    ]}
  />
)

export const List = ({
  children,
  contentContainerStyle,
  style,
}: {
  children: React.ReactElement[] | React.ReactElement
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}) => (
  <FlatList
    data={Array.isArray(children) ? children : [children]}
    keyExtractor={(_, index) => `${index}`}
    renderItem={({ item: child }) => child}
    ItemSeparatorComponent={() => <Spacer mb="4" />}
    contentContainerStyle={[
      {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 30,
      },
      contentContainerStyle,
    ]}
    style={style}
  />
)

export const Row = ({ children }: { children: React.ReactNode }) => (
  <Flex width="100%" flexDirection="row" justifyContent="space-evenly">
    {children}
  </Flex>
)

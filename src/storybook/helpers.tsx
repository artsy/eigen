import { Flex, Spacer } from "palette"
import React from "react"
import { FlatList, ScrollView, StyleProp, ViewStyle } from "react-native"

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
    contentContainerStyle={{
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      paddingBottom: 30,
    }}
  />
)

export const List = ({
  children,
  contentContainerStyle,
  style,
}: {
  children: React.ReactElement[]
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
}) => (
  <FlatList
    data={children}
    keyExtractor={(_, index) => `${index}`}
    renderItem={({ item: child }) => child}
    ItemSeparatorComponent={() => <Spacer mb="4" />}
    contentContainerStyle={[
      { flexGrow: 1, alignItems: "center", marginTop: 30, paddingBottom: 60 },
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

export const CenterView = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        marginTop: 30,
        paddingBottom: 30,
      }}
    >
      {children}
    </ScrollView>
  )
}

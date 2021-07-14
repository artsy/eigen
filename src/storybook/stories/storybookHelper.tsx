import { Spacer } from "palette"
import React, { ReactNode } from "react"
import { ScrollView, View } from "react-native"

export const List = ({ children }: { children: ReactNode[] }) => (
  <>
    {children.map((item, index) => (
      <View key={index}>
        {item}
        <Spacer mb={4} />
      </View>
    ))}
  </>
)

export const CenterView = ({ children }: { children: ReactNode }) => {
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

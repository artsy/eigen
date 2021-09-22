import { Text } from "palette"
import { useColor } from "palette/hooks"
import React from "react"
import { Pressable, View, ViewProps, ViewStyle } from "react-native"

export interface TabV3Props {
  label: string | Element
  active: boolean
  style?: ViewStyle
  onPress: () => void
  onLayout: ViewProps["onLayout"]
}

export const TabV3: React.FC<TabV3Props> = ({ label, active, onLayout, onPress, style }) => {
  const color = useColor()
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          onLayout={onLayout}
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            ...style,
          }}
        >
          <Text
            fontSize={"16px"}
            color={active ? color("black100") : pressed ? color("blue100") : color("black60")}
            style={{
              textDecorationLine: pressed ? "underline" : "none",
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  )
}

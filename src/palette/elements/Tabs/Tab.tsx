import { Text } from "palette"
import { useColor } from "palette/hooks"
import React from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"

export interface TabProps {
  id?: string
  label: string
  active: boolean
  style?: ViewStyle
  onPress: () => void
}

export const TabV3: React.FC<TabProps> = ({ label, active, onPress, style }) => {
  const color = useColor()
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          height: 55,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 15,
          ...style,
        }}
      >
        <Text color={active ? color("black100") : color("black60")}>{label}</Text>
      </View>
    </TouchableOpacity>
  )
}

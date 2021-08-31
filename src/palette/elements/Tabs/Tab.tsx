import { Text } from "palette"
import React from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"

interface TabProps {
  id?: string
  label: string
  active: boolean
  style?: ViewStyle
  onPress: () => void
}

/**
 * The render method for an individual tab. Will underline the currently
 * active tab.
 */
export const Tab: React.FC<TabProps> = ({ label, active, onPress, style }) => {
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
        <Text variant={active ? "mediumText" : "text"}>{label}</Text>
      </View>
    </TouchableOpacity>
  )
}

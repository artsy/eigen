import React from "react"
import { Text, TouchableOpacity } from "react-native"
import { textStyle } from "./styles"

interface AppClipButtonProps {
  label: string
  onPress: (event: any) => void
}

export const AppClipButton: React.FC<AppClipButtonProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "black",
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          ...textStyle,
          color: "white",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

import { useColor, Text, TextProps } from "@artsy/palette-mobile"
import { ViewProps, Pressable, View, ViewStyle } from "react-native"

export interface TabProps {
  label: string
  superscript?: React.JSX.Element
  active: boolean
  style?: ViewStyle
  onPress: () => void
  onLayout: ViewProps["onLayout"]
  variant?: TextProps["variant"]
}

export const Tab: React.FC<TabProps> = ({
  label,
  superscript,
  active,
  onLayout,
  onPress,
  style,
  variant,
}) => {
  const color = useColor()
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {({ pressed }) => (
        <View
          onLayout={onLayout}
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            flexDirection: "row",
            ...style,
          }}
        >
          <Text
            {...(variant ? { variant } : { fontSize: 16 })}
            color={active ? color("mono100") : pressed ? color("blue100") : color("mono60")}
            style={{
              textDecorationLine: pressed ? "underline" : "none",
            }}
          >
            {label}
          </Text>
          {superscript}
        </View>
      )}
    </Pressable>
  )
}

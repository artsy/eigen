import { Touchable } from "palette"
import React from "react"
import { StyleProp, ViewStyle } from "react-native"
import Animated from "react-native-reanimated"

interface ArtistHeaderButtonProps {
  containerStyle?: StyleProp<Animated.AnimateStyle<ViewStyle>>
  shouldHide?: boolean
  onPress: () => void
}

// Constants
const BUTTON_SIZE = 40

export const ArtistHeaderButton: React.FC<ArtistHeaderButtonProps> = (props) => {
  const { shouldHide, containerStyle, children, onPress } = props

  return (
    <Animated.View
      pointerEvents={shouldHide ? "none" : "auto"}
      style={[
        {
          zIndex: 1,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          borderRadius: BUTTON_SIZE / 2,
          backgroundColor: "white",
        },
        containerStyle,
      ]}
    >
      <Touchable
        style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
        onPress={onPress}
      >
        {children}
      </Touchable>
    </Animated.View>
  )
}

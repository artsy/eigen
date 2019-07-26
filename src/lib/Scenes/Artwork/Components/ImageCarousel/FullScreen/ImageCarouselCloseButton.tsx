import { CloseIcon } from "@artsy/palette"
import { observer } from "mobx-react"
import { useContext } from "react"
import React from "react"
import { Animated, TouchableOpacity, View } from "react-native"
import { SafeAreaInsetsContext } from "../../SafeAreaInsetsContext"
import { boxShadow } from "./boxShadow"
import { useSpringFade } from "./useSpringFade"

// taken from https://github.com/artsy/eigen/blob/0831853cb574566415f3bd8b3908b26b61f61eec/Artsy/View_Controllers/Util/ARNavigationController.m#L125
const CLOSE_BUTTON_MARGIN = 12

export const ImageCarouselCloseButton: React.FC<{ onClose(): void }> = observer(({ onClose }) => {
  const opacity = useSpringFade("in")
  const { top } = useContext(SafeAreaInsetsContext)
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        top,
      }}
    >
      <TouchableOpacity onPress={onClose}>
        <View
          style={{
            width: 40,
            height: 40,
            paddingLeft: CLOSE_BUTTON_MARGIN,
            paddingTop: CLOSE_BUTTON_MARGIN,
            paddingRight: 20,
            paddingBottom: 20,
          }}
        >
          <Animated.View
            style={[
              boxShadow,
              {
                opacity,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <CloseIcon />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  )
})

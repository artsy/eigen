import { CloseIcon } from "@artsy/palette"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useContext } from "react"
import { TouchableOpacity, View } from "react-native"
import { ImageCarouselContext } from "../ImageCarouselContext"
import { boxShadow } from "./boxShadow"

// taken from https://github.com/artsy/eigen/blob/0831853cb574566415f3bd8b3908b26b61f61eec/Artsy/View_Controllers/Util/ARNavigationController.m#L125
const CLOSE_BUTTON_MARGIN = 12

export const ImageCarouselCloseButton = ({ onClose }: { onClose(): void }) => {
  const { safeAreaInsets } = useScreenDimensions()
  const { fullScreenState } = useContext(ImageCarouselContext)
  fullScreenState.useUpdates()

  const showCloseButton =
    fullScreenState.current === "entered" || fullScreenState.current === "animating entry transition"
  return (
    <View
      style={{
        position: "absolute",
        top: safeAreaInsets.top,
        left: safeAreaInsets.left,
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
          <View
            style={[
              boxShadow,
              {
                opacity: showCloseButton ? 1 : 0,
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
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

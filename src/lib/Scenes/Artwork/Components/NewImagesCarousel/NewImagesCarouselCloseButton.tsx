import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { CloseIcon } from "palette"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { NewImagesCarouselStore } from "./NewImagesCarouselContext"

// taken from https://github.com/artsy/eigen/blob/0831853cb574566415f3bd8b3908b26b61f61eec/Artsy/View_Controllers/Util/ARNavigationController.m#L125
const CLOSE_BUTTON_MARGIN = 12

export const NewImagesCarouselCloseButton = ({ onClose }: { onClose(): void }) => {
  const { safeAreaInsets } = useScreenDimensions()
  const fullScreenState = NewImagesCarouselStore.useStoreState((state) => state.fullScreenState)

  const showCloseButton = fullScreenState === "entered" || fullScreenState === "entering"

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

import { StyleSheet } from "react-native"

const boxShadow = StyleSheet.create({
  boxShadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
}).boxShadow

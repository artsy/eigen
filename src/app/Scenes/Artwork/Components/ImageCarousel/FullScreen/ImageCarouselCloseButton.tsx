import { CloseIcon, useColor } from "@artsy/palette-mobile"
import { ImageCarouselContext } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { useScreenDimensions } from "app/utils/hooks"
import { MotiView } from "moti"
import { useContext } from "react"
import { TouchableOpacity, View } from "react-native"
import { boxShadow } from "./boxShadow"

// taken from https://github.com/artsy/eigen/blob/0831853cb574566415f3bd8b3908b26b61f61eec/Artsy/View_Controllers/Util/ARNavigationController.m#L125
const CLOSE_BUTTON_MARGIN = 12

export const ImageCarouselCloseButton = ({ onClose }: { onClose(): void }) => {
  const { safeAreaInsets } = useScreenDimensions()
  const color = useColor()

  const { fullScreenState } = useContext(ImageCarouselContext)
  fullScreenState.useUpdates()

  return (
    <View
      style={{
        position: "absolute",
        top: safeAreaInsets.top,
        left: safeAreaInsets.left,
        zIndex: 1,
      }}
    >
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close" onPress={onClose}>
        <View
          style={{
            width: 40,
            height: 40,
            paddingLeft: CLOSE_BUTTON_MARGIN,
            paddingTop: 2,
            paddingRight: 20,
            paddingBottom: 20,
          }}
        >
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "timing", duration: 200, delay: 400 }}
          >
            <View
              style={[
                boxShadow,
                {
                  opacity: 1,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: color("mono0"),
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <CloseIcon />
            </View>
          </MotiView>
        </View>
      </TouchableOpacity>
    </View>
  )
}

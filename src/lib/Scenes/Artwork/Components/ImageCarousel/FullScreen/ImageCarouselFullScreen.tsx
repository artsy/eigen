import { observer } from "mobx-react"
import React, { useCallback, useContext, useMemo } from "react"
import { Animated, FlatList, Modal, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { ImageCarouselContext, ImageDescriptor } from "../ImageCarouselContext"
import { ImageCarouselCloseButton } from "./ImageCarouselCloseButton"
import { ImageZoomView } from "./ImageZoomView"
import { IndexIndicator } from "./IndexIndicator"
import { screenBoundingBox, screenWidth } from "./screen"
import { StatusBarOverlay } from "./StatusBarOverlay"
import { useSpringFade } from "./useSpringFade"
import { VerticalSwipeToDismiss } from "./VerticalSwipeToDismiss"

export const ImageCarouselFullScreen = observer(() => {
  const { images, dispatch, state } = useContext(ImageCarouselContext)
  const initialScrollIndex = useMemo(() => state.imageIndex, [])

  const onClose = useCallback(() => {
    if (state.fullScreenState === "entered") {
      dispatch({ type: "FULL_SCREEN_DISMISSED" })
    }
  }, [])

  // update the imageIndex on scroll
  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextImageIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth)
    if (state.fullScreenState === "entered" && nextImageIndex !== state.imageIndex) {
      dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex })
    }
  }, [])

  const zoomViewRefs: ImageZoomView[] = useMemo(() => [], [])

  return (
    // on mount we want the modal to be visible instantly and handle transitions elsewhere ourselves
    // on unmount we use it's built-in fade transition
    <Modal transparent animated={false} animationType="fade">
      <WhiteUnderlay />
      <VerticalSwipeToDismiss onClose={onClose}>
        <FlatList<ImageDescriptor>
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={images.length > 1 && state.fullScreenState === "entered"}
          snapToInterval={screenBoundingBox.width}
          keyExtractor={item => item.url}
          decelerationRate="fast"
          initialScrollIndex={initialScrollIndex}
          getItemLayout={(_, index) => ({
            index,
            offset: index * screenWidth,
            length: screenWidth,
          })}
          onScroll={onScroll}
          onMomentumScrollEnd={() => {
            // reset the zooms of all non-visible zoom views when the horizontal carousel comes to a stop
            for (let i = 0; i < images.length; i++) {
              if (i !== state.imageIndex && zoomViewRefs[i]) {
                zoomViewRefs[i].resetZoom()
              }
            }
          }}
          renderItem={({ item, index }) => {
            return (
              <ImageZoomView
                image={item}
                index={index}
                ref={ref => {
                  zoomViewRefs[index] = ref
                }}
              />
            )
          }}
        />
      </VerticalSwipeToDismiss>
      <StatusBarOverlay />
      <ImageCarouselCloseButton onClose={onClose} />
      <IndexIndicator />
    </Modal>
  )
})

/**
 * Used as a backdrop to the full screen image carousel.
 * fades in at the same time as the shared element transition
 * is playing
 */
const WhiteUnderlay: React.FC = observer(() => {
  const opacity = useSpringFade("in")

  return (
    <Animated.View
      style={{
        backgroundColor: "white",
        opacity,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    />
  )
})

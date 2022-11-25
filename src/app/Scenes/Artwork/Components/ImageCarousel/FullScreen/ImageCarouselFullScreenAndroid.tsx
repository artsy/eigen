import { useCallback, useContext, useEffect, useMemo } from "react"
import { FlatList, Modal, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { createZoomListComponent } from "react-native-reanimated-zoom"
import { useScreenDimensions } from "shared/hooks/useScreenDimensions"
import { ImageCarouselContext, ImageDescriptor } from "../ImageCarouselContext"
import { ImageCarouselCloseButton } from "./ImageCarouselCloseButton"
import { ImageZoomViewAndroid } from "./ImageZoomViewAndroid"
import { IndexIndicator } from "./IndexIndicator"

const ZoomFlatList = createZoomListComponent(FlatList)

export const ImageCarouselFullScreenAndroid = () => {
  const screenDimensions = useScreenDimensions()
  const { images, dispatch, fullScreenState, imageIndex } = useContext(ImageCarouselContext)
  fullScreenState.useUpdates()
  const initialScrollIndex = useMemo(() => imageIndex.current, [])

  const onClose = useCallback(() => {
    if (fullScreenState.current === "entered") {
      dispatch({ type: "FULL_SCREEN_DISMISSED" })
    }
  }, [])

  useEffect(() => {
    if (fullScreenState.current === "exiting") {
      requestAnimationFrame(() => {
        dispatch({ type: "FULL_SCREEN_FINISHED_EXITING" })
      })
    }
  }, [fullScreenState.current])

  const renderItem = useCallback(
    ({ item: image, index }: { item: ImageDescriptor; index: number }) => {
      return <ImageZoomViewAndroid image={image} index={index} />
    },
    [screenDimensions.orientation]
  )

  // update the imageIndex on scroll
  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const nextImageIndex = Math.round(e.nativeEvent.contentOffset.x / screenDimensions.width)
      if (fullScreenState.current === "entered" && nextImageIndex !== imageIndex.current) {
        dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex })
      }
    },
    [screenDimensions.orientation]
  )

  console.log("initialScrollIndex => ", initialScrollIndex)

  return (
    // on mount we want the modal to be visible instantly and handle transitions elsewhere ourselves
    // on unmount we use it's built-in fade transition
    <Modal
      transparent
      animated
      hardwareAccelerated
      supportedOrientations={["landscape", "portrait"]}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
        <ZoomFlatList
          data={images}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={(item) => item.url!}
          renderItem={renderItem}
          key={screenDimensions.orientation}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          initialScrollIndex={initialScrollIndex}
          getItemLayout={(_, index) => ({
            index,
            offset: index * screenDimensions.width,
            length: screenDimensions.width,
          })}
          onScroll={onScroll}
          initialNumToRender={2}
        />
        <ImageCarouselCloseButton onClose={onClose} />
        <IndexIndicator />
      </GestureHandlerRootView>
    </Modal>
  )
}

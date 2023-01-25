import {
  ImageCarouselContext,
  ImageDescriptor,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { ImageCarouselVimeoVideo } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselVimeoVideo"
import { GlobalStore } from "app/store/GlobalStore"
import { useCallback, useContext, useEffect, useMemo } from "react"
import { FlatList, Modal, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { createZoomListComponent } from "react-native-reanimated-zoom"
import { useScreenDimensions } from "shared/hooks/useScreenDimensions"
import { ImageCarouselCloseButton } from "./ImageCarouselCloseButton"
import { ImageZoomViewAndroid } from "./ImageZoomViewAndroid"
import { IndexIndicator } from "./IndexIndicator"

const ZoomFlatList = createZoomListComponent(FlatList)

export const ImageCarouselFullScreenAndroid = () => {
  const screenDimensions = useScreenDimensions()
  const { media, dispatch, fullScreenState, imageIndex } = useContext(ImageCarouselContext)
  fullScreenState.useUpdates()
  const initialScrollIndex = useMemo(() => imageIndex.current, [])
  const { setIsDeepZoomModalVisible } = GlobalStore.actions.devicePrefs

  const onClose = useCallback(() => {
    if (fullScreenState.current === "entered") {
      dispatch({ type: "FULL_SCREEN_DISMISSED" })
      setIsDeepZoomModalVisible(false)
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
    ({ item, index }: { item: ImageDescriptor; index: number }) => {
      if ((item as any).__typename === "Video") {
        return (
          <ImageCarouselVimeoVideo
            width={screenDimensions.width}
            height={screenDimensions.height}
            vimeoUrl={item.url!}
          />
        )
      }

      return <ImageZoomViewAndroid image={item} index={index} />
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
          data={media}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={(item) => item.url!}
          renderItem={renderItem}
          key={screenDimensions.orientation}
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

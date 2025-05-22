import { useColor } from "@artsy/palette-mobile"
import {
  ImageCarouselContext,
  ImageCarouselMedia,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { ImageCarouselVimeoVideo } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselVimeoVideo"
import { GlobalStore } from "app/store/GlobalStore"
import { useScreenDimensions } from "app/utils/hooks/useScreenDimensions"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { FlatList, Modal, NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { createZoomListComponent } from "react-native-reanimated-zoom"
import { ImageCarouselCloseButton } from "./ImageCarouselCloseButton"
import { ImageZoomViewAndroid } from "./ImageZoomViewAndroid"
import { IndexIndicator } from "./IndexIndicator"

const ZoomFlatList = createZoomListComponent(FlatList)

export const ImageCarouselFullScreenAndroid = () => {
  const screenDimensions = useScreenDimensions()
  const color = useColor()
  const { media, dispatch, fullScreenState, imageIndex } = useContext(ImageCarouselContext)
  fullScreenState.useUpdates()
  const initialScrollIndex = useMemo(() => imageIndex.current, [])
  const { setIsDeepZoomModalVisible } = GlobalStore.actions.devicePrefs
  const [showBackButton, setShowBackButton] = useState(false)

  const onClose = useCallback(() => {
    dispatch({ type: "FULL_SCREEN_DISMISSED" })
    setIsDeepZoomModalVisible(false)
  }, [])

  useEffect(() => {
    if (fullScreenState.current === "exiting") {
      requestAnimationFrame(() => {
        dispatch({ type: "FULL_SCREEN_FINISHED_EXITING" })
      })
    }
  }, [fullScreenState.current])

  const renderItem = useCallback(
    ({ item, index }: { item: ImageCarouselMedia; index: number }) => {
      if (item.__typename === "Video") {
        return (
          <ImageCarouselVimeoVideo
            width={screenDimensions.width}
            height={screenDimensions.height}
            vimeoUrl={item.url}
          />
        )
      }

      return <ImageZoomViewAndroid image={item} index={index} />
    },
    [screenDimensions.orientation]
  )

  // Update the imageIndex on scroll
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
    // On mount we want the modal to be visible instantly and handle transitions elsewhere ourselves
    // on unmount we use it's built-in fade transition
    <Modal
      transparent
      animationType="fade"
      hardwareAccelerated
      supportedOrientations={["landscape", "portrait"]}
      statusBarTranslucent
      // 👇 responsible for closing the modal on android back button press
      onRequestClose={onClose}
      onShow={() => setShowBackButton(true)}
    >
      {!!showBackButton && <ImageCarouselCloseButton onClose={onClose} />}

      <GestureHandlerRootView style={{ flex: 1, backgroundColor: color("mono0") }}>
        <ZoomFlatList<ImageCarouselMedia>
          data={media}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={(item, index) => `${item.url}-${index}`}
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
        <IndexIndicator />
      </GestureHandlerRootView>
    </Modal>
  )
}

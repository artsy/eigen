# ImageCarousel

Hello! 👋

This document describes the architecture of the image carousel.

First there's the **embedded carousel** in `ImageCarouselEmbedded.tsx`.

This is the one that sits on the artwork page. It has pagination dots.
You can swipe left and right between images. Simple stuff. It uses a
horizontal FlatList under the hood. Easy.

Then there's the **full screen image carousel** in `FullScreen/ImageCarouselFullScreen.tsx`.

This is shown when you tap one of the images in the embedded carousel.

It's placed over everything else in the app using a React Native Modal component. As the name suggests, it occupies the whole screen.

These two components share context and state. These are managed in `ImageCarouselContext.tsx` and the two components are combined together and provided with context in `ImageCarousel.tsx`

Finally, there's the **deep zoom overlay** which is located in `FullScreen/DeepZoom/DeepZoomOverlay.tsx`. This allows the user to see high resolution versions of the image while they pan + zoom in the full screen mode.

## How the full screen mode transition works

When you tap to go fullscreen, this is what happens:

1. The full screen image carousel renders and mounts mounts but is completely transparent.
2. Once that happens we calculate a transform between where the full-screen image is and where the embedded image is. This positions the full-screen image directly over the embedded image.
3. We then animate the full-screen image returning to it's default place.
4. We then make the UI interactive, so users can swipe, zoom, etc.

## How the full screen view is structured

It's basically a set of nested scroll views in a modal. Something like this

    <Modal>
      <VerticalScrollViewForDismissingFullScreenMode>
        <HorizontalFlatListForSwipingBetweenImages>
          <ScrollViewForPinchToZoom>
            <Image />
          </ScrollViewForPinchToZoom>
          <DeepZoomOverlay />
        </HorizontalFlatListForSwipingBetweenImages>
      </VerticalScrollViewForDismissingFullScreenMode>
    </Modal>

- `Modal` is a regular React Native Modal element
- `VerticalScrollViewForDismissingFullScreenMode` provides the vertical-swipe-to-dismiss functionality, and is in `FullScreen/VerticalSwipeToDismiss.tsx`
- `HorizontalFlatListForSwipingBetweenImages` is given by `FullScreen/ImageCarouselFullScreen.tsx`
- `ScrollViewForPinchToZoom` is given by `FullScreen/ImageZoomView.tsx`
- `DeepZoomOverlay` is given by `FullScreen/DeepZoom/DeepZoomOverlay.tsx`

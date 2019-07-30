import { mount } from "enzyme"
import React from "react"
import { useTracking } from "react-tracking"
import { ImageCarouselContext, useNewImageCarouselContext } from "../ImageCarouselContext"

describe("image carousel context", () => {
  let context: ImageCarouselContext
  const trackEvent = jest.fn()
  function Mock() {
    const value = useNewImageCarouselContext({
      images: [{ height: 5, width: 5, url: "a" }, { height: 5, width: 5, url: "b" }],
    })
    return (
      <ImageCarouselContext.Provider value={value}>
        <ImageCarouselContext.Consumer>
          {ctx => {
            context = ctx
            return "hello world"
          }}
        </ImageCarouselContext.Consumer>
      </ImageCarouselContext.Provider>
    )
  }
  beforeEach(() => {
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  beforeEach(() => {
    mount(<Mock />)
  })
  afterEach(() => {
    context = null
  })
  it("sets up the context properly", () => {
    expect(context.dispatch).toBeInstanceOf(Function)
    expect(context.state.imageIndex).toBe(0)
    expect(context.state.isZoomedCompletelyOut).toBe(true)
    expect(context.state.fullScreenState).toBe("none")
    expect(context.embeddedFlatListRef.current).toBeFalsy()
    expect(context.embeddedImageRefs).toEqual([])
  })

  it("sets the isZoomedCompletelyOut properly correctly", () => {
    expect(context.state.isZoomedCompletelyOut).toBe(true)
    context.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 1 })
    expect(context.state.isZoomedCompletelyOut).toBe(true)
    context.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 1.2 })
    expect(context.state.isZoomedCompletelyOut).toBe(false)
    context.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 12 })
    expect(context.state.isZoomedCompletelyOut).toBe(false)
    context.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 0.12 })
    expect(context.state.isZoomedCompletelyOut).toBe(true)
    context.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 1 })
    expect(context.state.isZoomedCompletelyOut).toBe(true)
  })

  it("sets the imageIndex correctly", () => {
    expect(context.state.imageIndex).toBe(0)
    context.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 1 })
    expect(context.state.imageIndex).toBe(1)
    context.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 3 })
    expect(context.state.imageIndex).toBe(3)
    context.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 0 })
    expect(context.state.imageIndex).toBe(0)
  })

  it("sets the full screen mode correctly", () => {
    expect(context.state.fullScreenState).toBe("none")
    context.dispatch({ type: "TAPPED_TO_GO_FULL_SCREEN" })
    expect(context.state.fullScreenState).toBe("doing first render")
    context.dispatch({ type: "FULL_SCREEN_INITIAL_RENDER_COMPLETED" })
    expect(context.state.fullScreenState).toBe("animating entry transition")
    context.dispatch({ type: "FULL_SCREEN_FINISHED_ENTERING" })
    expect(context.state.fullScreenState).toBe("entered")
    context.dispatch({ type: "FULL_SCREEN_DISMISSED" })
    expect(context.state.fullScreenState).toBe("none")
  })

  it("scrolls the flatList when the image index changes", () => {
    // @ts-ignore
    context.embeddedFlatListRef.current = { scrollToIndex: jest.fn() }
    context.dispatch({ type: "TAPPED_TO_GO_FULL_SCREEN" })
    context.dispatch({ type: "FULL_SCREEN_INITIAL_RENDER_COMPLETED" })
    context.dispatch({ type: "FULL_SCREEN_FINISHED_ENTERING" })
    expect(context.state.fullScreenState).toBe("entered")

    context.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 1 })
    expect(context.embeddedFlatListRef.current.scrollToIndex).toHaveBeenCalledWith({ animated: false, index: 1 })

    context.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 0 })
    expect(context.embeddedFlatListRef.current.scrollToIndex).toHaveBeenCalledWith({ animated: false, index: 0 })
  })

  it("tracks the imageIndex changes", () => {
    context.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 1 })
    expect(trackEvent).toHaveBeenCalled()
    trackEvent.mockReset()
    context.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 3 })
    expect(trackEvent).toHaveBeenCalled()
    trackEvent.mockReset()
    context.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 3 })
    expect(trackEvent).not.toHaveBeenCalled()
    trackEvent.mockReset()
    context.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 2 })
    expect(trackEvent).toHaveBeenCalled()
  })
})

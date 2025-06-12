import { render } from "@testing-library/react-native"
import {
  ImageCarouselContext,
  useNewImageCarouselContext,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"

const contextMock: Parameters<typeof useNewImageCarouselContext>[0] = {
  images: [
    {
      internalID: "123",
      blurhash: "H4$#",
      height: 5,
      width: 5,
      url: "a",
      largeImageURL: "a",
      resized: {
        src: "a",
      },
      deepZoom: {
        image: { url: "", format: "", tileSize: 300, size: { width: 302, height: 302 } },
      },
    },
    {
      internalID: "1234",
      blurhash: "H4$#$",
      height: 5,
      width: 5,
      url: "b",
      largeImageURL: "a",
      resized: {
        src: "a",
      },
      deepZoom: {
        image: { url: "", format: "", tileSize: 300, size: { width: 302, height: 302 } },
      },
    },
  ],
}

describe("image carousel context", () => {
  let context: ImageCarouselContext | null = null

  const Mock = () => {
    const value = useNewImageCarouselContext(contextMock)

    return (
      <ImageCarouselContext.Provider value={value}>
        <ImageCarouselContext.Consumer>
          {(ctx) => {
            context = ctx
            return "hello world"
          }}
        </ImageCarouselContext.Consumer>
      </ImageCarouselContext.Provider>
    )
  }

  afterEach(() => {
    jest.clearAllMocks()

    context = null
  })

  it("sets up the context properly", () => {
    render(<Mock />)

    expect(context!.dispatch).toBeInstanceOf(Function)
    expect(context!.imageIndex.current).toBe(0)
    expect(context!.isZoomedCompletelyOut.current).toBe(true)
    expect(context!.fullScreenState.current).toBe("none")
    expect(context!.embeddedFlatListRef.current).toBeFalsy()
    expect(context!.embeddedImageRefs).toEqual([])
  })

  it("sets the isZoomedCompletelyOut properly correctly", () => {
    render(<Mock />)

    expect(context!.isZoomedCompletelyOut.current).toBe(true)

    context!.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 1 })
    expect(context!.isZoomedCompletelyOut.current).toBe(true)

    context!.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 1.2 })
    expect(context!.isZoomedCompletelyOut.current).toBe(false)

    context!.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 12 })
    expect(context!.isZoomedCompletelyOut.current).toBe(false)

    context!.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 0.12 })
    expect(context!.isZoomedCompletelyOut.current).toBe(true)

    context!.dispatch({ type: "ZOOM_SCALE_CHANGED", nextZoomScale: 1 })
    expect(context!.isZoomedCompletelyOut.current).toBe(true)
  })

  it("sets the imageIndex correctly", () => {
    render(<Mock />)

    expect(context!.imageIndex.current).toBe(0)

    context!.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 1 })
    expect(context!.imageIndex.current).toBe(1)

    context!.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 3 })
    expect(context!.imageIndex.current).toBe(3)

    context!.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 0 })
    expect(context!.imageIndex.current).toBe(0)
  })

  it("sets the full screen mode correctly", () => {
    render(<Mock />)

    expect(context!.fullScreenState.current).toBe("none")

    context!.dispatch({ type: "TAPPED_TO_GO_FULL_SCREEN" })
    expect(context!.fullScreenState.current).toBe("doing first render")

    context!.dispatch({ type: "FULL_SCREEN_INITIAL_RENDER_COMPLETED" })
    expect(context!.fullScreenState.current).toBe("animating entry transition")

    context!.dispatch({ type: "FULL_SCREEN_FINISHED_ENTERING" })
    expect(context!.fullScreenState.current).toBe("entered")

    context!.dispatch({ type: "FULL_SCREEN_DISMISSED" })
    expect(context!.fullScreenState.current).toBe("exiting")

    context!.dispatch({ type: "FULL_SCREEN_FINISHED_EXITING" })
    expect(context!.fullScreenState.current).toBe("none")
  })

  it("scrolls the flatList when the image index changes", () => {
    render(<Mock />)

    // @ts-ignore
    context!.embeddedFlatListRef.current = { scrollToIndex: jest.fn() }
    context!.dispatch({ type: "TAPPED_TO_GO_FULL_SCREEN" })
    context!.dispatch({ type: "FULL_SCREEN_INITIAL_RENDER_COMPLETED" })
    context!.dispatch({ type: "FULL_SCREEN_FINISHED_ENTERING" })
    expect(context!.fullScreenState.current).toBe("entered")

    context!.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 1 })
    expect(context!.embeddedFlatListRef!.current!.scrollToIndex).toHaveBeenCalledWith({
      animated: false,
      index: 1,
    })

    context!.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 0 })
    expect(context!.embeddedFlatListRef!.current!.scrollToIndex).toHaveBeenCalledWith({
      animated: false,
      index: 0,
    })
  })

  it("tracks the imageIndex changes", () => {
    render(<Mock />)

    context!.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 1 })
    context!.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 3 })
    context!.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 3 })
    context!.dispatch({ type: "IMAGE_INDEX_CHANGED", nextImageIndex: 2 })

    expect(mockTrackEvent.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "action_name": "artworkImageSwipe",
            "action_type": "swipe",
            "context_module": "ArtworkImage",
          },
        ],
        [
          {
            "action_name": "artworkImageSwipe",
            "action_type": "swipe",
            "context_module": "ArtworkImage",
          },
        ],
        [
          {
            "action_name": "artworkImageSwipe",
            "action_type": "swipe",
            "context_module": "ArtworkImage",
          },
        ],
      ]
    `)
  })
})

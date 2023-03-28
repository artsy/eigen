import {
  ImageCarouselContext,
  useNewImageCarouselContext,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ImageCarouselFullScreen } from "./ImageCarouselFullScreen"

describe("ImageCarouselFullScreen", () => {
  const Mock = () => {
    const value = useNewImageCarouselContext({
      images: [
        {
          internalID: "123",
          height: 5,
          width: 5,
          url: "a",
          largeImageURL: "a",
          resized: {
            src: "a",
          },
          deepZoom: { image: { size: { width: 5, height: 5 } } as any },
        },
        {
          internalID: "1234",
          height: 5,
          width: 5,
          url: "b",
          largeImageURL: "b",
          resized: {
            src: "b",
          },
          deepZoom: { image: { size: { width: 5, height: 5 } } as any },
        },
      ],
    })
    return (
      <ImageCarouselContext.Provider value={value}>
        <ImageCarouselFullScreen />
      </ImageCarouselContext.Provider>
    )
  }

  it("render only the current zoomable image as a perf optimisation", () => {
    const { getAllByLabelText } = renderWithWrappers(<Mock />)

    expect(getAllByLabelText("Full Screen Image")).toHaveLength(1)
    expect(getAllByLabelText("Full Screen Image Blank Box")).toHaveLength(1)
  })
})

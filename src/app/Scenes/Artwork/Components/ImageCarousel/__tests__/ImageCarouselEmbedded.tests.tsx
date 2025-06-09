import { fireEvent, screen } from "@testing-library/react-native"
import {
  ImageCarouselContext,
  useNewImageCarouselContext,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselContext"
import { ImageCarouselEmbedded } from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarouselEmbedded"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

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
      largeImageURL: "b",
      resized: {
        src: "b",
      },
      deepZoom: {
        image: { url: "", format: "", tileSize: 300, size: { width: 302, height: 302 } },
      },
    },
  ],
}

type ContextInit = typeof contextMock

interface WrapperProps {
  contextInit?: ContextInit
}

describe("ImageCarouselEmbedded", () => {
  let context: ImageCarouselContext
  const onImagePressedMock = jest.fn()

  const TestWrapper = ({ contextInit = contextMock }: WrapperProps) => {
    const value = useNewImageCarouselContext(contextInit)
    context = value

    return (
      <ImageCarouselContext.Provider value={value}>
        <ImageCarouselEmbedded cardHeight={275} onImagePressed={onImagePressedMock} />
      </ImageCarouselContext.Provider>
    )
  }

  it("should render all passed images", () => {
    renderWithWrappers(<TestWrapper />)

    expect(screen.getAllByLabelText("Image with Loading State")).toHaveLength(2)
  })

  it("responds to onImagePressed prop", () => {
    renderWithWrappers(<TestWrapper />)

    fireEvent.press(screen.getAllByLabelText("Image with Loading State")[0])
    expect(onImagePressedMock).toHaveBeenCalled()
  })

  it("does something when you tap an image with deepZoom", () => {
    renderWithWrappers(<TestWrapper />)

    expect(context.fullScreenState.current).toBe("none")

    fireEvent.press(screen.getAllByLabelText("Image with Loading State")[0])
    expect(context.fullScreenState.current).not.toBe("none")
  })

  it("does nothing when you tap an image without deepZoom", () => {
    const contextInit: ContextInit = {
      images: [
        {
          internalID: "123",
          blurhash: "H4$#",
          deepZoom: null,
          height: 302,
          url: "https://example.com/image.jpg",
          largeImageURL: "https://example.com/image.jpg",
          resized: {
            src: "https://example.com/image.jpg",
          },
          width: 40,
        },
      ],
    }

    renderWithWrappers(<TestWrapper contextInit={contextInit} />)

    expect(context.fullScreenState.current).toBe("none")

    fireEvent.press(screen.getAllByLabelText("Image with Loading State")[0])
    expect(context.fullScreenState.current).toBe("none")
  })
})

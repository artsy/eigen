import { fireEvent } from "@testing-library/react-native"
import { ImageCarouselTestsQuery } from "__generated__/ImageCarouselTestsQuery.graphql"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { guardFactory } from "app/utils/types/guardFactory"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import {
  CarouselImageDescriptor,
  ImageCarousel,
  ImageCarouselFragmentContainer,
  ImageCarouselProps,
} from "./ImageCarousel"
import { getMeasurements } from "./geometry"

const deepZoomFixture: NonNullable<
  NonNullable<
    NonNullable<NonNullable<ImageCarouselTestsQuery["rawResponse"]["artwork"]>["images"]>[0]
  >["deepZoom"]
> = {
  image: {
    format: "jpg",
    size: {
      height: 3000,
      width: 3000,
    },
    tileSize: 400,
    url: "https://example.com/image.jpg",
  },
}

const artworkFixture: ImageCarouselTestsQuery["rawResponse"]["artwork"] = {
  id: "artwork-id",
  images: [
    {
      __typename: "Image",
      url: "https://d32dm0rphc51dk.cloudfront.net/hA1DxfZHgx23SzeK0yv8Qw/medium.jpg",
      largeImageURL: "https://d32dm0rphc51dk.cloudfront.net/hA1DxfZHgx23SzeK0yv8Qw/medium.jpg",
      width: 1024,
      height: 822,
      deepZoom: deepZoomFixture,
      imageVersions: ["normalized"],
    },
    {
      __typename: "Image",
      url: "https://d32dm0rphc51dk.cloudfront.net/6rLY-WTbFTF1UwpqFnq3AA/medium.jpg",
      largeImageURL: "https://d32dm0rphc51dk.cloudfront.net/6rLY-WTbFTF1UwpqFnq3AA/medium.jpg",
      width: 1024,
      height: 919,
      deepZoom: deepZoomFixture,
      imageVersions: ["normalized"],
    },
    {
      __typename: "Image",
      url: "https://d32dm0rphc51dk.cloudfront.net/1FIiskS9THHPAkqYzmiH9Q/larger.jpg",
      largeImageURL: "https://d32dm0rphc51dk.cloudfront.net/1FIiskS9THHPAkqYzmiH9Q/larger.jpg",
      width: 1024,
      height: 497,
      deepZoom: deepZoomFixture,
      imageVersions: ["normalized"],
    },
    {
      __typename: "Image",
      url: "https://d32dm0rphc51dk.cloudfront.net/yjHx8ZW_wy5qybMiVtanmw/medium.jpg",
      largeImageURL: "https://d32dm0rphc51dk.cloudfront.net/yjHx8ZW_wy5qybMiVtanmw/medium.jpg",
      width: 1024,
      height: 907,
      deepZoom: deepZoomFixture,
      imageVersions: ["normalized"],
    },
    {
      __typename: "Image",
      url: "https://d32dm0rphc51dk.cloudfront.net/qPiYUxD-v8b5QnDaYS8OlQ/larger.jpg",
      largeImageURL: "https://d32dm0rphc51dk.cloudfront.net/qPiYUxD-v8b5QnDaYS8OlQ/larger.jpg",
      width: 2800,
      height: 2100,
      deepZoom: deepZoomFixture,
      imageVersions: ["normalized"],
    },
  ],
}

const localImages: CarouselImageDescriptor[] = [
  {
    url: "file:///this/is/not/a/real/image.jpg",
    largeImageURL: "file:///this/is/not/a/real/image.jpg",
    width: 2800,
    height: 2100,
    deepZoom: null,
  },
  {
    url: "file:///this/is/not/a/real/image.jpg",
    largeImageURL: "file:///this/is/not/a/real/image.jpg",
    width: 2800,
    height: 2100,
    deepZoom: null,
  },
  {
    url: "file:///this/is/not/a/real/image.jpg",
    largeImageURL: "file:///this/is/not/a/real/image.jpg",
    width: 2800,
    height: 2100,
    deepZoom: null,
  },
]

describe("ImageCarouselFragmentContainer", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestWrapper = () => {
    return null
    // return (
    //   <QueryRenderer<ImageCarouselTestsQuery>
    //     environment={mockEnvironment}
    //     query={graphql`
    //       query ImageCarouselTestsQuery @raw_response_type {
    //         artwork(id: "unused") {
    //           images {
    //             ...ImageCarousel_images
    //           }
    //         }
    //       }
    //     `}
    //     variables={{}}
    //     render={({ props }) => {
    //       if (props?.artwork) {
    //         return (
    //           <ImageCarouselFragmentContainer
    //             images={props.artwork.images as any}
    //             cardHeight={275}
    //           />
    //         )
    //       }
    //     }}
    //   />
    // )
  }

  const { renderWithRelay } = setupTestWrapper<ImageCarouselTestsQuery>({
    Component: (props) => {
      const imageFigures = props.artwork?.figures.filter(guardFactory("__typename", "Image"))
      const videoFigures = props.artwork?.figures.filter(guardFactory("__typename", "Video"))

      return (
        <ImageCarouselFragmentContainer
          images={imageFigures!}
          videos={videoFigures!}
          cardHeight={275}
        />
      )
    },
    query: graphql`
      query ImageCarouselTestsQuery @raw_response_type @relay_test_operation {
        artwork(id: "unused") {
          figures {
            __typename
            # ... on Image {
            #   ...ImageCarousel_images
            # }
            # ... on Video {
            #   ...ImageCarousel_videos
            # }
          }
        }
      }
    `,
  })

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  describe("with five images", () => {
    afterEach(() => {
      jest.clearAllMocks()
      jest.useRealTimers()
    })

    it.only("renders a flat list with five entries", () => {
      const { getByLabelText, getAllByLabelText } = renderWithRelay({
        Artwork: () => artworkFixture,
      })

      expect(getByLabelText("Image Carousel")).toBeTruthy()
      expect(getAllByLabelText("Image with Loading State")).toHaveLength(5)
    })

    it("shows five pagination dots", () => {
      const { getAllByLabelText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artworkFixture,
      })

      expect(getAllByLabelText("Image Pagination Indicator")).toHaveLength(5)
    })

    it("shows the first pagination dot as being selected and the rest as not selected", () => {
      const { getAllByLabelText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artworkFixture,
      })

      const indicators = getAllByLabelText("Image Pagination Indicator")

      expect(indicators[0]).toHaveStyle({ opacity: 1 })
      expect(indicators[1]).toHaveStyle({ opacity: 0.1 })
      expect(indicators[2]).toHaveStyle({ opacity: 0.1 })
      expect(indicators[3]).toHaveStyle({ opacity: 0.1 })
      expect(indicators[4]).toHaveStyle({ opacity: 0.1 })
    })

    it("'selects' subsequent pagination dots as a result of scrolling", async () => {
      jest.useFakeTimers({
        legacyFakeTimers: true,
      })

      const { getByLabelText, getAllByLabelText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artworkFixture,
      })

      const container = getByLabelText("Image Carousel")
      const measurements = getMeasurements({
        media: artworkFixture?.images as any,
        boundingBox: {
          width: 375,
          height: 275,
        },
      })

      // Dimensions of the scrollable content
      const contentSize = {
        height: 275,
        width: measurements[measurements.length - 1].cumulativeScrollOffset,
      }

      // Dimensions of the device
      const layoutMeasurement = {
        height: 550,
        width: 380,
      }

      fireEvent.scroll(container, {
        nativeEvent: {
          contentSize,
          layoutMeasurement,
          contentOffset: {
            x: 0,
          },
        },
      })
      jest.advanceTimersByTime(5000)

      const indicators = getAllByLabelText("Image Pagination Indicator")

      expect(indicators[0]).toHaveStyle({ opacity: 1 })
      expect(indicators[1]).toHaveStyle({ opacity: 0.1 })
      expect(indicators[2]).toHaveStyle({ opacity: 0.1 })
      expect(indicators[3]).toHaveStyle({ opacity: 0.1 })
      expect(indicators[4]).toHaveStyle({ opacity: 0.1 })

      // Scroll to the second image
      fireEvent.scroll(container, {
        nativeEvent: {
          contentSize,
          layoutMeasurement,
          contentOffset: {
            x: measurements[1].cumulativeScrollOffset,
          },
        },
      })
      jest.advanceTimersByTime(5000)

      // FIXME: JEST_29_UPGRADE - replace this with a proper state check?
      // expect(indicators[0]).toHaveStyle({ opacity: 0.1 })
      // expect(indicators[1]).toHaveStyle({ opacity: 1 })
      // expect(indicators[2]).toHaveStyle({ opacity: 0.1 })
      // expect(indicators[3]).toHaveStyle({ opacity: 0.1 })
      // expect(indicators[4]).toHaveStyle({ opacity: 0.1 })

      // Scroll to the last image
      fireEvent.scroll(container, {
        nativeEvent: {
          contentSize,
          layoutMeasurement,
          contentOffset: {
            x: measurements[4].cumulativeScrollOffset,
          },
        },
      })
      jest.advanceTimersByTime(500)

      // FIXME: JEST_29_UPGRADE - replace this with a proper state check?
      // expect(indicators[0]).toHaveStyle({ opacity: 0.1 })
      // expect(indicators[1]).toHaveStyle({ opacity: 0.1 })
      // expect(indicators[2]).toHaveStyle({ opacity: 0.1 })
      // expect(indicators[3]).toHaveStyle({ opacity: 0.1 })
      // expect(indicators[4]).toHaveStyle({ opacity: 1 })
    })

    it(`does not show images that have no deep zoom`, () => {
      const { getAllByLabelText } = renderWithWrappers(<TestWrapper />)
      const images = artworkFixture.images!.map((image, index) => {
        // delete two of the images' deepZoom
        if (index < 2) {
          return {
            ...image,
            deepZoom: null,
          }
        }

        return image
      })

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artworkFixture,
          images,
        }),
      })

      expect(getAllByLabelText("Image Pagination Indicator")).toHaveLength(3)
    })

    it("only shows one image when none of the images have deep zoom", () => {
      const { getByLabelText, queryAllByLabelText } = renderWithWrappers(<TestWrapper />)
      const images = artworkFixture.images!.map((image) => ({
        ...image,
        deepZoom: null,
      }))

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => ({
          ...artworkFixture,
          images,
        }),
      })

      expect(queryAllByLabelText("Image Pagination Indicator")).toHaveLength(0)
      expect(getByLabelText("Image Carousel")).toHaveProp("scrollEnabled", false)
    })
  })

  describe("with one image", () => {
    const artwork = {
      ...artworkFixture,
      images: [artworkFixture.images![0]],
    }

    it("shows no pagination dots", async () => {
      const { queryAllByLabelText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      expect(queryAllByLabelText("Image Pagination Indicator")).toHaveLength(0)
    })

    it("disables scrolling", async () => {
      const { getByLabelText } = renderWithWrappers(<TestWrapper />)

      resolveMostRecentRelayOperation(mockEnvironment, {
        Artwork: () => artwork,
      })

      expect(getByLabelText("Image Carousel")).toHaveProp("scrollEnabled", false)
    })
  })
})

describe("Local Images and PaginationIndicator", () => {
  const TestWrapper = (props: ImageCarouselProps) => {
    return <ImageCarousel {...props} />
  }

  it("can display local images", () => {
    const { getAllByLabelText } = renderWithWrappers(
      <TestWrapper images={localImages} cardHeight={275} />
    )

    expect(getAllByLabelText("Image with Loading State")).toHaveLength(localImages.length)
  })

  it("defaults to paginationDots", () => {
    const { getAllByLabelText, queryByLabelText } = renderWithWrappers(
      <TestWrapper images={localImages} cardHeight={275} />
    )

    expect(getAllByLabelText("Image with Loading State")).toHaveLength(localImages.length)
    expect(getAllByLabelText("Image Pagination Indicator")).toHaveLength(localImages.length)
    expect(queryByLabelText("Image Pagination Scroll Bar")).toBeFalsy()
  })

  it("Indicator can be a scrollbar", () => {
    const { queryAllByLabelText, queryByLabelText } = renderWithWrappers(
      <TestWrapper images={localImages} cardHeight={275} paginationIndicatorType="scrollBar" />
    )

    expect(queryByLabelText("Image Pagination Scroll Bar")).toBeTruthy()
    expect(queryAllByLabelText("Image Pagination Indicator")).toHaveLength(0)
  })
})

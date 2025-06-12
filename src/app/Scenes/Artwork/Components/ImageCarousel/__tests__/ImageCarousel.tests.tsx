import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ImageCarouselTestsQuery } from "__generated__/ImageCarouselTestsQuery.graphql"
import {
  CarouselImageDescriptor,
  ImageCarousel,
  ImageCarouselFragmentContainer,
  ImageCarouselProps,
} from "app/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { getMeasurements } from "app/Scenes/Artwork/Components/ImageCarousel/geometry"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("react-native-vimeo-iframe", () => ({
  Vimeo: () => <></>,
}))

describe("ImageCarouselFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper<ImageCarouselTestsQuery>({
    Component: (props) => (
      <ImageCarouselFragmentContainer figures={props.artwork?.figures} cardHeight={275} />
    ),
    query: graphql`
      query ImageCarouselTestsQuery @raw_response_type @relay_test_operation {
        artwork(id: "unused") {
          figures {
            ...ImageCarousel_figures
          }
        }
      }
    `,
  })

  describe("with five images", () => {
    afterEach(() => {
      jest.clearAllMocks()
      jest.useRealTimers()
    })

    it("renders a flat list with five entries", () => {
      renderWithRelay({ Artwork: () => artworkFixture })

      expect(screen.getByLabelText("Image Carousel")).toBeTruthy()
      expect(screen.getAllByLabelText("Image with Loading State")).toHaveLength(5)
    })

    it("shows five pagination dots", () => {
      renderWithRelay({ Artwork: () => artworkFixture })

      expect(screen.getAllByLabelText("Image Pagination Indicator")).toHaveLength(5)
    })

    it("shows the first pagination dot as being selected and the rest as not selected", () => {
      renderWithRelay({ Artwork: () => artworkFixture })

      const indicators = screen.getAllByLabelText("Image Pagination Indicator")

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

      renderWithRelay({ Artwork: () => artworkFixture })

      const container = screen.getByLabelText("Image Carousel")
      const measurements = getMeasurements({
        media: artworkFixture?.figures as any,
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

      const indicators = screen.getAllByLabelText("Image Pagination Indicator")

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
      const fixtureWithoutZoom = artworkFixture?.figures!.map((image, index) => {
        // delete two of the images' deepZoom
        if (index < 2) {
          return {
            ...image,
            deepZoom: null,
          }
        }

        return image
      })

      renderWithRelay({ Artwork: () => ({ ...artworkFixture, figures: fixtureWithoutZoom }) })

      expect(screen.getAllByLabelText("Image Pagination Indicator")).toHaveLength(3)
    })

    it("only shows one image when none of the images have deep zoom", () => {
      const noDeepZoomFixture = artworkFixture?.figures!.map((image) => ({
        ...image,
        deepZoom: null,
      }))

      renderWithRelay({ Artwork: () => ({ ...artworkFixture, figures: noDeepZoomFixture }) })

      expect(screen.queryAllByLabelText("Image Pagination Indicator")).toHaveLength(0)
      expect(screen.getByLabelText("Image Carousel")).toHaveProp("scrollEnabled", false)
    })
  })

  describe("with one image", () => {
    const artwork = {
      ...artworkFixture,
      figures: [artworkFixture?.figures![0]],
    }

    it("shows no pagination dots", async () => {
      renderWithRelay({ Artwork: () => artwork })

      expect(screen.queryAllByLabelText("Image Pagination Indicator")).toHaveLength(0)
    })

    it("disables scrolling", async () => {
      renderWithRelay({ Artwork: () => artwork })

      expect(screen.getByLabelText("Image Carousel")).toHaveProp("scrollEnabled", false)
    })
  })

  describe("with video artworks", () => {
    beforeEach(() => {
      global.setImmediate = jest.fn() as any
      global.fetch = jest.fn().mockResolvedValue({ json: jest.fn() }) as any
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    const artwork = {
      figures: [
        {
          __typename: "Image",
        },
        {
          __typename: "Video",
        },
      ],
    }

    it("renders a flat list with two entries", () => {
      renderWithRelay({ Artwork: () => artwork })

      expect(screen.getByLabelText("Image Carousel")).toBeTruthy()
      expect(screen.getAllByLabelText("Image with Loading State")).toHaveLength(1)
      expect(screen.getAllByLabelText("Vimeo Video Player")).toHaveLength(1)
    })

    it("shows pagination dots", async () => {
      renderWithRelay({ Artwork: () => artwork })

      expect(screen.queryAllByLabelText("Image Pagination Indicator")).toHaveLength(2)
    })

    it("makes a request out to fetch video cover data", async () => {
      const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          pictures: { sizes: [{ link_with_play_button: "https://vimeo.com/123" }] },
        }),
      } as any)

      renderWithRelay({ Artwork: () => artwork })

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          'https://api.vimeo.com/videos/<mock-value-for-field-"playerUrl">',
          {
            headers: {
              Accept: "application/vnd.vimeo.*+json;version=3.4",
              Authorization: "Bearer undefined",
            },
          }
        )
      })
    })

    it("fetches a video thumbnail placeholder with video button", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          pictures: {
            sizes: [
              { link_with_play_button: "https://vimeo.com/123" },
              { link_with_play_button: "https://vimeo.com/123" },
              { link_with_play_button: "https://vimeo.com/123" },
              { link_with_play_button: "https://vimeo.com/123" },
              { link_with_play_button: "https://vimeo.com/123" }, // we use the 5th size from vimeo
            ],
          },
        }),
      } as any)

      renderWithRelay({
        Artwork: () => artwork,
      })

      await flushPromiseQueue()
      const button = screen.getAllByLabelText("Vimeo Play Button")
      expect(button).toHaveLength(1)

      fireEvent.press(button[0])
      await flushPromiseQueue()
      expect(screen.getAllByLabelText("Vimeo Video Player Controls")).toHaveLength(1)
    })
  })

  describe("Local Images and PaginationIndicator", () => {
    const TestWrapper = (props: ImageCarouselProps) => {
      return <ImageCarousel {...props} />
    }

    it("can display local images", () => {
      renderWithWrappers(<TestWrapper staticImages={localImages} cardHeight={275} />)

      expect(screen.getAllByLabelText("Image with Loading State")).toHaveLength(localImages.length)
    })

    it("defaults to paginationDots", () => {
      renderWithWrappers(<TestWrapper staticImages={localImages} cardHeight={275} />)

      expect(screen.getAllByLabelText("Image with Loading State")).toHaveLength(localImages.length)
      expect(screen.getAllByLabelText("Image Pagination Indicator")).toHaveLength(
        localImages.length
      )
      expect(screen.queryByLabelText("Image Pagination Scroll Bar")).toBeFalsy()
    })

    it("Indicator can be a scrollbar", () => {
      renderWithWrappers(
        <TestWrapper
          staticImages={localImages}
          cardHeight={275}
          paginationIndicatorType="scrollBar"
        />
      )

      expect(screen.getByLabelText("Image Pagination Scroll Bar")).toBeTruthy()
      expect(screen.queryAllByLabelText("Image Pagination Indicator")).toHaveLength(0)
    })
  })
})

const deepZoomFixture: CarouselImageDescriptor["deepZoom"] = {
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
  figures: [
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
  ] as any,
}

const localImages: CarouselImageDescriptor[] = [
  {
    internalID: "1",
    blurhash: "H4$#",
    url: "file:///this/is/not/a/real/image.jpg",
    largeImageURL: "file:///this/is/not/a/real/image.jpg",
    resized: {
      src: "file:///this/is/not/a/real/image.jpg",
    },
    width: 2800,
    height: 2100,
    deepZoom: null,
  },
  {
    internalID: "2",
    blurhash: "H4$#2",
    url: "file:///this/is/not/a/real/image.jpg",
    largeImageURL: "file:///this/is/not/a/real/image.jpg",
    resized: {
      src: "file:///this/is/not/a/real/image.jpg",
    },
    width: 2800,
    height: 2100,
    deepZoom: null,
  },
  {
    internalID: "3",
    blurhash: "H4$#3",
    url: "file:///this/is/not/a/real/image.jpg",
    largeImageURL: "file:///this/is/not/a/real/image.jpg",
    resized: {
      src: "file:///this/is/not/a/real/image.jpg",
    },
    width: 2800,
    height: 2100,
    deepZoom: null,
  },
]

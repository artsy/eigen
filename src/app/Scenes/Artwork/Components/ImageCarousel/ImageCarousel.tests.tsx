import { ImageCarouselTestsQuery } from "__generated__/ImageCarouselTestsQuery.graphql"
import { renderRelayTree } from "app/tests/renderRelayTree"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { Animated, FlatList } from "react-native"
import { graphql } from "react-relay"
import { getMeasurements } from "./geometry"
import {
  CarouselImageDescriptor,
  ImageCarousel,
  ImageCarouselFragmentContainer,
  ImageCarouselProps,
} from "./ImageCarousel"
import { PaginationDot, ScrollBar } from "./ImageCarouselPaginationIndicator"
import { ImageWithLoadingState } from "./ImageWithLoadingState"

jest.unmock("react-relay")

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
      url: "https://d32dm0rphc51dk.cloudfront.net/hA1DxfZHgx23SzeK0yv8Qw/medium.jpg",
      width: 1024,
      height: 822,
      deepZoom: deepZoomFixture,
      imageVersions: ["normalized"],
    },
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/6rLY-WTbFTF1UwpqFnq3AA/medium.jpg",
      width: 1024,
      height: 919,
      deepZoom: deepZoomFixture,
      imageVersions: ["normalized"],
    },
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/1FIiskS9THHPAkqYzmiH9Q/larger.jpg",
      width: 1024,
      height: 497,
      deepZoom: deepZoomFixture,
      imageVersions: ["normalized"],
    },
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/yjHx8ZW_wy5qybMiVtanmw/medium.jpg",
      width: 1024,
      height: 907,
      deepZoom: deepZoomFixture,
      imageVersions: ["normalized"],
    },
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/qPiYUxD-v8b5QnDaYS8OlQ/larger.jpg",
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
    width: 2800,
    height: 2100,
    deepZoom: null,
  },
  {
    url: "file:///this/is/not/a/real/image.jpg",
    width: 2800,
    height: 2100,
    deepZoom: null,
  },
  {
    url: "file:///this/is/not/a/real/image.jpg",
    width: 2800,
    height: 2100,
    deepZoom: null,
  },
]

describe("ImageCarouselFragmentContainer", () => {
  const getWrapper = async (artwork = artworkFixture) => {
    return await renderRelayTree({
      Component: ({ artwork: { images } }) => (
        <ImageCarouselFragmentContainer images={images} cardHeight={275} />
      ),
      query: graphql`
        query ImageCarouselTestsQuery @raw_response_type {
          artwork(id: "unused") {
            images {
              ...ImageCarousel_images
            }
          }
        }
      `,
      mockData: {
        artwork,
      }, // Enable/fix this when making large change to these components/fixtures: as ImageCarouselTestsQuery,
    })
  }
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const getDotOpacity = (dot) => dot.find(Animated.View).props().style.opacity._value
  describe("with five images", () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })
    afterEach(() => {
      jest.clearAllMocks()
      jest.useRealTimers()
    })
    it("renders a flat list with five entries", async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find(FlatList)).toHaveLength(1)
      expect(wrapper.find(FlatList).props().data).toHaveLength(5)
    })

    it("shows five pagination dots", async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find(PaginationDot)).toHaveLength(5)
    })

    it("shows the first pagination dot as being selected and the rest as not selected", async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find(PaginationDot).map(getDotOpacity)).toMatchObject([1, 0.1, 0.1, 0.1, 0.1])
    })

    it("'selects' subsequent pagination dots as a result of scrolling", async () => {
      const wrapper = await getWrapper()

      const measurements = getMeasurements({
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        images: artworkFixture.images,
        boundingBox: { width: 375, height: 275 },
      })

      wrapper
        .find(FlatList)
        .props()
        .onScroll({ nativeEvent: { contentOffset: { x: 0 } } })
      jest.advanceTimersByTime(5000)
      wrapper.update()

      expect(wrapper.find(PaginationDot).map(getDotOpacity)).toMatchObject([1, 0.1, 0.1, 0.1, 0.1])

      wrapper
        .find(FlatList)
        .props()
        .onScroll({ nativeEvent: { contentOffset: { x: measurements[1].cumulativeScrollOffset } } })

      jest.advanceTimersByTime(500)
      wrapper.update()

      expect(wrapper.find(PaginationDot).map(getDotOpacity)).toMatchObject([0.1, 1, 0.1, 0.1, 0.1])

      wrapper
        .find(FlatList)
        .props()
        .onScroll({ nativeEvent: { contentOffset: { x: measurements[4].cumulativeScrollOffset } } })

      jest.advanceTimersByTime(500)
      wrapper.update()

      expect(wrapper.find(PaginationDot).map(getDotOpacity)).toMatchObject([0.1, 0.1, 0.1, 0.1, 1])
    })

    it(`does not show images that have no deep zoom`, async () => {
      const wrapper = await getWrapper({
        ...artworkFixture,
        // delete two of the images' deepZoom
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        images: [
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          ...artworkFixture.images.slice(0, 2).map((image) => ({ ...image, deepZoom: null })),
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          ...artworkFixture.images.slice(2),
        ],
      })

      expect(wrapper.find(PaginationDot)).toHaveLength(3)
    })

    it(`only shows one image when none of the images have deep zoom`, async () => {
      const wrapper = await getWrapper({
        ...artworkFixture,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        images: artworkFixture.images.map((image) => ({ ...image, deepZoom: null })),
      })

      expect(wrapper.find(PaginationDot)).toHaveLength(0)
      expect(wrapper.find(FlatList).props().scrollEnabled).toBe(false)
    })
  })

  describe("with one image", () => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const artwork = { ...artworkFixture, images: [artworkFixture.images[0]] }
    it("shows no pagination dots", async () => {
      const wrapper = await getWrapper(artwork)
      expect(wrapper.find(PaginationDot)).toHaveLength(0)
    })

    it("disables scrolling", async () => {
      const wrapper = await getWrapper(artwork)
      expect(wrapper.find(FlatList).props().scrollEnabled).toBe(false)
    })
  })
})

describe("Local Images and PaginationIndicator", () => {
  const getWrapper = (props: ImageCarouselProps) => renderWithWrappers(<ImageCarousel {...props} />)

  it("can display local images", () => {
    const wrapper = getWrapper({ images: localImages, cardHeight: 275 })
    expect(wrapper.root.findAllByType(ImageWithLoadingState).length).toEqual(localImages.length)
  })

  it("defaults to paginationDots", () => {
    const wrapper = getWrapper({ images: localImages, cardHeight: 275 })
    expect(wrapper.root.findAllByType(PaginationDot).length).toEqual(localImages.length)
    expect(wrapper.root.findAllByType(ScrollBar).length).toBe(0)
  })
  it("Indicator can be a scrollbar", () => {
    const wrapper = getWrapper({
      paginationIndicatorType: "scrollBar",
      images: localImages,
      cardHeight: 275,
    })
    expect(wrapper.root.findAllByType(PaginationDot).length).toBe(0)
    expect(wrapper.root.findByType(ScrollBar)).toBeDefined()
  })
})

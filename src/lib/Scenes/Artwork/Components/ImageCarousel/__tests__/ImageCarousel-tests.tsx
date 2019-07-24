import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { Animated, FlatList } from "react-native"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { getMeasurements } from "../geometry"
import { ImageCarouselFragmentContainer, PaginationDot } from "../ImageCarousel"
import { embeddedCardBoundingBox } from "../ImageCarouselEmbedded"

jest.unmock("react-relay")
const trackEvent = jest.fn()

const artworkFixture = {
  images: [
    {
      image_url: "https://d32dm0rphc51dk.cloudfront.net/hA1DxfZHgx23SzeK0yv8Qw/medium.jpg",
      width: 1024,
      height: 822,
    },
    {
      image_url: "https://d32dm0rphc51dk.cloudfront.net/6rLY-WTbFTF1UwpqFnq3AA/medium.jpg",
      width: 1024,
      height: 919,
    },
    {
      image_url: "https://d32dm0rphc51dk.cloudfront.net/1FIiskS9THHPAkqYzmiH9Q/larger.jpg",
      width: 1024,
      height: 497,
    },
    {
      image_url: "https://d32dm0rphc51dk.cloudfront.net/yjHx8ZW_wy5qybMiVtanmw/medium.jpg",
      width: 1024,
      height: 907,
    },
    {
      image_url: "https://d32dm0rphc51dk.cloudfront.net/qPiYUxD-v8b5QnDaYS8OlQ/larger.jpg",
      width: 2800,
      height: 2100,
    },
  ],
}

describe("ImageCarouselFragmentContainer", () => {
  const getWrapper = async (artwork = artworkFixture) => {
    return await renderRelayTree({
      Component: ({ artwork: { images } }) => <ImageCarouselFragmentContainer images={images} />,
      query: graphql`
        query ImageCarouselTestsQuery {
          artwork(id: "unused") {
            images {
              ...ImageCarousel_images
            }
          }
        }
      `,
      mockData: {
        artwork,
      },
    })
  }
  const getDotOpacity = dot => dot.find(Animated.View).props().style.opacity._value
  describe("with five images", () => {
    beforeEach(() => {
      jest.useFakeTimers()
      ;(useTracking as jest.Mock).mockImplementation(() => {
        return {
          trackEvent,
        }
      })
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
      expect(wrapper.find(PaginationDot).map(getDotOpacity)).toMatchObject([1, 0.1, 0.1, 0.1, 0.1])

      const measurements = getMeasurements({ images: artworkFixture.images, boundingBox: embeddedCardBoundingBox })

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
  })

  describe("with one image", () => {
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

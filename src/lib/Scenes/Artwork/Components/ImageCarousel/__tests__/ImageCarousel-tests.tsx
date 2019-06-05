import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { FlatList } from "react-native"
import { graphql } from "react-relay"
import { getMeasurements } from "../geometry"
import { cardBoundingBox, ImageCarouselFragmentContainer } from "../ImageCarousel"

jest.unmock("react-relay")

const artworkFixture = {
  images: [
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/hA1DxfZHgx23SzeK0yv8Qw/medium.jpg",
      width: 1024,
      height: 822,
      thumbnail: {
        width: 320,
        height: 256,
        url:
          "https://d7hftxdivxxvm.cloudfront.net?resize_to=fit&width=320&height=256&qua…3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FhA1DxfZHgx23SzeK0yv8Qw%2Flarge.jpg",
      },
    },
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/6rLY-WTbFTF1UwpqFnq3AA/medium.jpg",
      width: 1024,
      height: 919,
      thumbnail: {
        width: 320,
        height: 287,
        url:
          "https://d7hftxdivxxvm.cloudfront.net?resize_to=fit&width=320&height=287&qua…3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F6rLY-WTbFTF1UwpqFnq3AA%2Flarge.jpg",
      },
    },
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/1FIiskS9THHPAkqYzmiH9Q/larger.jpg",
      width: 1024,
      height: 497,
      thumbnail: {
        width: 320,
        height: 155,
        url:
          "https://d7hftxdivxxvm.cloudfront.net?resize_to=fit&width=320&height=155&qua…3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F1FIiskS9THHPAkqYzmiH9Q%2Flarge.jpg",
      },
    },
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/yjHx8ZW_wy5qybMiVtanmw/medium.jpg",
      width: 1024,
      height: 907,
      thumbnail: {
        width: 320,
        height: 283,
        url:
          "https://d7hftxdivxxvm.cloudfront.net?resize_to=fit&width=320&height=283&qua…3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FyjHx8ZW_wy5qybMiVtanmw%2Flarge.jpg",
      },
    },
    {
      url: "https://d32dm0rphc51dk.cloudfront.net/qPiYUxD-v8b5QnDaYS8OlQ/larger.jpg",
      width: 2800,
      height: 2100,
      thumbnail: {
        width: 320,
        height: 240,
        url:
          "https://d7hftxdivxxvm.cloudfront.net?resize_to=fit&width=320&height=240&qua…3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FqPiYUxD-v8b5QnDaYS8OlQ%2Flarge.jpg",
      },
    },
  ],
}

describe("ImageCarouselFragmentContainer", () => {
  const getWrapper = async (artwork = artworkFixture) => {
    return await renderRelayTree({
      Component: ({ artwork: { images } }) => <ImageCarouselFragmentContainer images={images} />,
      query: graphql`
        query ImageCarouselTestsQuery($screenWidth: Int!) {
          artwork(id: "unused") {
            images {
              ...ImageCarousel_images
            }
          }
        }
      `,
      variables: {
        screenWidth: 234,
      },
      mockData: {
        artwork,
      },
    })
  }
  describe("with five images", () => {
    it("renders a flat list with five entries", async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find(FlatList)).toHaveLength(1)
      expect(wrapper.find(FlatList).props().data).toHaveLength(5)
    })

    it("shows five pagination dots", async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find("PaginationDot")).toHaveLength(5)
    })

    it("shows the first pagination dot as being selected and the rest as not selected", async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find("PaginationDot").map(dot => dot.props().selected)).toMatchObject([
        true,
        false,
        false,
        false,
        false,
      ])
    })

    it("'selects' subsequent pagination dots as a result of scrolling", async () => {
      const wrapper = await getWrapper()
      expect(wrapper.find("PaginationDot").map(dot => dot.props().selected)).toMatchObject([
        true,
        false,
        false,
        false,
        false,
      ])

      const measurements = getMeasurements({ images: artworkFixture.images, boundingBox: cardBoundingBox })

      wrapper
        .find(FlatList)
        .props()
        .onScroll({ nativeEvent: { contentOffset: { x: measurements[1].cumulativeScrollOffset } } })

      wrapper.update()

      expect(wrapper.find("PaginationDot").map(dot => dot.props().selected)).toMatchObject([
        false,
        true,
        false,
        false,
        false,
      ])

      wrapper
        .find(FlatList)
        .props()
        .onScroll({ nativeEvent: { contentOffset: { x: measurements[4].cumulativeScrollOffset } } })

      wrapper.update()

      expect(wrapper.find("PaginationDot").map(dot => dot.props().selected)).toMatchObject([
        false,
        false,
        false,
        false,
        true,
      ])
    })
  })

  describe("with one image", () => {
    const artwork = { ...artworkFixture, images: [artworkFixture.images[0]] }
    it("shows no pagination dots", async () => {
      const wrapper = await getWrapper(artwork)
      expect(wrapper.find("PaginationDot")).toHaveLength(0)
    })

    it("disables scrolling", async () => {
      const wrapper = await getWrapper(artwork)
      expect(wrapper.find(FlatList).props().scrollEnabled).toBe(false)
    })
  })
})

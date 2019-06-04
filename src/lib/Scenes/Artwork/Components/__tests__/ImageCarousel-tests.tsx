import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { FlatList } from "react-native"
import { graphql } from "react-relay"
import { fitInside, getMeasurements, ImageCarouselFragmentContainer } from "../ImageCarousel"

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
    it("renders a flat list with eight entries", async () => {
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
      expect(
        wrapper
          .find("PaginationDot")
          .at(0)
          .props().selected
      ).toBeTruthy()

      expect(
        wrapper
          .find("PaginationDot")
          .at(1)
          .props().selected
      ).toBeFalsy()
      expect(
        wrapper
          .find("PaginationDot")
          .at(2)
          .props().selected
      ).toBeFalsy()
      expect(
        wrapper
          .find("PaginationDot")
          .at(3)
          .props().selected
      ).toBeFalsy()
      expect(
        wrapper
          .find("PaginationDot")
          .at(4)
          .props().selected
      ).toBeFalsy()
    })
  })
})

describe(fitInside, () => {
  it("returns one of the given boxes if they are the same", () => {
    expect(fitInside({ width: 10, height: 10 }, { width: 10, height: 10 })).toMatchObject({
      width: 10,
      height: 10,
      marginHorizontal: 0,
      marginVertical: 0,
    })
  })

  it("constrains the box by height if it is too tall", () => {
    expect(fitInside({ width: 10, height: 10 }, { width: 10, height: 20 })).toMatchObject({
      width: 5,
      height: 10,
      marginHorizontal: 2.5,
      marginVertical: 0,
    })
  })

  it("constrains the box by width if it is too wide", () => {
    expect(fitInside({ width: 10, height: 10 }, { width: 20, height: 10 })).toMatchObject({
      width: 10,
      height: 5,
      marginHorizontal: 0,
      marginVertical: 2.5,
    })
  })
})

describe(getMeasurements, () => {
  it("Arranges images on the carousel rail", () => {
    expect(
      getMeasurements({
        images: [
          {
            thumbnail: {
              width: 10,
              height: 10,
            },
          },
          {
            thumbnail: {
              width: 10,
              height: 10,
            },
          },
        ] as any,
        boundingBox: { width: 10, height: 10 },
      })
    ).toMatchInlineSnapshot(`
Array [
  Object {
    "cumulativeScrollOffset": 0,
    "height": 10,
    "marginBottom": 0,
    "marginLeft": 0,
    "marginRight": 0,
    "marginTop": 0,
    "width": 10,
  },
  Object {
    "cumulativeScrollOffset": 10,
    "height": 10,
    "marginBottom": 0,
    "marginLeft": 0,
    "marginRight": 0,
    "marginTop": 0,
    "width": 10,
  },
]
`)
  })
})

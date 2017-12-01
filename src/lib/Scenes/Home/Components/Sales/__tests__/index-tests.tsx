import * as moment from "moment"
import React from "react"
import "react-native"
import * as renderer from "react-test-renderer"
import Sales from "../index"

it("looks correct when rendered", () => {
  const data = {
    relay: {
      hasMore: jest.fn(),
      isLoading: jest.fn(),
      loadMore: jest.fn(),
    },
    viewer: {
      sale_artworks: {
        pageInfo: {},
        edges: [
          {
            node: {
              id: "foo",
            },
          },
        ],
      },
    },
  }
  const auctions = renderer.create(<Sales sales={props} viewer={data.viewer} relay={data.relay as any} />)
  expect(auctions).toMatchSnapshot()
})

const props = [
  {
    id: "wright-noma",
    name: "Wright: noma",
    is_open: true,
    is_live_open: true,
    start_at: "2017-10-16T22:00:00+00:00",
    end_at: null,
    registration_ends_at: "2017-11-01T13:00:00+00:00",
    live_start_at: "2017-11-02T13:00:00+00:00",
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FWV-7BYlETayN8MGkNjOGXw%2Fsource.jpg",
      },
    },
  },
  {
    id: "freemans-modern-and-contemporary-works-of-art",
    name: "Freeman's: Modern & Contemporary Works of Art",
    is_open: true,
    is_live_open: false,
    start_at: "2017-10-17T15:00:00+00:00",
    end_at: null,
    registration_ends_at: "2017-11-01T17:00:00+00:00",
    live_start_at: "2017-11-02T17:00:00+00:00",
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FeeqLfwMMAYA8XOmeYEb7Rg%2Fsource.jpg",
      },
    },
  },
]

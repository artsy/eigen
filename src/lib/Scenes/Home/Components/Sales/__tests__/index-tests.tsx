import moment from "moment"
import React from "react"

import "react-native"
import * as renderer from "react-test-renderer"
import Auctions from "../index"

it("looks correct when rendered", () => {
  const auctions = renderer.create(<Auctions sales={props} />) as any
  expect(auctions).toMatchSnapshot()
})

const props = [
  {
    id: "wright-noma",
    name: "Wright: noma",
    is_open: true,
    is_live_open: true,
    start_at: moment().add(2, "hour").toISOString(),
    end_at: null,
    registration_ends_at: moment().subtract(1, "day").toISOString(),
    live_start_at: moment().add(2, "hour").toISOString(),
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
    start_at: moment().add(4, "hour").toISOString(),
    end_at: null,
    registration_ends_at: moment().add(1, "day").toISOString(),
    live_start_at: moment().add(4, "hour").toISOString(),
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FeeqLfwMMAYA8XOmeYEb7Rg%2Fsource.jpg",
      },
    },
  },
  {
    id: "sworders-modern-and-contemporary-prints",
    name: "Sworders: Modern & Contemporary Prints",
    is_open: true,
    is_live_open: true,
    start_at: moment().add(2, "hour").toISOString(),
    end_at: null,
    registration_ends_at: moment().subtract(1, "day").toISOString(),
    live_start_at: moment().add(2, "hour").toISOString(),
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FFd6a-B3zKYRqRTelap0aTg%2Fsquare.jpg",
      },
    },
  },
  {
    id: "aperture-live-benefit-auction-2017",
    name: "Aperture: Live Benefit Auction 2017",
    is_open: true,
    is_live_open: true,
    start_at: moment().add(2, "hour").toISOString(),
    end_at: null,
    registration_ends_at: moment().add(1, "day").toISOString(),
    live_start_at: moment().add(2, "hour").toISOString(),
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FApgUP8Zz5U1Swu8VpRs2BQ%2Fwide.jpg",
      },
    },
  },
  {
    id: "juliens-auctions-street-art-now-vi",
    name: "Julien’s Auctions: Street Art Now VI",
    is_open: true,
    is_live_open: false,
    start_at: moment().add(2, "hour").toISOString(),
    end_at: "2017-11-02T02:00:00+00:00",
    registration_ends_at: moment().subtract(1, "day").toISOString(),
    live_start_at: moment().add(2, "hour").toISOString(),
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F_dpoE5HDqU3W64l4oIskBQ%2Fsource.jpg",
      },
    },
  },
  {
    id: "doyle-prints-and-multiples",
    name: "Doyle: Prints & Multiples",
    is_open: true,
    is_live_open: true,
    start_at: moment().add(2, "hour").toISOString(),
    end_at: null,
    registration_ends_at: moment().subtract(1, "day").toISOString(),
    live_start_at: null,
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…%3A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F8gU6N7U9JXfLZh0akzfaPg%2Fwide.jpg",
      },
    },
  },
  {
    id: "phillips-photographs-4",
    name: "Phillips: Photographs",
    is_open: true,
    is_live_open: true,
    start_at: moment().add(2, "hour").toISOString(),
    end_at: null,
    registration_ends_at: moment().subtract(1, "day").toISOString(),
    live_start_at: null,
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…2dm0rphc51dk.cloudfront.net%2FGRxXa7ltRABT8iZ82EE47A%2Flarge_rectangle.jpg",
      },
    },
  },
  {
    id: "heritage-urban-art",
    name: "Heritage: Urban Art",
    is_open: true,
    is_live_open: false,
    start_at: moment().add(2, "hour").toISOString(),
    end_at: null,
    registration_ends_at: moment().subtract(1, "day").toISOString(),
    live_start_at: moment().add(2, "hour").toISOString(),
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…2dm0rphc51dk.cloudfront.net%2FXuSnDZhiwtk_vxNtZdmtDQ%2Flarge_rectangle.jpg",
      },
    },
  },
  {
    id: "rago-auctions-19th-slash-20th-c-american-slash-european-art-1",
    name: "Rago Auctions: 19th/20th C. American/European Art",
    is_open: true,
    is_live_open: false,
    start_at: moment().add(2, "hour").toISOString(),
    end_at: null,
    registration_ends_at: moment().subtract(1, "day").toISOString(),
    live_start_at: null,
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F3bMJYoT6kABYNSYHObRGuQ%2Fsource.jpg",
      },
    },
  },
  {
    id: "rago-auctions-property-from-the-collection-of-an-important-american-corporation",
    name: "Rago Auctions: Property from the Collection of an Important American Corporation",
    is_open: true,
    is_live_open: false,
    start_at: moment().add(2, "hour").toISOString(),
    end_at: null,
    registration_ends_at: moment().subtract(1, "day").toISOString(),
    live_start_at: null,
    cover_image: {
      cropped: {
        url:
          "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…2dm0rphc51dk.cloudfront.net%2FsrW6qryg-8eKJLzT06rBpA%2Flarge_rectangle.jpg",
      },
    },
  },
]

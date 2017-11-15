import moment from "moment"

import { liveDate, timedDate } from "../formatDate"

describe("live auction", () => {
  it("shows the right message when auction started", () => {
    const auction = { ...liveAuction }
    const date = moment().subtract(3, "days").toISOString()
    auction.registration_ends_at = date
    expect(liveDate(auction)).toEqual("In Progress")
  })

  it("shows the right message when auction will start", () => {
    const auction = { ...liveAuction }
    const date = moment().add(2, "hour").toISOString()
    auction.live_start_at = date
    expect(liveDate(liveAuction)).toEqual("Register by\n" + moment(auction.registration_ends_at).format("MMM D, ha"))
  })
})

describe("timed auction", () => {
  it("shows the right message when auction started", () => {
    const auction = { ...timedAuction }
    expect(timedDate(auction)).toEqual("7 days left")
  })

  it("shows the right message when auction will start", () => {
    const auction = { ...timedAuction }
    auction.start_at = moment().add(2, "days").toISOString()
    expect(timedDate(auction)).toEqual("Live in 2 days")
  })
})

const liveAuction = {
  id: "wright-noma",
  name: "Wright: noma",
  is_open: true,
  is_live_open: true,
  start_at: moment().subtract(6, "day").toISOString(),
  end_at: null,
  registration_ends_at: moment().add(4, "day").toISOString(),
  live_start_at: moment().subtract(3, "hour").toISOString(),
  cover_image: {
    cropped: {
      url:
        "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…A%2F%2Fd32dm0rphc51dk.cloudfront.net%2FWV-7BYlETayN8MGkNjOGXw%2Fsource.jpg",
    },
  },
}

const timedAuction = {
  id: "juliens-auctions-street-art-now-vi",
  name: "Julien’s Auctions: Street Art Now VI",
  is_open: true,
  is_live_open: false,
  start_at: moment().subtract(2, "day").toISOString(),
  end_at: moment().add(7, "day").toISOString(),
  registration_ends_at: null,
  live_start_at: null,
  cover_image: {
    cropped: {
      url:
        "https://d7hftxdivxxvm.cloudfront.net/?resize_to=fill&width=158&height=196&q…A%2F%2Fd32dm0rphc51dk.cloudfront.net%2F_dpoE5HDqU3W64l4oIskBQ%2Fsource.jpg",
    },
  },
}

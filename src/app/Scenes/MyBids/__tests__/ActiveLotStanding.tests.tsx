import { screen } from "@testing-library/react-native"
import { ActiveLotStanding_saleArtwork$data } from "__generated__/ActiveLotStanding_saleArtwork.graphql"
import { ActiveLotStanding } from "app/Scenes/MyBids/Components/ActiveLotStanding"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { merge } from "lodash"

const defaultSaleArtwork = {
  isHighestBidder: true,
  estimate: "$100",
  artwork: {
    internalId: "internalId",
    href: "/artwork/maskull-lasserre-painting",
    image: {
      url: "https://d2v80f5yrouhh2.cloudfront.net/zrtyPc3hnFNl-1yv80qS2w/medium.jpg",
    },
  },
  sale: {
    isLiveOpen: false,
    isLifeOpenHappend: false,
    endAt: "2020-08-05T15:00:00+00:00",
    status: "closed",
  },
  lotState: {
    soldStatus: "sold",
    sellingPrice: {
      display: "$100",
    },
  },
}

const saleArtworkFixture = (overrides = {}) => {
  return merge({}, defaultSaleArtwork, overrides) as unknown as ActiveLotStanding_saleArtwork$data
}

describe(ActiveLotStanding, () => {
  describe("User winning status", () => {
    it("says 'Highest bid' if the user is winning the lot", () => {
      renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { reserveStatus: "ReserveMet" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("Highest bid", { exact: false })
    })

    it("says 'Highest bid' if the user is has the high bid and reserveStatus is UnknownReserve", () => {
      renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { reserveStatus: "UnknownReserve" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("Highest bid", { exact: false })
    })

    it("says 'Highest bid' if the user is winning but reserveStatus is ReserveNotMet in auction with Live part", () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            sale: { liveStartAt: date, isLiveOpen: false },
            lotState: { reserveStatus: "ReserveNotMet" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("Highest bid", { exact: false })
    })

    it("hides winning info if auction with Live part are in Live bidding", () => {
      renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            sale: { liveStartAt: new Date(), isLiveOpen: true, isLiveOpenHappened: true },
            lotState: { reserveStatus: "ReserveNotMet" },
          })}
        />
      )
      expect(screen.root).not.toHaveTextContent("Highest bid", { exact: false })
    })

    it("hides winning info if auction with Live part is past open Live bidding time", () => {
      renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            sale: { liveStartAt: new Date(), isLiveOpen: false, isLiveOpenHappened: true },
            lotState: { reserveStatus: "ReserveNotMet" },
          })}
        />
      )
      expect(screen.root).not.toHaveTextContent("Highest bid", { exact: false })
    })

    it("says 'Reserve not met' if the user is winning the lot, but the reserveStatus is ReserveNotMet", () => {
      renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { reserveStatus: "ReserveNotMet" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("Reserve not met", { exact: false })
    })

    it("says 'Outbid' if the user is outbid on the lot, but the reserveStatus is ReserveNotMet", () => {
      renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: false,
            lotState: { reserveStatus: "ReserveNotMet" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("Outbid", { exact: false })
    })

    it("says 'outbid' if the user is outbid on the lot and reserve is met", () => {
      renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: false,
            lotState: { reserveStatus: "ReserveMet" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("Outbid", { exact: false })
    })
  })

  describe("selling price", () => {
    it("shows floor selling price", () => {
      renderWithWrappers(
        <ActiveLotStanding
          saleArtwork={saleArtworkFixture({
            isHighestBidder: true,
            lotState: { reserveStatus: "ReserveMet" },
          })}
        />
      )
      expect(screen.root).toHaveTextContent("$100", { exact: false })
    })
  })
})

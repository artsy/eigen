import { fireEvent } from "@testing-library/react-native"
import { ArtworkTombstone_artwork$data } from "__generated__/ArtworkTombstone_artwork.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { navigate } from "app/navigation/navigate"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ArtworkTombstone } from "./ArtworkTombstone"

describe("ArtworkTombstone", () => {
  it("renders fields correctly", () => {
    const { queryByText } = renderWithWrappers(
      <ArtworkTombstone artwork={artworkTombstoneArtwork} />
    )

    expect(queryByText("Hello im a title, 1992")).toBeTruthy()

    expect(queryByText("Lot 8")).toBeNull()
    expect(queryByText("Cool Auction")).toBeNull()
    expect(queryByText("Estimated value: CHF 160,000–CHF 230,000")).toBeNull()
  })

  it("renders auction fields correctly", () => {
    const { queryByText } = renderWithWrappers(
      <ArtworkTombstone artwork={artworkTombstoneAuctionArtwork} />
    )

    expect(queryByText("Lot 8")).toBeTruthy()
    expect(queryByText("Cool Auction")).toBeTruthy()
    expect(queryByText("Estimated value: CHF 160,000–CHF 230,000")).toBeTruthy()
  })

  it("redirects to artist page when artist name is clicked", () => {
    const { queryByText, getByText } = renderWithWrappers(
      <ArtworkTombstone artwork={artworkTombstoneArtwork} />
    )

    expect(queryByText(/Andy Warhol/)).toBeTruthy()
    fireEvent.press(getByText(/Andy Warhol/))

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })

  describe("for an artwork with more than 3 artists", () => {
    it("truncates artist names", () => {
      const { queryByText } = renderWithWrappers(
        <ArtworkTombstone artwork={artworkTombstoneArtwork} />
      )

      expect(queryByText(/Andy Warhol/)).toBeTruthy()
      expect(queryByText(/Alex Katz/)).toBeTruthy()
      expect(queryByText(/Pablo Picasso/)).toBeTruthy()
      expect(queryByText("2 more")).toBeTruthy()
      expect(queryByText("Barbara Kruger")).toBeNull()
      expect(queryByText("Banksy")).toBeNull()
    })

    it("doesn't show follow button", () => {
      const { queryByText } = renderWithWrappers(
        <ArtworkTombstone artwork={artworkTombstoneArtwork} />
      )

      expect(queryByText("Follow")).toBeNull()
    })

    it("shows truncated artist names when 'x more' is clicked", () => {
      const { queryByText, getByText } = renderWithWrappers(
        <ArtworkTombstone artwork={artworkTombstoneArtwork} />
      )

      fireEvent.press(getByText("2 more"))

      expect(queryByText("2 more")).toBeNull()
      expect(queryByText(/Barbara Kruger/)).toBeTruthy()
      expect(queryByText(/Banksy/)).toBeTruthy()
    })
  })

  describe("for an artwork in a sale with cascading end times or popcorn bidding", () => {
    const cascadingMessage = "Lots will close at 1-minute intervals."
    const popcornMessage = "Closing times may be extended due to last-minute competitive bidding. "
    it("renders the notification banner with cascading message", () => {
      const { queryByText } = renderWithWrappers(
        <ArtworkTombstone artwork={artworkTombstoneCascadingEndTimesAuctionArtwork()} />
      )

      expect(queryByText(cascadingMessage)).toBeTruthy()
      expect(queryByText(popcornMessage)).toBeNull()
    })

    it("renders the notification banner with popcorn message", () => {
      const { queryByText } = renderWithWrappers(
        <ArtworkTombstone artwork={artworkTombstoneCascadingEndTimesAuctionArtwork(true)} />
      )

      expect(queryByText(cascadingMessage)).toBeNull()
      expect(queryByText(popcornMessage)).toBeTruthy()
    })
  })

  describe("for an artwork in a sale without cascading end times", () => {
    it("renders the notification banner", () => {
      const { queryByText } = renderWithWrappers(
        <ArtworkTombstone artwork={artworkTombstoneAuctionArtwork} />
      )

      expect(queryByText("Lots will close at 1-minute intervals.")).toBeNull()
    })
  })

  describe("for an artwork with less than 4 artists but more than 1", () => {
    it("doesn't show follow button", () => {
      const { queryByText } = renderWithWrappers(
        <ArtworkTombstone artwork={threeArtistsArtworkData} />
      )

      expect(queryByText("Follow")).toBeNull()
    })

    it("doesn't truncate artist names", () => {
      const { queryByText } = renderWithWrappers(
        <ArtworkTombstone artwork={threeArtistsArtworkData} />
      )

      expect(queryByText(/Andy Warhol/)).toBeTruthy()
      expect(queryByText(/Alex Katz/)).toBeTruthy()
      expect(queryByText(/Pablo Picasso/)).toBeTruthy()
      expect(queryByText("2 more")).toBeNull()
      expect(queryByText(/Barbara Kruger/)).toBeNull()
      expect(queryByText(/Banksy/)).toBeNull()
    })
  })

  describe("for an artwork with one artist", () => {
    it("renders artist name", () => {
      const { queryByText } = renderWithWrappers(
        <ArtworkTombstone artwork={oneArtistArtworkData} />
      )

      expect(queryByText(/Andy Warhol/)).toBeTruthy()
      expect(queryByText(/Alex Katz/)).toBeNull()
      expect(queryByText(/Pablo Picasso/)).toBeNull()
    })
  })

  describe("for an artwork with no artists but a cultural maker", () => {
    it("renders artist name", () => {
      const { queryByText } = renderWithWrappers(<ArtworkTombstone artwork={noArtistArtworkData} />)
      expect(queryByText("18th century American")).toBeTruthy()
    })
  })
})

const artworkTombstoneArtwork: ArtworkTombstone_artwork$data = {
  ...ArtworkFixture,
  title: "Hello im a title",
  medium: "Painting",
  date: "1992",
  artists: [
    {
      name: "Andy Warhol",
      href: "/artist/andy-warhol",
      " $fragmentSpreads": null as any,
    },
    {
      name: "Alex Katz",
      href: "/artist/alex-katz",
      " $fragmentSpreads": null as any,
    },
    {
      name: "Pablo Picasso",
      href: "/artist/pablo-picasso",
      " $fragmentSpreads": null as any,
    },
    {
      name: "Banksy",
      href: "/artist/banksy",
      " $fragmentSpreads": null as any,
    },
    {
      name: "Barbara Kruger",
      href: "/artist/barbara-kruger",
      " $fragmentSpreads": null as any,
    },
  ],
  culturalMaker: null,
  " $fragmentType": "ArtworkTombstone_artwork",
}

const artworkTombstoneAuctionArtwork = {
  ...artworkTombstoneArtwork,
  isInAuction: true,
  saleArtwork: {
    lotLabel: "8",
    estimate: "CHF 160,000–CHF 230,000",
  },
  partner: {
    name: "Cool Auction",
  },
  sale: {
    isClosed: false,
    cascadingEndTimeIntervalMinutes: null,
    extendedBiddingIntervalMinutes: null,
  },
}

const artworkTombstoneCascadingEndTimesAuctionArtwork = (withextendedBidding: boolean = false) => ({
  ...artworkTombstoneArtwork,
  isInAuction: true,
  saleArtwork: {
    lotLabel: "8",
    estimate: "CHF 160,000–CHF 230,000",
  },
  partner: {
    name: "Cool Auction",
  },
  sale: {
    isClosed: false,
    cascadingEndTimeIntervalMinutes: 1,
    extendedBiddingIntervalMinutes: withextendedBidding ? 1 : null,
  },
})

const threeArtistsArtworkData = {
  ...artworkTombstoneArtwork,
  artists: artworkTombstoneArtwork.artists!.slice(0, 3),
}

const oneArtistArtworkData = {
  ...artworkTombstoneArtwork,
  artists: artworkTombstoneArtwork.artists!.slice(0, 1),
}

const noArtistArtworkData = {
  ...artworkTombstoneArtwork,
  artists: [],
  culturalMaker: "18th century American",
}

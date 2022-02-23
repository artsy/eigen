// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { shallow } from "enzyme"
import React from "react"
import "react-native"

import { renderWithLayout } from "app/tests/renderWithLayout"

import { GlobalStoreProvider } from "app/store/GlobalStore"
import { Theme } from "palette"
import { SalesFragmentContainer } from "./index"

jest.mock("app/Components/LotsByArtistsYouFollowRail/LotsByFollowedArtistsRail.tsx", () => "")

it("renders the ZeroState when there are no sales", () => {
  const auctions = shallow(
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    <SalesFragmentContainer {...props} sales={{ edges: [] } as any} me={null} />
  )
  expect(auctions.find("ZeroState").length).toEqual(1)
})

it("doesn't throw when rendered", () => {
  expect(() =>
    renderWithLayout(
      <GlobalStoreProvider>
        <Theme>
          <SalesFragmentContainer {...(props as any)} />
        </Theme>
      </GlobalStoreProvider>,
      { width: 1000 }
    )
  ).not.toThrow()
})

const saleArtworkNode = {
  artwork: {
    image: {
      url: "artworkImageUrl",
    },
    href: "/artwork/artwroks-href",
    saleMessage: "Contact For Price",
    artistNames: "Banksy",
    slug: "artwork-slug",
    internalID: "Internal-ID",
    sale: {
      isAuction: true,
      isClosed: false,
      displayTimelyAt: "register by\n5pm",
      endAt: null,
    },
    saleArtwork: {
      counts: "{bidderPositions: 0}",
      currentBid: '{display: "$650"}',
    },
    partner: {
      name: "Heritage Auctions",
    },
  },
  lotLabel: "1",
}

const saleArtworksConnectionEdges = new Array(10).fill({
  node: {
    saleArtwork: saleArtworkNode,
    id: saleArtworkNode.artwork.internalID,
    href: saleArtworkNode.artwork.href,
  },
})

const props = {
  Me: () => ({
    lotsByFollowedArtistsConnection: {
      edges: saleArtworksConnectionEdges,
    },
  }),
}

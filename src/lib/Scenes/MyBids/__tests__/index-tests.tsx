import React from "react"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { PlaceholderText } from "lib/utils/placeholders"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { merge } from "lodash"
import { MyBidsQueryRenderer } from ".."
import { lotStandings as lsFixtures, me as meFixture } from "../__fixtures__/MyBidsQuery"
import { ActiveLotFragmentContainer as ActiveLot, ClosedLotFragmentContainer as ClosedLot } from "../Components"

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

jest.unmock("react-relay")
const env = (defaultEnvironment as any) as ReturnType<typeof createMockEnvironment>

describe(MyBidsQueryRenderer, () => {
  it("spins until the operation resolves", () => {
    const tree = renderWithWrappers(<MyBidsQueryRenderer />)

    expect(tree.root.findAllByType(PlaceholderText).length).not.toBe(0)
  })

  it("renders upon success", () => {
    const tree = renderWithWrappers(<MyBidsQueryRenderer />)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("MyBidsQuery")

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: meFixture,
        },
      })
    })

    expect(extractText(tree.root)).toContain("Active")
    expect(extractText(tree.root)).toContain("Recently Closed")
    expect(extractText(tree.root)).toContain("Heritage: Urban Art Summer Skate")
    expect(extractText(tree.root)).toContain("Swann Auction Galleries: LGBTQ+ Art, Material Culture & History")

    const upcomingLots = tree.root.findAllByType(ActiveLot)

    // Active lots are sorted by sale so in a different order than recently closed lots

    expect(extractText(upcomingLots[0])).toContain("Open Swann RNM Artist")
    expect(extractText(upcomingLots[0])).toContain("1 bid")
    expect(extractText(upcomingLots[0])).toContain("Reserve not met")

    expect(extractText(upcomingLots[2])).toContain("Open Heritage Winning Artist")
    expect(extractText(upcomingLots[2])).toContain("2 bids")
    expect(extractText(upcomingLots[2])).toContain("Winning")

    expect(extractText(upcomingLots[1])).toContain("Open Swann Outbid Artist")
    expect(extractText(upcomingLots[1])).toContain("1 bid")
    expect(extractText(upcomingLots[1])).toContain("Outbid")

    const closedLots = tree.root.findAllByType(ClosedLot)

    expect(extractText(closedLots[0])).toContain("Closed Swann RNM Artist")
    expect(extractText(closedLots[0])).toContain("Passed")

    expect(extractText(closedLots[1])).toContain("Closed Heritage Winning Artist")
    expect(extractText(closedLots[1])).toContain("You won!")

    expect(extractText(closedLots[2])).toContain("Closed Swann Outbid Artist")
    expect(extractText(closedLots[2])).toContain("Outbid")
  })

  it.only("renders a completed lot in an ongoing live sale in the 'active' column", () => {
    const stillLiveSale = lsFixtures.rnm.node.saleArtwork.sale
    const passedLotInLiveAuction = merge(lsFixtures.passedClosed, {
      node: { saleArtwork: { lotState: { saleId: stillLiveSale.internalID }, sale: stillLiveSale } },
    })

    console.log(passedLotInLiveAuction.node, passedLotInLiveAuction.node.saleArtwork.artwork)
    const me = {
      auctionsLotStandingConnection: {
        edges: [passedLotInLiveAuction],
      },
    }

    const tree = renderWithWrappers(<MyBidsQueryRenderer />)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("MyBidsQuery")

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me,
        },
      })
    })

    const activeLots = tree.root.findAllByType(ActiveLot)
    expect(activeLots.length).toEqual(1)

    const lot = activeLots[0]
    expect(extractText(lot)).toContain("Closed Swann RNM Artist")
    expect(extractText(lot)).toContain("Passed")
  })

  it.skip("renders null upon failure", () => {
    const tree = renderWithWrappers(<MyBidsQueryRenderer />)

    act(() => {
      env.mock.rejectMostRecentOperation(new Error())
    })

    expect(tree).toMatchInlineSnapshot(`null`)
  })
})

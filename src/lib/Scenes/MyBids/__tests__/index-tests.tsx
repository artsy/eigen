import React from "react"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { PlaceholderText } from "lib/utils/placeholders"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { lotStandingNodes, me, saleNodes, sales } from "../__fixtures__/MyBidsQuery"
import { MyBidsQueryRenderer, RecentlyClosedLot, UpcomingLot } from "../index"

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
          me,
          sales,
        },
      })
    })

    expect(extractText(tree.root)).toContain("Upcoming")
    expect(extractText(tree.root)).toContain("Recently Closed")
    expect(extractText(tree.root)).toContain("Heritage: Urban Art Summer Skate")
    expect(extractText(tree.root)).toContain("Swann Auction Galleries: LGBTQ+ Art, Material Culture & History")

    const upcomingLots = tree.root.findAllByType(UpcomingLot)

    expect(extractText(upcomingLots[0])).toContain("Maskull Lasserre")
    expect(extractText(upcomingLots[0])).toContain("1 bid")
    expect(extractText(upcomingLots[0])).toContain("Reserve not met")

    expect(extractText(upcomingLots[1])).toContain("Leif Erik Nygards")
    expect(extractText(upcomingLots[1])).toContain("1 bid")
    expect(extractText(upcomingLots[1])).toContain("Outbid")

    expect(extractText(upcomingLots[2])).toContain("Zach Eugene Salinger-Simonson")
    expect(extractText(upcomingLots[2])).toContain("2 bids")
    expect(extractText(upcomingLots[2])).toContain("Highest Bid")

    const recentlyClosedLot = tree.root.findAllByType(RecentlyClosedLot)

    expect(extractText(recentlyClosedLot[0])).toContain("Maskull Lasserre")
    expect(extractText(recentlyClosedLot[0])).toContain("Didn't win")

    expect(extractText(recentlyClosedLot[1])).toContain("Zach Eugene Salinger-Simonson")
    expect(extractText(recentlyClosedLot[1])).toContain("You won!")

    expect(extractText(recentlyClosedLot[2])).toContain("Leif Erik Nygards")
    expect(extractText(recentlyClosedLot[2])).toContain("Didn't win")
  })

  it.skip("renders null upon failure", () => {
    const tree = renderWithWrappers(<MyBidsQueryRenderer />)

    act(() => {
      env.mock.rejectMostRecentOperation(new Error())
    })

    expect(tree).toMatchInlineSnapshot(`null`)
  })
})

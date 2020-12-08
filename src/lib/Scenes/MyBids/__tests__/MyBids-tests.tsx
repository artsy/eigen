import React from "react"
import { act, ReactTestInstance } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { PlaceholderText } from "lib/utils/placeholders"

import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { MyBidsQueryRenderer } from ".."
import { me as meFixture } from "../__fixtures__/MyBidsQuery"
import { ActiveLotFragmentContainer as ActiveLot, ClosedLotFragmentContainer as ClosedLot } from "../Components"

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

jest.unmock("react-relay")
const env = (defaultEnvironment as any) as ReturnType<typeof createMockEnvironment>

const activeSectionLots = (root: ReactTestInstance): ReactTestInstance[] => {
  const activeSection = root.findByProps({ "data-test-id": "active-section" })
  const activeLotsinActive = activeSection.findAllByType(ActiveLot)
  const completedLotsinActive = activeSection.findAllByType(ClosedLot)
  const activeLots = [...activeLotsinActive, ...completedLotsinActive]
  return activeLots
}

const closedSectionLots = (root: ReactTestInstance): ReactTestInstance[] => {
  const closedSection = root.findByProps({ "data-test-id": "closed-section" })
  return closedSection.findAllByType(ClosedLot)
}

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
    expect(extractText(tree.root)).toContain("Closed")
    expect(extractText(tree.root)).toContain("Heritage: Urban Art Summer Skate")
    expect(extractText(tree.root)).toContain("Swann Auction Galleries: LGBTQ+ Art, Material Culture & History")

    const activeLots = activeSectionLots(tree.root).map(extractText)

    // Active lots are grouped by sale and sorted by lot number (saleArtwork.position)
    expect(activeLots[0]).toContain("Open Heritage Winning Artist")
    expect(activeLots[0]).toContain("2 bids")
    expect(activeLots[0]).toContain("Lot 2")
    expect(activeLots[0]).toContain("Winning")

    expect(activeLots[1]).toContain("Open Swann Outbid Artist")
    expect(activeLots[1]).toContain("1 bid")
    expect(activeLots[1]).toContain("Lot 1")
    expect(activeLots[1]).toContain("Outbid")

    expect(activeLots[2]).toContain("Open Swann RNM Artist")
    expect(activeLots[2]).toContain("1 bid")
    expect(activeLots[2]).toContain("Lot 3")
    expect(activeLots[2]).toContain("Reserve not met")

    const closedLots = closedSectionLots(tree.root).map(extractText)

    // Closed lots have no ordering - assume they are served by recentness
    expect(closedLots[0]).toContain("Closed Swann RNM Artist")
    expect(closedLots[0]).toContain("Passed")
    expect(closedLots[0]).toContain("Closed Aug 13")

    expect(closedLots[1]).toContain("Closed Heritage Winning Artist")
    expect(closedLots[1]).toContain("You won!")
    expect(closedLots[1]).toContain("Closed Aug 5")

    expect(closedLots[2]).toContain("Closed Swann Outbid Artist")
    expect(closedLots[2]).toContain("Outbid")
    expect(closedLots[2]).toContain("Closed Aug 13")
  })

  it.skip("renders null upon failure", () => {
    const tree = renderWithWrappers(<MyBidsQueryRenderer />)

    act(() => {
      env.mock.rejectMostRecentOperation(new Error())
    })

    expect(tree).toMatchInlineSnapshot(`null`)
  })
})

import { Theme } from "@artsy/palette"
import React from "react"
import { FlatList } from "react-native"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { MyBids_me } from "__generated__/MyBids_me.graphql"
import { MyBids_sales } from "__generated__/MyBids_sales.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { PlaceholderText } from "lib/utils/placeholders"

import { lotStandings, sales } from "../__fixtures__/MyBidsQuery"
import { MyBidsQueryRenderer, RecentlyClosedLot, UpcomingLot } from "../index"

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

jest.unmock("react-relay")
const env = (defaultEnvironment as any) as ReturnType<typeof createMockEnvironment>

describe(MyBidsQueryRenderer, () => {
  it("spins until the operation resolves", () => {
    const tree = ReactTestRenderer.create(
      <Theme>
        <MyBidsQueryRenderer />
      </Theme>
    )

    expect(tree.root.findAllByType(PlaceholderText).length).not.toBe(0)
  })

  it("renders upon success", () => {
    const tree = ReactTestRenderer.create(
      <Theme>
        <MyBidsQueryRenderer />
      </Theme>
    )
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("MyBidsQuery")

    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: { lotStandings },
          sales,
        } as {
          me: Omit<MyBids_me, " $refType">
          sales: Omit<MyBids_sales, " $refType">
        },
      })
    })

    expect(extractText(tree.root)).toContain("Upcoming (3)")
    expect(extractText(tree.root)).toContain("Recently Closed (3)")

    const saleFlatList = tree.root.findAllByType(FlatList)[1]

    expect(extractText(saleFlatList)).toContain(sales.edges[0].node.name)
    expect(extractText(saleFlatList)).toContain(sales.edges[1].node.name)

    const upcomingLots = tree.root.findAllByType(UpcomingLot)

    expect(extractText(upcomingLots[0])).toContain(lotStandings[0].saleArtwork.artwork.artistNames)
    expect(extractText(upcomingLots[0])).toContain("1 bid")
    expect(extractText(upcomingLots[0])).toContain("Reserve not met")
    expect(extractText(upcomingLots[1])).toContain(lotStandings[1].saleArtwork.artwork.artistNames)
    expect(extractText(upcomingLots[1])).toContain("2 bids")
    expect(extractText(upcomingLots[1])).toContain("Highest Bid")
    expect(extractText(upcomingLots[2])).toContain(lotStandings[2].saleArtwork.artwork.artistNames)
    expect(extractText(upcomingLots[2])).toContain("2 bids")
    expect(extractText(upcomingLots[2])).toContain("Outbid")

    const recentlyClosedLot = tree.root.findAllByType(RecentlyClosedLot)

    expect(extractText(recentlyClosedLot[0])).toContain(lotStandings[0].saleArtwork.artwork.artistNames)
    expect(extractText(recentlyClosedLot[0])).toContain("Didn't win")
    expect(extractText(recentlyClosedLot[1])).toContain(lotStandings[1].saleArtwork.artwork.artistNames)
    expect(extractText(recentlyClosedLot[1])).toContain("You won!")
    expect(extractText(recentlyClosedLot[2])).toContain(lotStandings[2].saleArtwork.artwork.artistNames)
    expect(extractText(recentlyClosedLot[2])).toContain("Didn't win")
  })

  it.skip("renders null upon failure", () => {
    const tree = ReactTestRenderer.create(
      <Theme>
        <MyBidsQueryRenderer />
      </Theme>
    )

    act(() => {
      env.mock.rejectMostRecentOperation(new Error())
    })

    expect(tree).toMatchInlineSnapshot(`null`)
  })
})

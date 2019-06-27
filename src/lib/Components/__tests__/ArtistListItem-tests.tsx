import { Button } from "@artsy/palette"
import { MockRelayRenderer } from "lib/tests/MockRelayRenderer"
import { renderUntil } from "lib/tests/renderUntil"
import React from "react"
import { graphql } from "react-relay"
import { ArtistFixture } from "../../__fixtures__/ArtistFixture"
import { ArtistListItemContainer as ArtistListItem, formatTombstoneText } from "../ArtistListItem"

jest.unmock("react-relay")

describe("ArtistListItem", () => {
  const render = () =>
    renderUntil(
      wrapper => {
        return wrapper.find(Button).length > 0
      },
      <MockRelayRenderer
        Component={({ artist }) => <ArtistListItem artist={artist} />}
        query={graphql`
          query ArtistListItemTestsQuery {
            artist(id: "pablo-picasso") {
              ...ArtistListItem_artist
            }
          }
        `}
        mockResolvers={{
          Artist: () => ArtistFixture,
        }}
      />
    )

  it("renders properly", async () => {
    const tree = await render()
    expect(tree.html()).toMatchSnapshot()
  })
})

describe("formatTombstoneText", () => {
  it("formats with birthday and deathday", () => {
    expect(formatTombstoneText("American", "1990", "2014")).toBe("American, 1990-2014")
  })

  it("formats with only birthday and nationality", () => {
    expect(formatTombstoneText("American", "1990", "")).toBe("American, b. 1990")
  })

  it("formats with only nationality", () => {
    expect(formatTombstoneText("American", "", "")).toBe("American")
  })

  it("formats without nationality", () => {
    expect(formatTombstoneText("", "1990", "2014")).toBe("1990-2014")
  })

  it("formats with only birthday", () => {
    expect(formatTombstoneText("", "1990", "")).toBe("b. 1990")
  })
})

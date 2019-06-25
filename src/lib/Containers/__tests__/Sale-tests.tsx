import React from "react"
import * as renderer from "react-test-renderer"

// Stub out these views for simplicity sake
jest.mock("../../Components/Sale/Header", () => "Header")

import { Sale } from "../Sale"

import artwork from "../../Components/ArtworkGrids/__tests__/__fixtures__/artwork"

import { Theme } from "@artsy/palette"

describe("state", () => {
  it("looks okay by default", () => {
    const sale = {
      saleArtworks: [
        {
          artwork: artwork(),
        },
      ],
    }
    const tree = renderer
      .create(
        <Theme>
          <Sale sale={sale as any} relay={null} />
        </Theme>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

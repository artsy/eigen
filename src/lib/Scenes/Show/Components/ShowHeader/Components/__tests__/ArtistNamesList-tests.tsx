import React from "react"
import * as renderer from "react-test-renderer"
import { ArtistNamesList } from "../ArtistNamesList"

const artists = [
  { href: "/artist/super-artsy-artist", name: "Super Artsy Artist" },
  { href: "/artist/another-super-artsy-artist", name: "Another Super Artsy Artist" },
]
const navigationMockFunction = jest.fn()
const showHeaderMock = jest.mock("../../ShowHeader")

describe("artistList", () => {
  it("renders the Artists List properly", () => {
    const comp = renderer.create(
      <ArtistNamesList artists={artists} Component={showHeaderMock} viewAllArtists={navigationMockFunction} />
    )
    expect(comp).toMatchSnapshot()
  })
})

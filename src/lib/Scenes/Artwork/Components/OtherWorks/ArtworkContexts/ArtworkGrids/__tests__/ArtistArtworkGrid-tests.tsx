import { shallow } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import GenericGrid from "lib/Components/ArtworkGrids/GenericGrid"
import React from "react"
import { Header } from "../../../Header"
import { ArtistArtworkGrid } from "../ArtistArtworkGrid"

describe("ArtistArtworkGrid", () => {
  it("renders ArtistArtworkGrid with correct components", () => {
    const component = shallow(<ArtistArtworkGrid artwork={ArtworkFixture} />)
    expect(component.find(Header).length).toEqual(1)
    expect(
      component
        .find(Header)
        .at(0)
        .render()
        .text()
    ).toEqual("Other works by Abbas Kiarostami")
    expect(component.find(GenericGrid).length).toEqual(1)
  })
})

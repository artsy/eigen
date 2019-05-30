import { shallow } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { ArtworkContextArtistFragmentContainer as ArtworkContextArtist } from "../OtherWorks/ArtworkContexts/ArtworkContextArtist"
import { OtherWorksFragmentContainer as OtherWorks } from "../OtherWorks/index"

describe("OtherWorks", () => {
  it("renders ArtistArtworkGrid with correct components", () => {
    const regularArtwork = {
      ...ArtworkFixture,
      context: null,
    }
    const component = shallow(<OtherWorks artwork={regularArtwork} />)
    expect(component.find(ArtworkContextArtist).length).toEqual(1)
    expect(
      component
        .find(ArtworkContextArtist)
        .at(0)
        .render()
        .text()
    ).toEqual("Other works by Abbas Kiarostami")
  })

  it("returns null for artwork with ArtworkContextAuction context", () => {
    const regularArtwork = {
      ...ArtworkFixture,
      context: {
        __typename: "ArtworkContextAuction",
      },
    }
    const component = shallow(<OtherWorks artwork={regularArtwork} />)
    expect(component.render().text()).toEqual("")
  })

  it("returns null for artwork with ArtworkContextFair context", () => {
    const regularArtwork = {
      ...ArtworkFixture,
      context: {
        __typename: "ArtworkContextFair",
      },
    }
    const component = shallow(<OtherWorks artwork={regularArtwork} />)
    expect(component.render().text()).toEqual("")
  })

  it("returns null for artwork with ArtworkContextPartnerShow context", () => {
    const regularArtwork = {
      ...ArtworkFixture,
      context: {
        __typename: "ArtworkContextPartnerShow",
      },
    }
    const component = shallow(<OtherWorks artwork={regularArtwork} />)
    expect(component.render().text()).toEqual("")
  })
})

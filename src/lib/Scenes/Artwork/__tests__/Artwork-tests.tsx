import { shallow } from "enzyme"
import React from "react"
import { Artwork } from "../Artwork"
import { ArtworkActions } from "../Components/ArtworkActions"

describe("Artwork", () => {
  it("renders a snapshot", () => {
    const component = shallow(<Artwork artwork={{ " $fragmentRefs": null, images: [], " $refType": null }} />)
    expect(component.find(ArtworkActions).length).toEqual(1)
  })
})

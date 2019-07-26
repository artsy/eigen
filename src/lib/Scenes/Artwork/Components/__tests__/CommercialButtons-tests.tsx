import { Button } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { RelayProp } from "react-relay"
import { CommercialButtons } from "../CommercialButtons"

let artwork = {
  slug: "abbas-kiarostami-untitled-7",
  internalID: "5b2b745e9c18db204fc32e11",
  is_acquireable: false,
  is_offerable: false,
  is_biddable: false,
  is_inquireable: true,
}

describe("CommercialButtons", () => {
  artwork = {
    slug: "abbas-kiarostami-untitled-7",
    internalID: "5b2b745e9c18db204fc32e11",
    is_acquireable: false,
    is_offerable: false,
    is_biddable: false,
    is_inquireable: true,
  }
  it("renders inquierable button", () => {
    const component = mount(<CommercialButtons relay={{ environment: {} } as RelayProp} artwork={artwork as any} />)
    expect(component.text()).toContain("Contact gallery")
  })

  it("renders offerable button", () => {
    artwork = {
      slug: "abbas-kiarostami-untitled-7",
      internalID: "5b2b745e9c18db204fc32e11",
      is_acquireable: false,
      is_offerable: false,
      is_biddable: false,
      is_inquireable: true,
    }
    const component = mount(<CommercialButtons relay={{ environment: {} } as RelayProp} artwork={artwork as any} />)
    expect(component.text()).toContain("Contact gallery")
  })

  it("renders acquierable button", () => {
    artwork = {
      slug: "abbas-kiarostami-untitled-7",
      internalID: "5b2b745e9c18db204fc32e11",
      is_acquireable: true,
      is_offerable: false,
      is_biddable: false,
      is_inquireable: false,
    }
    const component = mount(<CommercialButtons relay={{ environment: {} } as RelayProp} artwork={artwork as any} />)
    expect(component.text()).toContain("Buy now")
  })

  it("renders both offerable and acquierable buttons", () => {
    artwork = {
      slug: "abbas-kiarostami-untitled-7",
      internalID: "5b2b745e9c18db204fc32e11",
      is_acquireable: true,
      is_offerable: true,
      is_biddable: false,
      is_inquireable: true,
    }
    const component = mount(<CommercialButtons relay={{ environment: {} } as RelayProp} artwork={artwork as any} />)
    expect(
      component
        .find(Button)
        .at(0)
        .text()
    ).toContain("Buy now")
    expect(
      component
        .find(Button)
        .at(1)
        .text()
    ).toContain("Make offer")
  })
})

import { Sans, Theme } from "@artsy/palette"
import { mount, shallow } from "enzyme"
import { ReadMore } from "lib/Components/ReadMore"
import React from "react"
import { Text } from "react-native"
import { AboutWork } from "../AboutWork"

jest.mock("../../hardware", () => ({
  truncatedTextLimit: jest.fn(),
}))

import { truncatedTextLimit } from "../../hardware"

describe("AboutWork", () => {
  beforeEach(() => {
    ;(truncatedTextLimit as jest.Mock).mockReset()
  })
  it("renders the AboutWork correctly if all info is present", () => {
    const component = shallow(<AboutWork artwork={aboutWorkArtwork} />)
    expect(component.find(Sans).length).toEqual(2)
    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).toMatchInlineSnapshot(`"About the work"`)
    expect(
      component
        .find(Sans)
        .at(1)
        .text()
    ).toMatchInlineSnapshot(`"From Artsy Specialist:"`)

    expect(component.find(ReadMore).length).toEqual(2)
  })

  it("renders the AboutWork correctly if only additional information is present", () => {
    const artworkNoDescription = { ...aboutWorkArtwork, description: null }

    const component = shallow(<AboutWork artwork={artworkNoDescription} />)
    expect(component.find(Sans).length).toEqual(1)
    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).toMatchInlineSnapshot(`"About the work"`)

    expect(component.find(ReadMore).length).toEqual(1)
  })

  it("renders the AboutWork correctly if only description is present", () => {
    const artworkNoAdditionalInfo = { ...aboutWorkArtwork, additional_information: null }

    const component = shallow(<AboutWork artwork={artworkNoAdditionalInfo} />)
    expect(component.find(Sans).length).toEqual(2)
    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).toMatchInlineSnapshot(`"About the work"`)

    expect(
      component
        .find(Sans)
        .at(1)
        .text()
    ).toMatchInlineSnapshot(`"From Artsy Specialist:"`)

    expect(component.find(ReadMore).length).toEqual(1)
  })

  it("renders nothing if no information is present", () => {
    const artworkNoInfo = { ...aboutWorkArtwork, additional_information: null, description: null }

    const component = shallow(<AboutWork artwork={artworkNoInfo} />)
    expect(component.find(Sans).length).toEqual(0)
  })

  it("hides 'From Artsy Specialist:' for auction works", () => {
    const artworkInAuction = { ...aboutWorkArtwork, isInAuction: true }
    const component = shallow(<AboutWork artwork={artworkInAuction} />)
    expect(component.find(Sans).length).toEqual(1)
    expect(
      component
        .find(Sans)
        .at(0)
        .text()
    ).not.toEqual("From Artsy Specialist:")
  })

  it("truncates the reaad more component properly for phones", () => {
    ;(truncatedTextLimit as jest.Mock).mockReturnValueOnce(140)
    const component = mount(
      <Theme>
        <AboutWork artwork={aboutWorkArtwork} />
      </Theme>
    )

    // The ellipses and "Read more" text adds an additional 13 characters to the limit of 140
    expect(
      component
        .find(ReadMore)
        .at(0)
        .find(Text)
        .at(0)
        .text().length
    ).toEqual(140 + 13)
  })

  it("truncates the reaad more component properly for tablets", () => {
    ;(truncatedTextLimit as jest.Mock).mockReturnValueOnce(320)
    const component = mount(
      <Theme>
        <AboutWork artwork={aboutWorkArtwork} />
      </Theme>
    )

    // The ellipses and "Read more" text adds an additional 13 characters to the limit of 320
    expect(
      component
        .find(ReadMore)
        .at(0)
        .find(Text)
        .at(0)
        .text().length
    ).toEqual(320 + 13)
  })
})

const aboutWorkArtwork = {
  additional_information:
    "This is some information about the artwork by the gallery. It has to be at least 320 characters in order to test that the read more component truncates possibly. So here is soem lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  description: "This is some information about the artwork by Artsy.",
  isInAuction: false,
  " $refType": null,
}

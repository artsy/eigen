import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { Text } from "react-native"
import { ArtworkExtraLinks } from "../ArtworkExtraLinks"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

import SwitchBoard from "lib/NativeModules/SwitchBoard"

describe("ArtworkExtraLinks", () => {
  it("redirects to consignments flow when consignments link is clicked", () => {
    const component = mount(
      <Theme>
        <ArtworkExtraLinks
          artworkSlug={"123"}
          isAcquireable={false}
          isInquireable={false}
          consignableArtistsCount={3}
          artistName={null}
        />
      </Theme>
    )
    const consignmentsLink = component.find(Text).at(1)
    expect(consignmentsLink.text()).toContain("Consign with Artsy.")
    consignmentsLink.props().onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/consign/submission")
  })

  describe("for an artwork with more than 1 consignable artist", () => {
    it("shows plural link text", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artworkSlug={"123"}
            isAcquireable={false}
            isInquireable={false}
            consignableArtistsCount={3}
            artistName={null}
          />
        </Theme>
      )
      expect(component.text()).toContain("Want to sell a work by these artists?")
    })
    it("shows consign link if at least 1 artist is consignable", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artworkSlug={"123"}
            isAcquireable={false}
            isInquireable={false}
            consignableArtistsCount={3}
            artistName={null}
          />
        </Theme>
      )
      expect(component.text()).toContain("Consign with Artsy.")
    })
    it("doesn't render component if no artists are consignable", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artworkSlug={"123"}
            consignableArtistsCount={1}
            isAcquireable={false}
            isInquireable={false}
            artistName={null}
          />
        </Theme>
      )
      expect(component).toEqual({})
    })
  })

  describe("for an artwork with one artist", () => {
    it("shows singular link text", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artworkSlug={"123"}
            isAcquireable={false}
            isInquireable={false}
            consignableArtistsCount={1}
            artistName="Santa Claus"
          />
        </Theme>
      )
      expect(component.text()).toContain("Want to sell a work by Santa Claus?")
    })

    it("shows consign link", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artworkSlug={"123"}
            isAcquireable={false}
            isInquireable={false}
            consignableArtistsCount={1}
            artistName="Santa Claus"
          />
        </Theme>
      )
      expect(component.text()).toContain("Consign with Artsy.")
    })
  })
  describe("FAQ and specialist links", () => {
    it("renders FAQ link when isInquireable", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artworkSlug={"123"}
            isAcquireable={false}
            isInquireable={true}
            consignableArtistsCount={1}
            artistName="Santa Claus"
          />
        </Theme>
      )
      expect(component.text()).toContain("Read our FAQ")
      expect(component.text()).not.toContain("ask a specialist")
    })

    it("renders ask a specialist link when isAcquireable", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks
            artworkSlug={"123"}
            isAcquireable={true}
            isInquireable={true}
            consignableArtistsCount={1}
            artistName="Santa Claus"
          />
        </Theme>
      )
      expect(component.text()).toContain("Read our FAQ")
      expect(component.text()).toContain("ask a specialist")
    })
  })
})

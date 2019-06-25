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
        <ArtworkExtraLinks artwork={ArtworkWithFollowableArtists as any} />
      </Theme>
    )
    const consignmentsLink = component.find(Text).at(1)
    expect(consignmentsLink.text()).toContain("Consign with Artsy.")
    consignmentsLink.props().onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/consign/info")
  })

  describe("for an artwork with more than 1 followable artist", () => {
    it("shows plural link text", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={ArtworkWithFollowableArtists as any} />
        </Theme>
      )
      expect(component.text()).toContain("Want to sell a work by these artists?")
    })
    it("shows consign link if at least 1 artist is consignamble", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={ArtworkWithFollowableArtists as any} />
        </Theme>
      )
      expect(component.text()).toContain("Consign with Artsy.")
    })
    it("doesn't show consign link if no artists are consignable", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={ArtworkWithoutFollowableArtists as any} />
        </Theme>
      )
      expect(component.text()).not.toContain("Consign with Artsy.")
    })
  })

  describe("for an artwork with one artist", () => {
    beforeEach(() => {
      ArtworkWithFollowableArtists.artists = ArtworkWithFollowableArtists.artists.slice(0, 1)
    })
    it("shows singular link text", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={ArtworkWithFollowableArtists as any} />
        </Theme>
      )
      expect(component.text()).toContain("Want to sell a work by this artist?")
    })

    it("shows consign link", () => {
      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={ArtworkWithFollowableArtists as any} />
        </Theme>
      )
      expect(component.text()).toContain("Consign with Artsy.")
    })
  })
})

const ArtworkWithoutFollowableArtists = {
  artists: [
    {
      is_consignable: false,
      " $fragmentRefs": null,
    },
    {
      is_consignable: false,
      " $fragmentRefs": null,
    },
  ],
  " $refType": null,
}

const ArtworkWithFollowableArtists = {
  artists: [
    {
      is_consignable: true,
      " $fragmentRefs": null,
    },
    {
      is_consignable: true,
      " $fragmentRefs": null,
    },
    {
      is_consignable: false,
      " $fragmentRefs": null,
    },
  ],
  " $refType": null,
}

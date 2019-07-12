import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { NativeModules, TouchableWithoutFeedback } from "react-native"
import { ArtworkTombstone } from "../ArtworkTombstone"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

import SwitchBoard from "lib/NativeModules/SwitchBoard"

describe("ArtworkTombstone", () => {
  it("renders fields correctly", () => {
    const component = mount(
      <Theme>
        <ArtworkTombstone artwork={artworkTombstoneArtwork} />
      </Theme>
    )
    expect(component.text()).toContain("Hello im a title, 1992")
    expect(component.text()).toContain("Painting")
    expect(component.text()).toContain("Edition 100/200")
    expect(component.text()).toContain("This is an edition of something")
  })

  it("redirects to artist page when artist name is clicked", () => {
    const component = mount(
      <Theme>
        <ArtworkTombstone artwork={artworkTombstoneArtwork} />
      </Theme>
    )
    const artistName = component.find(TouchableWithoutFeedback).at(0)
    expect(artistName.text()).toContain("Andy Warhol")
    artistName.props().onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/artist/andy-warhol")
  })

  it("redirects to attribution class faq page when attribution class is clicked", () => {
    const component = mount(
      <Theme>
        <ArtworkTombstone artwork={artworkTombstoneArtwork} />
      </Theme>
    )
    const attributionClass = component.find(TouchableWithoutFeedback).at(4)
    expect(attributionClass.text()).toContain("This is an edition of something")
    attributionClass.props().onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/artwork-classifications"
    )
  })

  describe("for a user not in the US", () => {
    beforeAll(() => {
      NativeModules.ARCocoaConstantsModule.CurrentLocale = "fr_FR"
    })

    it("renders dimensions in centimeters", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).toContain("38.1 × 50.8 cm")
    })
  })

  describe("for a US based user", () => {
    beforeAll(() => {
      NativeModules.ARCocoaConstantsModule.CurrentLocale = "en_US"
    })

    it("renders dimensions in inches", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).toContain("15 × 20 in")
    })
  })

  describe("for an artwork with more than 3 artists", () => {
    it("truncates artist names", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).toContain("Andy Warhol")
      expect(component.text()).toContain("Alex Katz")
      expect(component.text()).toContain("Pablo Picasso")
      expect(component.text()).toContain("2 more")
      expect(component.text()).not.toContain("Barbara Kruger")
      expect(component.text()).not.toContain("Banksy")
    })

    it("doesn't show follow button", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).not.toContain("Follow")
    })

    it("shows truncated artist names when 'x more' is clicked", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      const showMore = component.find(TouchableWithoutFeedback).at(3)
      expect(showMore.text()).toContain("2 more")
      showMore.props().onPress()
      expect(component.text()).not.toContain("2 more")
      expect(component.text()).toContain("Barbara Kruger")
      expect(component.text()).toContain("Banksy")
    })
  })

  describe("for an artwork with less than 4 artists but more than 1", () => {
    beforeEach(() => {
      artworkTombstoneArtwork.artists = artworkTombstoneArtwork.artists.slice(0, 3)
    })

    it("doesn't show follow button", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).not.toContain("Follow")
    })

    it("doesn't truncate artist names", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).toContain("Andy Warhol")
      expect(component.text()).toContain("Alex Katz")
      expect(component.text()).toContain("Pablo Picasso")
      expect(component.text()).not.toContain("2 more")
      expect(component.text()).not.toContain("Barbara Kruger")
      expect(component.text()).not.toContain("Banksy")
    })
  })

  describe("for an artwork with one artist", () => {
    beforeEach(() => {
      artworkTombstoneArtwork.artists = artworkTombstoneArtwork.artists.slice(0, 1)
    })

    it("renders artist name", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).toContain("Andy Warhol")
    })

    it("shows follow button", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).toContain("Follow")
    })
  })

  describe("for an artwork with no artists but a cultural maker", () => {
    beforeEach(() => {
      artworkTombstoneArtwork.artists = []
      artworkTombstoneArtwork.cultural_maker = "18th century American"
    })

    it("renders artist name", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).toContain("18th century American")
    })

    it("shows follow button", () => {
      const component = mount(
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      )
      expect(component.text()).not.toContain("Follow")
    })
  })
})

const artworkTombstoneArtwork = {
  title: "Hello im a title",
  medium: "Painting",
  date: "1992",
  artists: [
    {
      name: "Andy Warhol",
      href: "/artist/andy-warhol",
      id: "1234",
      gravityID: "andy-warhol",
      is_followed: false,
      " $fragmentRefs": null,
    },
    {
      name: "Alex Katz",
      href: "/artist/alex-katz",
      id: "4354",
      gravityID: "alex-katz",
      is_followed: false,
      " $fragmentRefs": null,
    },
    {
      name: "Pablo Picasso",
      href: "/artist/pablo-picasso",
      id: "3433",
      gravityID: "pablo-picasso",
      is_followed: false,
      " $fragmentRefs": null,
    },
    {
      name: "Banksy",
      href: "/artist/banksy",
      id: "3468",
      gravityID: "banksy",
      is_followed: false,
      " $fragmentRefs": null,
    },
    {
      name: "Barbara Kruger",
      href: "/artist/barbara-kruger",
      id: "9874",
      gravityID: "barbara-kruger",
      is_followed: false,
      " $fragmentRefs": null,
    },
  ],
  cultural_maker: null,
  dimensions: {
    in: "15 × 20 in",
    cm: "38.1 × 50.8 cm",
  },
  edition_of: "Edition 100/200",
  attribution_class: {
    shortDescription: "This is an edition of something",
  },
  " $refType": null,
}

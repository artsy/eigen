import { ArtworkTombstone_artwork } from "__generated__/ArtworkTombstone_artwork.graphql"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { navigate } from "lib/navigation/navigate"
import { GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { ArtworkTombstone } from "./ArtworkTombstone"

describe("ArtworkTombstone", () => {
  it("renders fields correctly", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.text()).toContain("Hello im a title, 1992")
    expect(component.text()).toContain("Painting")
    expect(component.text()).toContain("Edition 100/200")
    expect(component.text()).toContain("This is an edition of something")
    expect(component.text()).not.toContain("Lot 8")
    expect(component.text()).not.toContain("Cool Auction")
    expect(component.text()).not.toContain("Estimated value: CHF 160,000–CHF 230,000")
  })

  it("renders auction fields correctly", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneAuctionArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.text()).toContain("Lot 8")
    expect(component.text()).toContain("Cool Auction")
    expect(component.text()).toContain("Estimated value: CHF 160,000–CHF 230,000")
  })

  it("redirects to artist page when artist name is clicked", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )
    const artistName = component.find(TouchableWithoutFeedback).at(0)
    expect(artistName.text()).toContain("Andy Warhol")
    artistName.props().onPress()
    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })

  it("redirects to attribution class faq page when attribution class is clicked", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )
    const attributionClass = component.find(TouchableWithoutFeedback).at(4)
    expect(attributionClass.text()).toContain("This is an edition of something")
    attributionClass.props().onPress()
    expect(navigate).toHaveBeenCalledWith("/artwork-classifications")
  })

  describe("for a user not in the US", () => {
    it("renders dimensions in centimeters", () => {
      LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale = "fr_FR"
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.text()).toContain("38.1 × 50.8 cm")
    })
  })

  describe("for a US based user", () => {
    it("renders dimensions in inches", () => {
      LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale = "en_US"
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.text()).toContain("15 × 20 in")
    })
  })

  describe("for an artwork with more than 3 artists", () => {
    it("truncates artist names", () => {
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
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
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.text()).not.toContain("Follow")
    })

    it("shows truncated artist names when 'x more' is clicked", () => {
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      const showMore = component.find(TouchableWithoutFeedback).at(3)
      expect(showMore.text()).toContain("2 more")
      showMore.props().onPress()
      expect(component.text()).not.toContain("2 more")
      expect(component.text()).toContain("Barbara Kruger")
      expect(component.text()).toContain("Banksy")
    })
  })

  // TODO: THESE TESTS SHOULD NOT MUTATE THE FIXTURE!!!
  describe("for an artwork with less than 4 artists but more than 1", () => {
    beforeEach(() => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      artworkTombstoneArtwork.artists = artworkTombstoneArtwork.artists.slice(0, 3)
    })

    it("doesn't show follow button", () => {
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.text()).not.toContain("Follow")
    })

    it("doesn't truncate artist names", () => {
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
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
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      artworkTombstoneArtwork.artists = artworkTombstoneArtwork.artists.slice(0, 1)
    })

    it("renders artist name", () => {
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.text()).toContain("Andy Warhol")
    })

    it("shows follow button", () => {
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.text()).toContain("Follow")
    })
  })

  describe("for an artwork with no artists but a cultural maker", () => {
    beforeEach(() => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      artworkTombstoneArtwork.artists = []
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      artworkTombstoneArtwork.cultural_maker = "18th century American"
    })

    it("renders artist name", () => {
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.text()).toContain("18th century American")
    })

    it("shows follow button", () => {
      const component = mount(
        <GlobalStoreProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </GlobalStoreProvider>
      )
      expect(component.text()).not.toContain("Follow")
    })
  })
})

const artworkTombstoneArtwork: ArtworkTombstone_artwork = {
  ...ArtworkFixture,
  title: "Hello im a title",
  medium: "Painting",
  date: "1992",
  artists: [
    {
      name: "Andy Warhol",
      href: "/artist/andy-warhol",
      " $fragmentRefs": null as any,
    },
    {
      name: "Alex Katz",
      href: "/artist/alex-katz",
      " $fragmentRefs": null as any,
    },
    {
      name: "Pablo Picasso",
      href: "/artist/pablo-picasso",
      " $fragmentRefs": null as any,
    },
    {
      name: "Banksy",
      href: "/artist/banksy",
      " $fragmentRefs": null as any,
    },
    {
      name: "Barbara Kruger",
      href: "/artist/barbara-kruger",
      " $fragmentRefs": null as any,
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
  " $refType": null as any,
}

const artworkTombstoneAuctionArtwork = {
  ...artworkTombstoneArtwork,
  isInAuction: true,
  saleArtwork: {
    lotLabel: "8",
    estimate: "CHF 160,000–CHF 230,000",
  },
  partner: {
    name: "Cool Auction",
  },
  sale: {
    isClosed: false,
  },
}

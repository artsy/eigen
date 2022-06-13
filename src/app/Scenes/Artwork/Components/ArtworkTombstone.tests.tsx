import { ArtworkTombstone_artwork$data } from "__generated__/ArtworkTombstone_artwork.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { navigate } from "app/navigation/navigate"
// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { mount } from "enzyme"
import { Theme } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ArtworkTombstone } from "./ArtworkTombstone"
import { CertificateAuthenticityModal } from "./CertificateAuthenticityModal"

describe("ArtworkTombstone", () => {
  it("renders fields correctly", () => {
    const component = mount(
      <SafeAreaProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      </SafeAreaProvider>
    )
    expect(component.text()).toContain("Hello im a title, 1992")
    expect(component.text()).toContain("Painting")
    expect(component.text()).toContain("Edition 100/200")
    expect(component.text()).toContain("This work is part of a limited edition set.")
    expect(component.text()).toContain("This work includes a Certificate of Authenticity.")
    expect(component.text()).not.toContain("Lot 8")
    expect(component.text()).not.toContain("Cool Auction")
    expect(component.text()).not.toContain("Estimated value: CHF 160,000–CHF 230,000")
  })

  it("renders auction fields correctly", () => {
    const component = mount(
      <SafeAreaProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneAuctionArtwork} />
        </Theme>
      </SafeAreaProvider>
    )
    expect(component.text()).toContain("Lot 8")
    expect(component.text()).toContain("Cool Auction")
    expect(component.text()).toContain("Estimated value: CHF 160,000–CHF 230,000")
  })

  it("redirects to artist page when artist name is clicked", () => {
    const component = mount(
      <SafeAreaProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      </SafeAreaProvider>
    )
    const artistName = component.find(TouchableWithoutFeedback).at(0)
    expect(artistName.text()).toContain("Andy Warhol")
    artistName.props().onPress()
    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })

  it("redirects to attribution class faq page when attribution class is clicked", () => {
    const component = mount(
      <SafeAreaProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      </SafeAreaProvider>
    )
    const attributionClass = component.find(TouchableWithoutFeedback).at(4)
    expect(attributionClass.text()).toContain("a limited edition set")
    attributionClass.props().onPress()
    expect(navigate).toHaveBeenCalledWith("/artwork-classifications")
  })

  it("shows the authenticity modal when Certificate of Authenticity is tapped", () => {
    const component = mount(
      <SafeAreaProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      </SafeAreaProvider>
    )
    const attributionClass = component.find(TouchableWithoutFeedback).at(5)
    expect(attributionClass.text()).toContain("Certificate of Authenticity")

    expect(component.find(CertificateAuthenticityModal).props().visible).toBeFalse()
    attributionClass.props().onPress()
    component.update()
    expect(component.find(CertificateAuthenticityModal).props().visible).toBeTrue()
  })

  it("closes the authenticity modal when Certificate of Authenticity", () => {
    const component = mount(
      <SafeAreaProvider>
        <Theme>
          <ArtworkTombstone artwork={artworkTombstoneArtwork} />
        </Theme>
      </SafeAreaProvider>
    )
    const attributionClass = component.find(TouchableWithoutFeedback).at(5)
    attributionClass.props().onPress()
    component.update()
    expect(component.find(CertificateAuthenticityModal).props().visible).toBeTrue()

    component.find(CertificateAuthenticityModal).props().onClose()
    component.update()
    expect(component.find(CertificateAuthenticityModal).props().visible).toBeFalse()
  })

  describe("for a user not in the US", () => {
    it("renders dimensions in centimeters", () => {
      LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale = "fr_FR"
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
      )
      expect(component.text()).toContain("38.1 × 50.8 cm")
    })
  })

  describe("for a US based user", () => {
    it("renders dimensions in inches", () => {
      LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale = "en_US"
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
      )
      expect(component.text()).toContain("15 × 20 in")
    })
  })

  describe("for an artwork with more than 3 artists", () => {
    it("truncates artist names", () => {
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
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
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
      )
      expect(component.text()).not.toContain("Follow")
    })

    it("shows truncated artist names when 'x more' is clicked", () => {
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
      )
      const showMore = component.find(TouchableWithoutFeedback).at(3)
      expect(showMore.text()).toContain("2 more")
      showMore.props().onPress()
      expect(component.text()).not.toContain("2 more")
      expect(component.text()).toContain("Barbara Kruger")
      expect(component.text()).toContain("Banksy")
    })
  })

  describe("for an artwork in a sale with cascading end times or popcorn bidding", () => {
    const cascadingMessage = "Lots will close at 1-minute intervals."
    const popcornMessage = "Closing times may be extended due to last minute competitive bidding. "
    it("renders the notification banner with cascading message", () => {
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneCascadingEndTimesAuctionArtwork()} />
          </Theme>
        </SafeAreaProvider>
      )

      expect(component.text()).toContain(cascadingMessage)
      expect(component.text()).not.toContain(popcornMessage)
    })

    it("renders the notification banner with popcorn message", () => {
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneCascadingEndTimesAuctionArtwork(true)} />
          </Theme>
        </SafeAreaProvider>
      )

      expect(component.text()).not.toContain(cascadingMessage)
      expect(component.text()).toContain(popcornMessage)
    })
  })

  describe("for an artwork in a sale without cascading end times", () => {
    it("renders the notification banner", () => {
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneAuctionArtwork} />
          </Theme>
        </SafeAreaProvider>
      )

      expect(component.text()).not.toContain("Lots will close at 1-minute intervals.")
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
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
      )
      expect(component.text()).not.toContain("Follow")
    })

    it("doesn't truncate artist names", () => {
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
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
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
      )
      expect(component.text()).toContain("Andy Warhol")
    })

    it("shows follow button", () => {
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
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
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
      )
      expect(component.text()).toContain("18th century American")
    })

    it("shows follow button", () => {
      const component = mount(
        <SafeAreaProvider>
          <Theme>
            <ArtworkTombstone artwork={artworkTombstoneArtwork} />
          </Theme>
        </SafeAreaProvider>
      )
      expect(component.text()).not.toContain("Follow")
    })
  })
})

const artworkTombstoneArtwork: ArtworkTombstone_artwork$data = {
  ...ArtworkFixture,
  title: "Hello im a title",
  medium: "Painting",
  date: "1992",
  artists: [
    {
      name: "Andy Warhol",
      href: "/artist/andy-warhol",
      " $fragmentSpreads": null as any,
    },
    {
      name: "Alex Katz",
      href: "/artist/alex-katz",
      " $fragmentSpreads": null as any,
    },
    {
      name: "Pablo Picasso",
      href: "/artist/pablo-picasso",
      " $fragmentSpreads": null as any,
    },
    {
      name: "Banksy",
      href: "/artist/banksy",
      " $fragmentSpreads": null as any,
    },
    {
      name: "Barbara Kruger",
      href: "/artist/barbara-kruger",
      " $fragmentSpreads": null as any,
    },
  ],
  cultural_maker: null,
  dimensions: {
    in: "15 × 20 in",
    cm: "38.1 × 50.8 cm",
  },
  edition_of: "Edition 100/200",
  attributionClass: {
    shortArrayDescription: ["This work is part of", "a limited edition set"],
  },
  certificateOfAuthenticity: {
    label: "A Certificate",
    __typename: "ArtworkInfoRow",
  },
  " $fragmentType": "ArtworkTombstone_artwork",
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
    cascadingEndTimeIntervalMinutes: null,
    extendedBiddingIntervalMinutes: null,
  },
}

const artworkTombstoneCascadingEndTimesAuctionArtwork = (withextendedBidding: boolean = false) => ({
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
    cascadingEndTimeIntervalMinutes: 1,
    extendedBiddingIntervalMinutes: withextendedBidding ? 1 : null,
  },
})

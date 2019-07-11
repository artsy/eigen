import { Button, EntityHeader, Serif, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { Image } from "react-native"
import { RelayProp } from "react-relay"
import { ContextCard } from "../ContextCard"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

jest.unmock("react-relay")

describe("ContextCard", () => {
  describe("Fair context", () => {
    it("renders fair name correctly", () => {
      const component = mount(
        <Theme>
          <ContextCard relay={{ environment: {} } as RelayProp} artwork={fairContextArtwork as any} />
        </Theme>
      )
      expect(component.find(EntityHeader).length).toEqual(1)

      expect(
        component
          .find(Serif)
          .at(0)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"Market Art + Design 2019"`)
    })

    it("renders fair image", () => {
      const component = mount(
        <Theme>
          <ContextCard relay={{ environment: {} } as RelayProp} artwork={fairContextArtwork as any} />
        </Theme>
      )

      expect(component.find(Image)).toHaveLength(1)
    })
  })

  describe("Show context", () => {
    it("renders show name correctly", () => {
      const component = mount(
        <Theme>
          <ContextCard relay={{ environment: {} } as RelayProp} artwork={showContextArtwork as any} />
        </Theme>
      )
      expect(component.find(EntityHeader).length).toEqual(1)

      expect(
        component
          .find(Serif)
          .at(0)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"Time Lapse"`)
    })

    it("renders show image", () => {
      const component = mount(
        <Theme>
          <ContextCard relay={{ environment: {} } as RelayProp} artwork={showContextArtwork as any} />
        </Theme>
      )

      expect(component.find(Image)).toHaveLength(1)
    })

    it("renders show button text correctly", () => {
      const component = mount(
        <Theme>
          <ContextCard relay={{ environment: {} } as RelayProp} artwork={showContextArtwork as any} />
        </Theme>
      )
      expect(component.find(Button)).toHaveLength(1)

      expect(
        component
          .find(Button)
          .at(0)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"FollowFollowing"`)
    })
  })

  describe("Auction context", () => {
    it("renders show name correctly", () => {
      const component = mount(
        <Theme>
          <ContextCard relay={{ environment: {} } as RelayProp} artwork={auctionContextArtwork as any} />
        </Theme>
      )
      expect(component.find(EntityHeader).length).toEqual(1)

      expect(
        component
          .find(Serif)
          .at(0)
          .render()
          .text()
      ).toMatchInlineSnapshot(`"Christie’s: Prints & Multiples"`)
    })

    it("renders show image", () => {
      const component = mount(
        <Theme>
          <ContextCard relay={{ environment: {} } as RelayProp} artwork={auctionContextArtwork as any} />
        </Theme>
      )

      expect(component.find(Image)).toHaveLength(1)
    })
  })
})

const fairContextArtwork = {
  id: "QXJ0d29yazpjYW5kaWNlLWNtYy1zdXBlcm1hbi1kb251dHMtMQ==",
  gravityID: "candice-cmc-superman-donuts-1",
  internalID: "5d0a7485fc1f78001248b677",
  context: {
    __typename: "ArtworkContextFair",
    id: "QXJ0d29ya0NvbnRleHRGYWlyOm1hcmtldC1hcnQtcGx1cy1kZXNpZ24tMjAxOQ==",
    name: "Market Art + Design 2019",
    href: "/market-art-plus-design-2019",
    exhibition_period: "Jul 5 – 7",
    image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/R5z4lkyH6DyGhEwAg44NSA/wide.jpg",
    },
  },
  shows: [
    {
      id: "U2hvdzphcmR0LWdhbGxlcnktYXJkdC1nYWxsZXJ5LWF0LW1hcmtldC1hcnQtcGx1cy1kZXNpZ24tMjAxOQ==",
      name: "ARDT Gallery at Market Art + Design 2019",
      href: "/show/ardt-gallery-ardt-gallery-at-market-art-plus-design-2019",
      gravityID: "ardt-gallery-ardt-gallery-at-market-art-plus-design-2019",
      internalID: "5cf574b16378630006d32d96",
      exhibition_period: "Jul 5 – 7",
      is_followed: null,
      cover_image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/Xe5AEfsGGvtlRILk8PFR_g/tall.jpg",
      },
    },
  ],
  " $refType": null,
  " $fragmentRefs": null,
}

const auctionContextArtwork = {
  id: "QXJ0d29yazphbmR5LXdhcmhvbC1tYW8tb25lLXBsYXRlLTM=",
  gravityID: "andy-warhol-mao-one-plate-3",
  internalID: "5bc13101c8d4326cc288ecb8",
  context: {
    __typename: "ArtworkContextAuction",
    id: "QXJ0d29ya0NvbnRleHRBdWN0aW9uOmNocmlzdGllcy1wcmludHMtYW5kLW11bHRpcGxlcy02",
    name: "Christie’s: Prints & Multiples",
    href: "/auction/christies-prints-and-multiples-6",
    formattedStartDateTime: "Ended Oct 25, 2018",
    cover_image: {
      url: "https://d32dm0rphc51dk.cloudfront.net/bMu0vqXOVlpABBsWVxVIJA/large_rectangle.jpg",
    },
  },
  shows: [],
  fair: null,
  " $refType": null,
  " $fragmentRefs": null,
}

const showContextArtwork = {
  id: "QXJ0d29yazphYmJhcy1raWFyb3N0YW1pLXVudGl0bGVkLTc=",
  gravityID: "abbas-kiarostami-untitled-7",
  internalID: "5b2b745e9c18db204fc32e11",
  context: {
    __typename: "ArtworkContextPartnerShow",
  },
  shows: [
    {
      id: "U2hvdzpjYW1hLWdhbGxlcnktMS10aW1lLWxhcHNl",
      name: "Time Lapse",
      href: "/show/cama-gallery-1-time-lapse",
      gravityID: "cama-gallery-1-time-lapse",
      internalID: "5b335e329c18db4a5a5015cc",
      exhibition_period: "Jun 22 – Jul 3, 2018",
      is_followed: null,
      cover_image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/MYRUdCdCDdpU9dLTcmDX0A/medium.jpg",
      },
    },
  ],
  fair: null,
  " $refType": null,
  " $fragmentRefs": null,
}

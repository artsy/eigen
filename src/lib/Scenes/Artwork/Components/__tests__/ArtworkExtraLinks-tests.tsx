import { Sans, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import { ArtworkFixture } from "lib/__fixtures__/ArtworkFixture"
import React from "react"
import { Text } from "react-native"
import { ArtworkExtraLinks } from "../ArtworkExtraLinks"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

import SwitchBoard from "lib/NativeModules/SwitchBoard"

describe("ArtworkExtraLinks", () => {
  it("redirects to consignments flow when consignments link is clicked", () => {
    const artwork = {
      ...ArtworkFixture,
      artists: [
        {
          name: "Santa",
          isConsignable: true,
        },
      ],
    }
    const component = mount(
      <Theme>
        <ArtworkExtraLinks artwork={artwork} />
      </Theme>
    )
    const consignmentsLink = component.find(Text).at(1)
    const texts = component.find(Sans).map(x => x.text())

    expect(texts[0]).toContain("Consign with Artsy.")
    consignmentsLink.props().onPress()
    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "/consign/submission")
  })

  describe("for an artwork with more than 1 consignable artist", () => {
    it("shows plural link text", () => {
      const artwork = {
        ...ArtworkFixture,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
          {
            name: "Easter Bunny",
            isConsignable: true,
          },
        ],
      }
      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} />
        </Theme>
      )
      expect(component.text()).toContain("Want to sell a work by these artists?")
    })
    it("shows consign link if at least 1 artist is consignable", () => {
      const artwork = {
        ...ArtworkFixture,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} />
        </Theme>
      )
      expect(component.text()).toContain("Consign with Artsy.")
    })
    it("doesn't render component if no artists are consignable", () => {
      const artwork = {
        ...ArtworkFixture,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }
      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} />
        </Theme>
      )
      expect(component).toEqual({})
    })
  })

  describe("for an artwork with one artist", () => {
    it("shows singular link text", () => {
      const artwork = {
        ...ArtworkFixture,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }
      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} />
        </Theme>
      )
      expect(component.text()).toContain("Want to sell a work by Santa?")
    })

    it("shows consign link", () => {
      const artwork = {
        ...ArtworkFixture,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }
      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} />
        </Theme>
      )
      expect(component.text()).toContain("Consign with Artsy.")
    })
  })
  describe("FAQ and specialist BNMO links", () => {
    it("renders FAQ link when isInquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: false,
        isInquireable: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} />
        </Theme>
      )
      expect(component.text()).toContain("Read our FAQ")
      expect(component.text()).not.toContain("ask a specialist")
    })

    it("renders ask a specialist link when isAcquireable", () => {
      const artwork = {
        ...ArtworkFixture,
        isAcquireable: true,
        isInquireable: true,
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} />
        </Theme>
      )
      expect(component.text()).toContain("Read our FAQ")
      expect(component.text()).toContain("ask a specialist")
    })
  })
  describe("FAQ and specialist Auction links", () => {
    it("renders Auction specific text", () => {
      const artwork = {
        ...ArtworkFixture,
        isInAuction: true,
        sale: {
          isClosed: false,
        },
        artists: [
          {
            name: "Santa",
            isConsignable: true,
          },
        ],
      }

      const component = mount(
        <Theme>
          <ArtworkExtraLinks artwork={artwork} />
        </Theme>
      )
      expect(
        component
          .find(Sans)
          .at(0)
          .text()
      ).toContain("By placing a bid you agree to Artsy's Conditions of Sale.")
      expect(
        component
          .find(Sans)
          .at(1)
          .text()
      ).toContain("Read our auction FAQs")
      expect(
        component
          .find(Sans)
          .at(1)
          .text()
      ).toContain("ask a specialist")
    })
  })
})

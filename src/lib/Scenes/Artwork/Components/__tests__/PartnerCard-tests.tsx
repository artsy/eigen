import { Sans, Serif, Theme } from "@artsy/palette"
import { mount } from "enzyme"
import InvertedButton from "lib/Components/Buttons/InvertedButton"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { Image } from "react-native"
import { graphql, RelayProp } from "react-relay"
import { PartnerCard, PartnerCardFragmentContainer } from "../PartnerCard"

jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

jest.unmock("react-relay")

describe("PartnerCard", () => {
  it("renders partner name correctly", () => {
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
      </Theme>
    )
    expect(component.find(InvertedButton).length).toEqual(1)

    expect(
      component
        .find(Serif)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Test Gallery"`)
  })

  it("renders partner image", () => {
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
      </Theme>
    )

    expect(component.find(Image)).toHaveLength(1)
  })

  it("renders partner initials when no image is present", () => {
    const PartnerCardArtworkWithoutImage = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner,
        profile: null,
      },
    }
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtworkWithoutImage} />
      </Theme>
    )

    expect(component.find(Image)).toHaveLength(0)
    expect(
      component
        .find(Serif)
        .at(0)
        .text()
    ).toMatchInlineSnapshot(`"TG"`)
  })
  it("truncates partner locations correctly", () => {
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
      </Theme>
    )
    expect(component.find(InvertedButton).length).toEqual(1)

    expect(
      component
        .find(Sans)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Miami, New York, +3 more"`)
  })
  it("renders button text correctly", () => {
    const component = mount(
      <Theme>
        <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
      </Theme>
    )
    expect(component.find(InvertedButton).length).toEqual(1)

    expect(
      component
        .find(InvertedButton)
        .at(0)
        .render()
        .text()
    ).toMatchInlineSnapshot(`"Follow"`)
  })

  describe("Following a partner", () => {
    const getWrapper = async ({ mockArtworkData, mockFollowResults }) => {
      return await renderRelayTree({
        Component: (props: any) => (
          <Theme>
            <PartnerCardFragmentContainer {...props} />
          </Theme>
        ),
        query: graphql`
          query PartnerCardTestsQuery {
            artwork(id: "artworkID") {
              ...PartnerCard_artwork
            }
          }
        `,
        mockData: { artwork: mockArtworkData },
        mockMutationResults: { followProfile: mockFollowResults },
      })
    }

    it("correctly displays when the artist is already followed, and allows unfollowing", async () => {
      const PartnerCardArtworkFollowed = {
        ...PartnerCardArtwork,
        partner: {
          ...PartnerCardArtwork.partner,
          profile: {
            ...PartnerCardArtwork.partner.profile,
            is_followed: true,
          },
        },
      }

      const unfollowResponse = {
        profile: {
          is_followed: false,
          gravityID: PartnerCardArtwork.partner.gravityID,
          internalID: PartnerCardArtwork.partner.internalID,
        },
      }

      const partnerCard = await getWrapper({
        mockArtworkData: PartnerCardArtworkFollowed,
        mockFollowResults: unfollowResponse,
      })

      const followButton = partnerCard.find(InvertedButton).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Following"`)

      await partnerCard
        .find(InvertedButton)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      partnerCard.update()

      const updatedFollowButton = partnerCard.find(InvertedButton).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
    })

    it("correctly displays when the work is not followed, and allows following", async () => {
      const followResponse = {
        profile: {
          is_followed: true,
          gravityID: PartnerCardArtwork.partner.gravityID,
          internalID: PartnerCardArtwork.partner.internalID,
        },
      }
      const partnerCard = await getWrapper({
        mockArtworkData: PartnerCardArtwork,
        mockFollowResults: followResponse,
      })

      const followButton = partnerCard.find(InvertedButton).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)

      await partnerCard
        .find(InvertedButton)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      partnerCard.update()

      const updatedFollowButton = partnerCard.find(InvertedButton).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Following"`)
    })

    // TODO Update once we can use relay's new facilities for testing
    xit("handles errors in saving gracefully", async () => {
      const partnerCard = await renderRelayTree({
        Component: PartnerCardFragmentContainer,
        query: graphql`
          query PartnerCardTestsErrorQuery {
            artwork(id: "artworkID") {
              ...PartnerCard_artwork
            }
          }
        `,
        mockData: { artwork: PartnerCardArtwork },
        mockMutationResults: {
          PartnerCardFragmentContainer: () => {
            return Promise.reject(new Error("failed to fetch"))
          },
        },
      })

      const followButton = partnerCard.find(InvertedButton).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)

      await partnerCard
        .find(InvertedButton)
        .at(0)
        .props()
        .onPress()

      await flushPromiseQueue()
      partnerCard.update()

      const updatedFollowButton = partnerCard.find(InvertedButton).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
    })
  })
})

const PartnerCardArtwork = {
  sale: {
    isBenefit: false,
    isGalleryAuction: false,
  },
  partner: {
    is_default_profile_public: true,
    type: "Gallery",
    name: "Test Gallery",
    gravityID: "12345",
    internalID: "56789",
    id: "12345",
    href: "",
    initials: "TG",
    profile: {
      internalID: "56789",
      gravityID: "12345",
      is_followed: false,
      icon: {
        url: "https://d32dm0rphc51dk.cloudfront.net/YciR5levjrhp2JnFYlPxpw/square140.png",
      },
    },
    locations: [
      {
        city: "Miami",
      },
      {
        city: "New York",
      },
      {
        city: "Hong Kong",
      },
      {
        city: "London",
      },
      {
        city: "Boston",
      },
    ],
    " $refType": null,
    " $fragmentRefs": null,
  },
  " $refType": null,
  " $fragmentRefs": null,
}

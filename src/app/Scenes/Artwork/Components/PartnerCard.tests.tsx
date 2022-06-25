import { PartnerCard_artwork$data } from "__generated__/PartnerCard_artwork.graphql"
import { PartnerCardTestsQuery$data } from "__generated__/PartnerCardTestsQuery.graphql"
import { GlobalStoreProvider } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderRelayTree } from "app/tests/renderRelayTree"
// @ts-ignore
import { mount } from "enzyme"
import { Button, Sans, Theme } from "palette"
import React from "react"
import { Image } from "react-native"
import { graphql, RelayProp } from "react-relay"
import { PartnerCard, PartnerCardFragmentContainer } from "./PartnerCard"

jest.unmock("react-relay")

describe("PartnerCard", () => {
  it("renders partner name correctly", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(Button).length).toEqual(1)

    expect(component.text()).toContain(`Test Gallery`)
  })

  it("renders partner image", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(component.find(Image)).toHaveLength(1)
  })

  it("renders partner type", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(component.find(Sans).at(0).text()).toMatchInlineSnapshot(`"At gallery"`)
  })

  it("renders partner type correctly for institutional sellers", () => {
    const PartnerCardArtworkInstitutionalSeller = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Institutional Seller",
      },
    }
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard
            relay={{ environment: {} } as RelayProp}
            artwork={PartnerCardArtworkInstitutionalSeller}
          />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(component.find(Sans).at(0).text()).toMatchInlineSnapshot(`"At institution"`)
  })

  it("doesn't render partner type for partners that aren't institutions or galleries", () => {
    const PartnerCardArtworkOtherType = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Some Other Partner Type",
      },
    }
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard
            relay={{ environment: {} } as RelayProp}
            artwork={PartnerCardArtworkOtherType}
          />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(component.find(Sans).at(0).text()).not.toEqual("At institution")
    expect(component.find(Sans).at(0).text()).not.toEqual("At gallery")
  })

  it("renders partner initials when no image is present", () => {
    const PartnerCardArtworkWithoutImage = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        profile: null,
      },
    }
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard
            relay={{ environment: {} } as RelayProp}
            artwork={PartnerCardArtworkWithoutImage}
          />
        </Theme>
      </GlobalStoreProvider>
    )

    expect(component.find(Image)).toHaveLength(0)
    expect(component.text()).toContain(`TG`)
  })
  it("truncates partner locations correctly", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(Button).length).toEqual(1)

    expect(component.text()).toContain(`Miami, New York, +3 more`)
  })

  it("renders button text correctly", () => {
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard relay={{ environment: {} } as RelayProp} artwork={PartnerCardArtwork} />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(Button)).toHaveLength(1)

    expect(component.find(Button).at(0).render().text()).toMatchInlineSnapshot(`"Follow"`)
  })

  it("does not render when the partner is an auction house", () => {
    const PartnerCardArtworkAuctionHouse: PartnerCard_artwork$data = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Auction House",
      },
    }
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard
            relay={{ environment: {} } as RelayProp}
            artwork={PartnerCardArtworkAuctionHouse}
          />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.html()).toBe(null)
  })

  it("does not render when the artwork is in a benefit or gallery auction", () => {
    const PartnerCardArtworkAuction = {
      ...PartnerCardArtwork,
      sale: {
        isBenefit: true,
        isGalleryAuction: true,
      },
    }
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard
            relay={{ environment: {} } as RelayProp}
            artwork={PartnerCardArtworkAuction}
          />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.html()).toBe(null)
  })

  it("does not render follow button when the partner has no profile info", () => {
    const PartnerCardArtworkNoProfile = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        profile: null,
      },
    }
    const component = mount(
      <GlobalStoreProvider>
        <Theme>
          <PartnerCard
            relay={{ environment: {} } as RelayProp}
            artwork={PartnerCardArtworkNoProfile}
          />
        </Theme>
      </GlobalStoreProvider>
    )
    expect(component.find(Button)).toHaveLength(0)
  })

  describe("Following a partner", () => {
    const getWrapper = async ({ mockArtworkData, mockFollowResults }: any) => {
      return await renderRelayTree({
        Component: (props: any) => (
          <GlobalStoreProvider>
            <Theme>
              <PartnerCardFragmentContainer {...props} />
            </Theme>
          </GlobalStoreProvider>
        ),
        query: graphql`
          query PartnerCardTestsQuery @raw_response_type {
            artwork(id: "artworkID") {
              ...PartnerCard_artwork
            }
          }
        `,
        mockData: { artwork: mockArtworkData } as PartnerCardTestsQuery$data,
        mockMutationResults: { followProfile: mockFollowResults },
      })
    }

    it("correctly displays when the artist is already followed, and allows unfollowing", async () => {
      const PartnerCardArtworkFollowed = {
        ...PartnerCardArtwork,
        partner: {
          ...PartnerCardArtwork.partner,
          profile: {
            ...PartnerCardArtwork.partner!.profile,
            is_followed: true,
          },
        },
      }

      const unfollowResponse = {
        profile: {
          is_followed: false,
          slug: PartnerCardArtwork.partner!.slug,
          internalID: PartnerCardArtwork.partner!.profile!.internalID,
        },
      }

      const partnerCard = await getWrapper({
        mockArtworkData: PartnerCardArtworkFollowed,
        mockFollowResults: unfollowResponse,
      })

      const followButton = partnerCard.find(Button)
      expect(followButton.text()).toMatchInlineSnapshot(`"Following"`)

      await partnerCard.find(Button).at(0).props().onPress()

      await flushPromiseQueue()
      partnerCard.update()

      const updatedFollowButton = partnerCard.find(Button).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
    })

    it("correctly displays when the work is not followed, and allows following", async () => {
      const followResponse = {
        profile: {
          is_followed: true,
          slug: PartnerCardArtwork.partner!.slug,
          internalID: PartnerCardArtwork.partner!.profile!.internalID,
        },
      }
      const partnerCard = await getWrapper({
        mockArtworkData: PartnerCardArtwork,
        mockFollowResults: followResponse,
      })

      const followButton = partnerCard.find(Button).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)

      await partnerCard.find(Button).at(0).props().onPress()

      await flushPromiseQueue()
      partnerCard.update()

      const updatedFollowButton = partnerCard.find(Button).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Following"`)
    })

    // TODO Update once we can use relay's new facilities for testing
    xit("handles errors in saving gracefully", async () => {
      const partnerCard = await renderRelayTree({
        Component: PartnerCardFragmentContainer,
        query: graphql`
          query PartnerCardTestsErrorQuery @raw_response_type {
            artwork(id: "artworkID") {
              ...PartnerCard_artwork
            }
          }
        `,
        mockData: { artwork: PartnerCardArtwork }, // Enable/fix this when making large change to these components/fixtures: as PartnerCardTestsErrorQuery,
        mockMutationResults: {
          PartnerCardFragmentContainer: () => {
            return Promise.reject(new Error("failed to fetch"))
          },
        },
      })

      const followButton = partnerCard.find(Button).at(0)
      expect(followButton.text()).toMatchInlineSnapshot(`"Follow"`)

      await partnerCard.find(Button).at(0).props().onPress()

      await flushPromiseQueue()
      partnerCard.update()

      const updatedFollowButton = partnerCard.find(Button).at(0)
      expect(updatedFollowButton.text()).toMatchInlineSnapshot(`"Follow"`)
    })
  })
})

const PartnerCardArtwork: PartnerCard_artwork$data = {
  sale: {
    isBenefit: false,
    isGalleryAuction: false,
  },
  partner: {
    is_default_profile_public: true,
    type: "Gallery",
    name: "Test Gallery",
    slug: "12345",
    id: "12345",
    href: "",
    initials: "TG",
    profile: {
      id: "12345",
      internalID: "56789",
      is_followed: false,
      icon: {
        url: "https://d32dm0rphc51dk.cloudfront.net/YciR5levjrhp2JnFYlPxpw/square140.webp",
      },
    },
    cities: ["Miami", "New York", "Hong Kong", "London", "Boston"],
  },
  " $fragmentType": "PartnerCard_artwork",
}

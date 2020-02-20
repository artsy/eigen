import { Button, Serif, Theme } from "@artsy/palette"
import { PartnerHeader_partner } from "__generated__/PartnerHeader_partner.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { PartnerHeaderContainer as PartnerHeader, TextWrapper } from "../PartnerHeader"

jest.unmock("react-relay")

describe("PartnerHeader", () => {
  const getWrapper = async (partner: Omit<PartnerHeader_partner, " $fragmentRefs">) =>
    await renderRelayTree({
      Component: (props: any) => {
        return (
          <Theme>
            <PartnerHeader partner={{ ...partner }} {...props} />
          </Theme>
        )
      },
      query: graphql`
        query PartnerHeaderTestsQuery @raw_response_type {
          partner(id: "gagosian") {
            name
            profile {
              counts {
                follows
              }
            }
            counts {
              eligibleArtworks
            }
            ...PartnerFollowButton_partner
          }
        }
      `,
      mockData: {
        partner,
      },
    })

  it("renders the followers and artwork counts", async () => {
    const wrapper = await getWrapper(PartnerHeaderFixture)

    expect(wrapper.find(TextWrapper).text()).toContain("1,231 Works for sale  •  136,999 Followers")
  })

  it("renders the partner name", async () => {
    const wrapper = await getWrapper(PartnerHeaderFixture)

    expect(
      wrapper
        .find(Serif)
        .at(0)
        .text()
    ).toContain("Gagosian")
  })

  it("renders the follow button", async () => {
    const wrapper = await getWrapper(PartnerHeaderFixture)

    expect(wrapper.find(Button).text()).toContain("Follow")
  })
})

const PartnerHeaderFixture = {
  " $refType": null,
  name: "Gagosian",
  counts: {
    eligibleArtworks: 1231,
  },
  profile: {
    counts: {
      follows: 136999,
    },
    id: "UHJvZmlsZTo1MTU5ZGE2MjlhNjA4MzI0MzkwMDAwMzU=",
    internalID: "5159da629a60832439000035",
    isFollowed: false,
  },
  internalID: "4d8b92c44eb68a1b2c0004cb",
  slug: "gagosian",
}

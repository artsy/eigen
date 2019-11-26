import { Serif, Theme } from "@artsy/palette"
import { PartnerOverview_partner } from "__generated__/PartnerOverview_partner.graphql"
import { ArtistListItem } from "lib/Components/ArtistListItem"
import { ReadMore } from "lib/Components/ReadMore"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import Animated from "react-native-reanimated"
import { graphql, RelayPaginationProp } from "react-relay"
import { PartnerOverviewFragmentContainer as PartnerOverview } from "../PartnerOverview"

jest.unmock("react-relay")

const PartnerOverviewFixture = {
  internalID: "4d8b92c44eb68a1b2c0004cb",
  name: "Gagosian",
  cities: [],
  profile: {
    bio: "",
  },
  counts: {
    artists: 3,
  },
  artists: {
    edges: [],
  },
  locations: null,
  " $fragmentRefs": null as any,
  " $refType": null as any,
}

describe("PartnerOverview", () => {
  const getWrapper = async (partner: Omit<PartnerOverview_partner, " $fragmentRefs">) =>
    await renderRelayTree({
      Component: (props: any) => {
        return (
          <Theme>
            <PartnerOverview partner={{ ...partner }} relay={{ environment: {} } as RelayPaginationProp} {...props} />
          </Theme>
        )
      },
      query: graphql`
        query PartnerOverviewTestsQuery @raw_response_type {
          partner(id: "gagosian") {
            internalID
            name
            cities
            profile {
              bio
            }
            artists: artistsConnection(first: 10) {
              edges {
                node {
                  id
                  ...ArtistListItem_artist
                }
              }
            }

            ...PartnerLocationSection_partner
          }
        }
      `,
      mockData: {
        partner,
      },
    })

  it("renders the artists correctly", async () => {
    const partnerWithArtists = {
      ...PartnerOverviewFixture,
      artists: {
        edges: artists,
      },
    }
    const wrapper = await getWrapper(partnerWithArtists as any)
    const lists = wrapper.find(ArtistListItem)
    expect(lists.length).toBe(3)
  })

  it("renders the ReadMore component correctly", async () => {
    const partnerWithBio = {
      ...PartnerOverviewFixture,
      profile: {
        bio: "Nullam quis risus eget urna mollis ornare vel eu leo.",
      },
    }
    const wrapper = await getWrapper(partnerWithBio as any)
    expect(
      wrapper
        .find(ReadMore)
        .find(Serif)
        .text()
    ).toContain("Nullam quis risus")
  })

  it("renders the location text correctly", async () => {
    const partnerWithBio = {
      ...PartnerOverviewFixture,
      profile: {
        bio: "Nullam quis risus eget urna mollis ornare vel eu leo.",
      },
    }
    const wrapper = await getWrapper(partnerWithBio as any)
    expect(
      wrapper
        .find(ReadMore)
        .find(Serif)
        .text()
    ).toContain("Nullam quis risus")
  })
})

const artists = [
  {
    node: {
      id: "QXJ0aXN0OjU4NDU4ZDA2NzYyMmRkNjQ1YjAwMTA1OQ==",
      internalID: "58458d067622dd645b001059",
      slug: "virgil-abloh",
      name: "Virgil Abloh",
      initials: "VA",
      href: "/artist/virgil-abloh",
      is_followed: false,
      nationality: "",
      birthday: "",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/2F1eek-V9kqSdO54UfrXxw/tall.jpg",
      },
    },
  },
  {
    node: {
      id: "QXJ0aXN0OjU4M2UwNGIwYjIwMmEzNjQ2NzAwMDVhYg==",
      internalID: "583e04b0b202a364670005ab",
      slug: "alex-israel-and-bret-easton-ellis",
      name: "Alex Israel and Bret Easton Ellis",
      initials: "AIB",
      href: "/artist/alex-israel-and-bret-easton-ellis",
      is_followed: false,
      nationality: "",
      birthday: "",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/qTK2prqgaHpnydY8aCPJ8w/square.jpg",
      },
    },
  },
  {
    node: {
      id: "QXJ0aXN0OjRmMDY0ODMxODUwMWZhMTBjYTAwMDAxMA==",
      internalID: "4f0648318501fa10ca000010",
      slug: "william-anastasi",
      name: "William Anastasi",
      initials: "WA",
      href: "/artist/william-anastasi",
      is_followed: false,
      nationality: "American",
      birthday: "1933",
      deathday: "",
      image: {
        url: "https://d32dm0rphc51dk.cloudfront.net/1cUF7xHvhU9_R1ucmSRoPg/tall.jpg",
      },
    },
  },
]

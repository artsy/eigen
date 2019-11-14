import { Theme } from "@artsy/palette"
import { PartnerShows_partner } from "__generated__/PartnerShows_partner.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql, RelayPaginationProp } from "react-relay"
import { PartnerShowRailItem as RailItem } from "../PartnerShowRailItem"
import { PartnerShowsFragmentContainer as PartnerShows } from "../PartnerShows"

jest.unmock("react-relay")

describe("PartnerShows", () => {
  const getWrapper = async (partner: Omit<PartnerShows_partner, " $fragmentRefs">) =>
    await renderRelayTree({
      Component: (props: any) => {
        return (
          <Theme>
            <PartnerShows partner={{ ...partner }} {...props} relay={{ environment: {} } as RelayPaginationProp} />
          </Theme>
        )
      },
      query: graphql`
        query PartnerShowsTestsQuery @raw_response_type {
          partner(id: "gagosian") {
            slug
            internalID
            currentAndUpcomingShows: showsConnection(status: CURRENT, first: 10) {
              edges {
                node {
                  id
                  internalID
                  slug
                  name
                  exhibitionPeriod
                  endAt
                  images {
                    url
                  }
                  ...PartnerShowRailItem_show
                }
              }
            }
            pastShows: showsConnection(status: CLOSED, first: 10) {
              edges {
                node {
                  id
                  name
                  slug
                  exhibitionPeriod
                  coverImage {
                    url
                    aspectRatio
                  }
                  href
                  exhibitionPeriod
                }
              }
            }
          }
        }
      `,
      mockData: {
        partner,
      },
    })

  it("renders the shows correctly", async () => {
    const wrapper = await getWrapper(PartnerShowsFixture as any)
    const railItems = wrapper.find(RailItem)
    const gridItems = wrapper.find("GridItem")

    expect(railItems.length).toBe(3)
    expect(gridItems.length).toBe(4)
  })
})

const PartnerShowsFixture = {
  slug: "gagosian",
  internalID: "4d8b92c44eb68a1b2c0004cb",
  currentAndUpcomingShows: {
    edges: [
      {
        node: {
          id: "U2hvdzo1ZDY0MjBjZjJhNDFlNDAwMGYxYzAzYTE=",
          internalID: "5d6420cf2a41e4000f1c03a1",
          slug: "gagosian-richard-serra-triptychs-and-diptychs",
          name: "Richard Serra: Triptychs and Diptychs",
          exhibitionPeriod: "Sep 16 – Nov 2",
          endAt: "2019-11-02T12:00:00+00:00",
          images: [],
        },
      },
      {
        node: {
          id: "U2hvdzo1ZDY0MWJmMjAzNDliYTAwMTAxMzM4NmQ=",
          internalID: "5d641bf20349ba001013386d",
          slug: "gagosian-giuseppe-penone-foglie-di-bronzo-slash-leaves-of-bronze",
          name: "Giuseppe Penone: Foglie di bronzo / Leaves of Bronze",
          exhibitionPeriod: "Sep 12 – Nov 9",
          endAt: "2019-11-09T12:00:00+00:00",
          images: [
            {
              url: "https://d32dm0rphc51dk.cloudfront.net/zhjrZ8ys2AIjZK5e_kj9qw/tall.jpg",
            },
          ],
        },
      },
      {
        node: {
          id: "U2hvdzo1ZDY0MjAwODEyZDI5MDAwMGUxZTVkMzU=",
          internalID: "5d64200812d290000e1e5d35",
          slug: "gagosian-albert-oehlen-new-paintings",
          name: "Albert Oehlen: New Paintings",
          exhibitionPeriod: "Sep 12 – Nov 9",
          endAt: "2019-11-09T12:00:00+00:00",
          images: [
            {
              url: "https://d32dm0rphc51dk.cloudfront.net/5pyq3gwxGzK6Owea_DIxmw/larger.jpg",
            },
          ],
        },
      },
    ],
  },
  pastShows: {
    edges: [
      {
        node: {
          id: "U2hvdzo1ZDY0MTg0ZTlhZjkwYTAwMGVjMGJiMDk=",
          name: "Zao Wou-Ki",
          slug: "gagosian-zao-wou-ki",
          exhibitionPeriod: "Sep 9 – Oct 26",
          coverImage: {
            url: "https://d32dm0rphc51dk.cloudfront.net/kuIfJgJWWp-XZmLzMGXduA/medium.jpg",
            aspectRatio: 1,
          },
          href: null,
        },
      },
      {
        node: {
          id: "U2hvdzo1ZDY0MGRlMjlhZjkwYTAwMTI3YmQzZjU=",
          name: "Domestic Horror",
          slug: "gagosian-domestic-horror",
          exhibitionPeriod: "Sep 5 – Oct 19",
          coverImage: {
            url: "https://d32dm0rphc51dk.cloudfront.net/OM4k-1Z4QcssqZEbNVtIJQ/medium.jpg",
            aspectRatio: 1,
          },
          href: "/show/gagosian-domestic-horror",
        },
      },
      {
        node: {
          id: "U2hvdzo1ZDY0MTlmYjE5NmUxMDAwMGRmMWRkY2E=",
          name: "Nathaniel Mary Quinn: Hollow and Cut",
          slug: "gagosian-nathaniel-mary-quinn-hollow-and-cut",
          exhibitionPeriod: "Sep 11 – Oct 19",
          coverImage: {
            url: "https://d32dm0rphc51dk.cloudfront.net/XclQaO8u9hFn3FW1g7lu4Q/medium.jpg",
            aspectRatio: 1,
          },
          href: "/show/gagosian-nathaniel-mary-quinn-hollow-and-cut",
        },
      },
      {
        node: {
          id: "U2hvdzo1ZDk0YjkxZDIzNDU1YTAwMGU0NjZlMTM=",
          name: "Frieze London 2019: Sterling Ruby Online Viewing Room",
          slug: "gagosian-frieze-london-2019-sterling-ruby-online-viewing-room",
          exhibitionPeriod: "Sep 28 – Oct 7",
          coverImage: {
            url: "https://d32dm0rphc51dk.cloudfront.net/PCLKVUctWQauak6cD_K80w/tall.jpg",
            aspectRatio: 1,
          },
          href: "/show/gagosian-frieze-london-2019-sterling-ruby-online-viewing-room",
        },
      },
    ],
  },
  " $fragmentRefs": null as any,
  " $refType": null as any,
}

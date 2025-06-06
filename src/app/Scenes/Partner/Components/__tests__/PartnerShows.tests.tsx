import { screen } from "@testing-library/react-native"
import { PartnerShowsTestsQuery } from "__generated__/PartnerShowsTestsQuery.graphql"
import { PartnerShowsFragmentContainer as PartnerShows } from "app/Scenes/Partner/Components/PartnerShows"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { cloneDeep } from "lodash"
import { graphql } from "react-relay"

describe("PartnerShows", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerShowsTestsQuery>({
    Component: (props) => {
      if (!props?.partner) {
        return null
      }
      return <PartnerShows partner={props.partner} />
    },
    query: graphql`
      query PartnerShowsTestsQuery @raw_response_type {
        partner(id: "gagosian") {
          ...PartnerShows_partner
        }
      }
    `,
  })

  it("renders the shows correctly", () => {
    renderWithRelay({
      Partner: () => PartnerShowsFixture,
    })

    // Current and upcoming shows
    expect(screen.getByText("Richard Serra: Triptychs and Diptychs")).toBeTruthy()
    expect(screen.getByText("Giuseppe Penone: Foglie di bronzo / Leaves of Bronze")).toBeTruthy()
    expect(screen.getByText("Albert Oehlen: New Paintings")).toBeTruthy()

    // Past shows
    expect(screen.getByText("Zao Wou-Ki")).toBeTruthy()
    expect(screen.getByText("Domestic Horror")).toBeTruthy()
    expect(screen.getByText("Nathaniel Mary Quinn: Hollow and Cut")).toBeTruthy()
    expect(screen.getByText("Frieze London 2019: Sterling Ruby Online Viewing Room")).toBeTruthy()
  })

  it("doesn't show non-displayable", () => {
    const fixture = cloneDeep(PartnerShowsFixture)
    // @ts-ignore
    fixture.pastShows.edges[0].node.isDisplayable = false
    // @ts-ignore
    fixture.currentAndUpcomingShows.edges[0].node.isDisplayable = false

    renderWithRelay({
      Partner: () => fixture,
    })

    // Current and upcoming shows
    expect(screen.queryByText("Richard Serra: Triptychs and Diptychs")).toBeFalsy()
    expect(screen.getByText("Giuseppe Penone: Foglie di bronzo / Leaves of Bronze")).toBeTruthy()
    expect(screen.getByText("Albert Oehlen: New Paintings")).toBeTruthy()

    // Past shows
    expect(screen.queryByText("Zao Wou-Ki")).toBeFalsy()
    expect(screen.getByText("Domestic Horror")).toBeTruthy()
    expect(screen.getByText("Nathaniel Mary Quinn: Hollow and Cut")).toBeTruthy()
    expect(screen.getByText("Frieze London 2019: Sterling Ruby Online Viewing Room")).toBeTruthy()
  })
})

const PartnerShowsFixture: PartnerShowsTestsQuery["rawResponse"]["partner"] = {
  id: "gagosian-id",
  slug: "gagosian",
  internalID: "4d8b92c44eb68a1b2c0004cb",
  recentShows: {
    edges: [{ node: { id: "ye", isDisplayable: true } }],
  },
  currentAndUpcomingShows: {
    pageInfo: {
      hasNextPage: true,
      endCursor: "end",
      startCursor: "start",
    },
    edges: [
      {
        cursor: "a",
        node: {
          __typename: "Show",
          isDisplayable: true,
          partner: null,
          id: "U2hvdzo1ZDY0MjBjZjJhNDFlNDAwMGYxYzAzYTE=",
          internalID: "5d6420cf2a41e4000f1c03a1",
          slug: "gagosian-richard-serra-triptychs-and-diptychs",
          name: "Richard Serra: Triptychs and Diptychs",
          exhibitionPeriod: "Sep 16 – Nov 2",
          endAt: "2019-11-02T12:00:00+00:00",
          images: [],
          coverImage: null,
        },
      },
      {
        cursor: "b",
        node: {
          __typename: "Show",
          isDisplayable: true,
          partner: null,
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
          coverImage: {
            url: "https://d32dm0rphc51dk.cloudfront.net/5pyq3gwxGzK6Owea_DIxmw/larger.jpg",
            blurhash: null,
          },
        },
      },
      {
        cursor: "c",
        node: {
          __typename: "Show",
          isDisplayable: true,
          partner: null,
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
          coverImage: {
            url: "https://d32dm0rphc51dk.cloudfront.net/5pyq3gwxGzK6Owea_DIxmw/larger.jpg",
            blurhash: null,
          },
        },
      },
    ],
  },
  pastShows: {
    pageInfo: {
      hasNextPage: true,
      endCursor: "end",
      startCursor: "start",
    },
    edges: [
      {
        cursor: "a",
        node: {
          __typename: "Show",
          isDisplayable: true,
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
        cursor: "b",
        node: {
          __typename: "Show",
          isDisplayable: true,
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
        cursor: "c",
        node: {
          __typename: "Show",
          isDisplayable: true,
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
        cursor: "d",
        node: {
          __typename: "Show",
          isDisplayable: true,
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
}

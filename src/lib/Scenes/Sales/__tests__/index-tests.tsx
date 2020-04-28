// @ts-ignore STRICTNESS_MIGRATION
import { shallow } from "enzyme"
import React from "react"
import "react-native"

import { renderWithLayout } from "lib/tests/renderWithLayout"

import { SalesFragmentContainer } from "../index"

jest.mock("../Components/LotsByFollowedArtists", () => "")

it("renders the ZeroState when there are no sales", () => {
  // @ts-ignore STRICTNESS_MIGRATION
  const auctions = shallow(<SalesFragmentContainer {...props} sales={{ edges: [] } as any} me={null} />)
  expect(auctions.find("ZeroState").length).toEqual(1)
})

it("doesn't throw when rendered", () => {
  expect(() => renderWithLayout(<SalesFragmentContainer {...(props as any)} />, { width: 1000 })).not.toThrow()
})

const props = {
  relay: {
    environment: null,
    hasMore: jest.fn(),
    isLoading: jest.fn(),
    loadMore: jest.fn(),
    refetch: jest.fn(),
  },
  sales: {
    edges: [
      {
        node: {
          id: "wright-noma",
          href: "/auction/wright-noma",
          name: "Wright: noma",
          is_open: true,
          is_live_open: true,
          start_at: "2017-10-16T22:00:00+00:00",
          end_at: null,
          registration_ends_at: "2017-11-01T13:00:00+00:00",
          live_start_at: "2017-11-02T13:00:00+00:00",
          displayTimelyAt: "In Progress",
          cover_image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/WV-7BYlETayN8MGkNjOGXw/source.jpg",
          },
        },
      },
      {
        node: {
          id: "freemans-modern-and-contemporary-works-of-art",
          href: "/auction/freemans-modern-and-contemporary-works-of-art",
          name: "Freeman's: Modern & Contemporary Works of Art",
          is_open: true,
          is_live_open: false,
          start_at: "2017-10-17T15:00:00+00:00",
          end_at: null,
          registration_ends_at: "2017-11-01T17:00:00+00:00",
          live_start_at: "2017-11-02T17:00:00+00:00",
          displayTimelyAt: "In Progress",
          cover_image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/eeqLfwMMAYA8XOmeYEb7Rg/source.jpg",
          },
        },
      },
    ],
  },
  me: {
    lotsByFollowedArtists: {
      pageInfo: {},
      edges: [
        {
          node: {
            id: "foo",
          },
        },
      ],
    },
  },
}

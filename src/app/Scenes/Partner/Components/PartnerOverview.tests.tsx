import { PartnerOverviewTestsQuery } from "__generated__/PartnerOverviewTestsQuery.graphql"
import { ArtistListItem } from "app/Components/ArtistListItem"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { PartnerOverviewFragmentContainer as PartnerOverview } from "./PartnerOverview"

jest.unmock("react-relay")

const PartnerOverviewFixture: NonNullable<PartnerOverviewTestsQuery["rawResponse"]["partner"]> = {
  id: "293032r423",
  slug: "gagosian",
  internalID: "4d8b92c44eb68a1b2c0004cb",
  name: "Gagosian",
  cities: [],
  profile: {
    id: "",
    bio: "",
  },
  artists: {
    pageInfo: null as any,
    edges: [],
  },
  locations: null,
}

describe("PartnerOverview", () => {
  const env = createMockEnvironment()
  const TestRenderer = () => (
    <QueryRenderer<PartnerOverviewTestsQuery>
      environment={env}
      query={graphql`
        query PartnerOverviewTestsQuery @raw_response_type {
          partner(id: "gagosian") {
            ...PartnerOverview_partner
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (!props?.partner) {
          return null
        }
        return (
          <StickyTabPage
            tabs={[
              {
                title: "test",
                content: <PartnerOverview partner={props.partner} />,
              },
            ]}
          />
        )
      }}
    />
  )

  it("renders the artists with published artworks correctly", async () => {
    const partnerWithArtists = {
      ...PartnerOverviewFixture,
      artists: {
        edges: artists,
      },
    }
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: partnerWithArtists,
        },
      })
    })
    const lists = tree.root.findAllByType(ArtistListItem)
    expect(lists.length).toBe(2)
  })

  it("renders the ReadMore component correctly", async () => {
    const partnerWithBio = {
      ...PartnerOverviewFixture,
      profile: {
        bio: "Nullam quis risus eget urna mollis ornare vel eu leo.",
      },
    }
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: partnerWithBio,
        },
      })
    })
    expect(extractText(tree.root)).toContain("Nullam quis risus")
  })

  it("renders the location text correctly", async () => {
    const partnerWithBio = {
      ...PartnerOverviewFixture,
      profile: {
        bio: "Nullam quis risus eget urna mollis ornare vel eu leo.",
      },
    }

    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: partnerWithBio,
        },
      })
    })
    expect(extractText(tree.root)).toContain("Nullam quis risus")
  })

  it("makes sure the artist number label matches the number of artists", () => {
    const partnerWithArtists = {
      ...PartnerOverviewFixture,
      artists: {
        edges: artists,
      },
    }
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: partnerWithArtists,
        },
      })
    })
    const lists = tree.root.findAllByType(ArtistListItem)
    expect(lists.length).toBe(2)
    expect(extractText(tree.root)).toContain("Artists (2)")
  })
})

const artists: NonNullable<
  NonNullable<PartnerOverviewTestsQuery["rawResponse"]["partner"]>["artists"]
>["edges"] = [
  {
    cursor: "a",
    id: "a",
    node: {
      __typename: "Artist",
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
      counts: {
        artworks: 7,
      },
    },
  },
  {
    cursor: "b",
    id: "b",
    node: {
      __typename: "Artist",
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
      counts: {
        artworks: 0,
      },
    },
  },
  {
    cursor: "c",
    id: "c",
    node: {
      __typename: "Artist",
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
      counts: {
        artworks: 2,
      },
    },
  },
]

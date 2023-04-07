import { PartnerHeaderTestsQuery } from "__generated__/PartnerHeaderTestsQuery.graphql"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Button } from "app/Components/Button"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { PartnerHeaderContainer as PartnerHeader } from "./PartnerHeader"

describe("PartnerHeader", () => {
  const env = createMockEnvironment()
  const TestRenderer = () => (
    <QueryRenderer<PartnerHeaderTestsQuery>
      environment={env}
      query={graphql`
        query PartnerHeaderTestsQuery @raw_response_type {
          partner(id: "gagosian") {
            ...PartnerHeader_partner
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.partner) {
          return <PartnerHeader partner={props.partner} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  it("renders artwork counts", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: PartnerHeaderFixture,
        },
      })
    })

    expect(extractText(tree.root)).toContain("1.2K works")
  })

  it("renders the partner name", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: PartnerHeaderFixture,
        },
      })
    })

    expect(extractText(tree.root)).toContain("Gagosian")
  })

  it("renders the follow button", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: PartnerHeaderFixture,
        },
      })
    })

    expect(extractText(tree.root.findByType(Button))).toContain("Follow")
  })

  it("renders the Black Owned marquee if the gallery has the 'Black Owned' category", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: BlackOwnedPartnerHeaderFixture,
        },
      })
    })

    expect(extractText(tree.root)).toContain("Black Owned")
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
  categories: [],
  internalID: "4d8b92c44eb68a1b2c0004cb",
  slug: "gagosian",
}

const BlackOwnedPartnerHeaderFixture = {
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
  categories: [{ name: "Black Owned" }],
  internalID: "4d8b92c44eb68a1b2c0004cb",
  slug: "gagosian",
}

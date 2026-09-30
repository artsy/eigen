import { Button } from "@artsy/palette-mobile"
import { PartnerHeaderTestsQuery } from "__generated__/PartnerHeaderTestsQuery.graphql"
import { TypeEyebrow } from "app/Components/TypeEyebrow"
import { PartnerHeaderContainer as PartnerHeader } from "app/Scenes/Partner/Components/PartnerHeader"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

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

  it("renders a type eyebrow above the name when the partner has a category", async () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: { ...PartnerHeaderFixture, type: "Gallery" },
        },
      })
    })

    expect(extractText(view.root)).toContain("Gallery")
    expect(extractText(view.root)).toContain("Gagosian")
  })

  it("renders no eyebrow when the partner has no type", async () => {
    const view = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: { ...PartnerHeaderFixture, type: null },
        },
      })
    })

    expect(view.root.findAll((node) => node.type === TypeEyebrow)).toHaveLength(0)
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

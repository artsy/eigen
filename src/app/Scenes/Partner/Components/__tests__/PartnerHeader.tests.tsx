import { act, screen } from "@testing-library/react-native"
import { PartnerHeaderTestsQuery } from "__generated__/PartnerHeaderTestsQuery.graphql"
import { PartnerHeaderContainer as PartnerHeader } from "app/Scenes/Partner/Components/PartnerHeader"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Components/TypeEyebrow", () => {
  const { Text } = jest.requireActual("react-native")
  return {
    TypeEyebrow: ({ children }: { children: string }) => (
      <Text testID="type-eyebrow">{children}</Text>
    ),
  }
})

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

  it("renders artwork counts", () => {
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: PartnerHeaderFixture,
        },
      })
    })

    expect(screen.getByText("1.2K works")).toBeOnTheScreen()
  })

  it("renders the follow button", () => {
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: PartnerHeaderFixture,
        },
      })
    })

    expect(screen.getByRole("button", { name: /Follow/ })).toBeOnTheScreen()
  })

  it("renders the Black Owned marquee if the gallery has the 'Black Owned' category", () => {
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: BlackOwnedPartnerHeaderFixture,
        },
      })
    })

    expect(screen.getAllByText(/Black Owned/).length).toBeGreaterThan(0)
  })

  it("renders a type eyebrow above the name when the partner has a category", () => {
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: { ...PartnerHeaderFixture, type: "Gallery" },
        },
      })
    })

    expect(screen.getByTestId("type-eyebrow")).toHaveTextContent("Gallery")
    expect(screen.getByText("Gagosian")).toBeOnTheScreen()
  })

  it("renders no eyebrow when the partner has no type", () => {
    renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          partner: { ...PartnerHeaderFixture, type: null },
        },
      })
    })

    expect(screen.queryByTestId("type-eyebrow")).not.toBeOnTheScreen()
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

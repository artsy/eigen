import { PartnerOverviewTestsQuery } from "__generated__/PartnerOverviewTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { PartnerOverviewFragmentContainer as PartnerOverview } from "./PartnerOverview"

const PartnerOverviewFixture: NonNullable<PartnerOverviewTestsQuery["rawResponse"]["partner"]> = {
  id: "293032r423",
  slug: "gagosian",
  name: "Gagosian",
  displayArtistsSection: false,
  cities: [],
  profile: {
    id: "",
    bio: "",
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

  it("renders the ReadMore component correctly", async () => {
    const partnerWithBio = {
      ...PartnerOverviewFixture,
      profile: {
        bio: "Nullam quis risus eget urna mollis ornare vel eu leo.",
      },
    }
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
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

    const tree = renderWithWrappersLEGACY(<TestRenderer />)
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
})

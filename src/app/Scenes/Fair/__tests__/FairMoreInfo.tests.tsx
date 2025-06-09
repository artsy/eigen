import { Text, LinkText } from "@artsy/palette-mobile"
import { FairMoreInfoTestsQuery } from "__generated__/FairMoreInfoTestsQuery.graphql"
import { LocationMapContainer } from "app/Components/LocationMap/LocationMap"
import { FairMoreInfoFragmentContainer } from "app/Scenes/Fair/FairMoreInfo"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

const getText = (wrapper: ReactTestRenderer) =>
  [...wrapper.root.findAllByType(Text), ...wrapper.root.findAllByType(LinkText)]
    .map(({ props: { children } }) => children)
    .join()

describe("FairMoreInfo", () => {
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()
    const tree = renderWithWrappersLEGACY(
      <QueryRenderer<FairMoreInfoTestsQuery>
        environment={env}
        query={graphql`
          query FairMoreInfoTestsQuery($fairID: String!) @relay_test_operation {
            fair(id: $fairID) {
              ...FairMoreInfo_fair
            }
          }
        `}
        variables={{ fairID: "art-basel-hong-kong-2019" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.fair) {
            return null
          }

          return <FairMoreInfoFragmentContainer fair={props.fair} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, mockResolvers)
    )

    return tree
  }

  it("displays more information about the fair", async () => {
    const wrapper = getWrapper({
      Fair: () => ({
        about: "This is the about.",
        summary: "This is the summary.",
        location: {
          summary: "A big expo center",
          coordinates: {
            lat: 1,
            lng: 1,
          },
        },
        openingHours: {
          __typename: "OpeningHoursText",
          text: null,
        },
        tagline: "Buy lots of art",
        fairLinks: "Google it",
        fairContact: "Art Basel Hong Kong",
        fairHours: "Open every day at 5am",
        fairTickets: "Ticket info",
        ticketsLink: "Ticket link",
      }),
    })
    const rootText = getText(wrapper)
    expect(rootText).toContain("This is the about.")
    expect(rootText).toContain("Buy lots of art")
    expect(rootText).toContain("A big expo center")
    expect(rootText).toContain("Open every day at 5am")
    expect(rootText).toContain("Ticket info")
    expect(rootText).toContain("Art Basel Hong Kong")
    expect(rootText).toContain("Buy Tickets")
    expect(rootText).toContain("Google it")
    expect(wrapper.root.findAllByType(LocationMapContainer).length).toBe(1)
  })

  it("handles missing information", async () => {
    const wrapper = getWrapper({
      Fair: () => ({
        about: "",
        tagline: "",
        location: null,
        ticketsLink: "",
        fairHours: "",
        fairLinks: "",
        fairTickets: "",
        fairContact: "",
        summary: "",
      }),
    })
    const rootText = getText(wrapper)
    expect(rootText).not.toContain("Location")
    expect(rootText).not.toContain("Hours")
    expect(rootText).not.toContain("Buy Tickets")
    expect(rootText).not.toContain("Links")
    expect(rootText).not.toContain("Tickets")
    expect(rootText).not.toContain("Contact")
    expect(wrapper.root.findAllByType(LocationMapContainer).length).toBe(0)
  })
})

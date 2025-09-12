import { screen } from "@testing-library/react-native"
import { FairMoreInfoTestsQuery } from "__generated__/FairMoreInfoTestsQuery.graphql"
import { FairMoreInfoFragmentContainer } from "app/Scenes/Fair/FairMoreInfo"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("FairMoreInfo", () => {
  const { renderWithRelay } = setupTestWrapper<FairMoreInfoTestsQuery>({
    Component: ({ fair }) => {
      return <FairMoreInfoFragmentContainer fair={fair!} />
    },
    query: graphql`
      query FairMoreInfoTestsQuery($fairID: String!) @relay_test_operation {
        fair(id: $fairID) {
          ...FairMoreInfo_fair
        }
      }
    `,
    variables: {
      fairID: "art-basel-hong-kong-2019",
    },
  })

  it("displays more information about the fair", async () => {
    renderWithRelay({
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

    expect(screen.getByText("This is the about.")).toBeOnTheScreen()
    expect(screen.getByText("Buy lots of art")).toBeOnTheScreen()
    expect(screen.getAllByText("A big expo center")).toHaveLength(2)
    expect(screen.getByText("Open every day at 5am")).toBeOnTheScreen()
    expect(screen.getByText("Ticket info")).toBeOnTheScreen()
    expect(screen.getByText("Art Basel Hong Kong")).toBeOnTheScreen()
    expect(screen.getByText("Buy Tickets")).toBeOnTheScreen()
    expect(screen.getByText("Google it")).toBeOnTheScreen()
    expect(screen.getByLabelText("map")).toBeOnTheScreen()
  })

  it("handles missing information", async () => {
    renderWithRelay({
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

    expect(screen.queryByText("Location")).not.toBeOnTheScreen()
    expect(screen.queryByText("Hours")).not.toBeOnTheScreen()
    expect(screen.queryByText("Buy Tickets")).not.toBeOnTheScreen()
    expect(screen.queryByText("Links")).not.toBeOnTheScreen()
    expect(screen.queryByText("Tickets")).not.toBeOnTheScreen()
    expect(screen.queryByText("Contact")).not.toBeOnTheScreen()
    expect(screen.queryByLabelText("map")).not.toBeOnTheScreen()
  })
})

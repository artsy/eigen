import { screen } from "@testing-library/react-native"
import { ShowTestsQuery } from "__generated__/ShowTestsQuery.graphql"
import { Show, ShowFragmentContainer } from "app/Scenes/Show/Show"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("Show", () => {
  const { renderWithRelay } = setupTestWrapper<ShowTestsQuery>({
    Component: ({ show }) => <ShowFragmentContainer show={show!} />,
    query: graphql`
      query ShowTestsQuery($showID: String!) @relay_test_operation {
        show(id: $showID) {
          ...Show_show
        }
      }
    `,
    variables: {
      showID: "the-big-show",
    },
  })

  it("renders the show", () => {
    renderWithRelay({
      Show: () => ({
        name: "The big show",
        formattedStartAt: "October 23",
        formattedEndAt: "October 27, 2000",
        startAt: "2000-10-23T20:00:00+00:00",
        endAt: "2000-10-27T00:00:00+00:00",
        partner: {
          name: "Example Partner",
        },
      }),
    })

    expect(screen.UNSAFE_queryAllByType(Show)).toHaveLength(1)

    expect(screen.getByText("The big show")).toBeTruthy()
    expect(screen.getByText("October 23 – October 27, 2000")).toBeTruthy()
    expect(screen.getByText("Closed")).toBeTruthy()
    expect(screen.getByText("Presented by Example Partner")).toBeTruthy()
  })

  it("renders the installation shots", () => {
    renderWithRelay({
      Show: () => ({
        images: [{ caption: "First install shot" }, { caption: "Second install shot" }],
      }),
    })

    expect(screen.getByText("First install shot")).toBeTruthy()
    expect(screen.getByText("Second install shot")).toBeTruthy()
  })

  it("renders the context card", () => {
    renderWithRelay()

    expect(screen.getByTestId("ShowContextCard")).toBeTruthy()
  })

  it("renders artworks filter header", () => {
    renderWithRelay()

    expect(screen.getByTestId("HeaderArtworksFilter")).toBeTruthy()
  })
})

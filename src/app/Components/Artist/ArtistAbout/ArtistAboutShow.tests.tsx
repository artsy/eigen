import { screen, fireEvent } from "@testing-library/react-native"
import { ArtistAboutShowTestsQuery } from "__generated__/ArtistAboutShowTestsQuery.graphql"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ArtistAboutShow } from "./ArtistAboutShow"

describe("ArtistAboutShow", () => {
  const { renderWithRelay } = setupTestWrapper<ArtistAboutShowTestsQuery>({
    Component: ({ artist }) => {
      const shows = extractNodes(artist?.showsConnection)
      return <ArtistAboutShow show={shows[0]} />
    },
    query: graphql`
      query ArtistAboutShowTestsQuery @relay_test_operation {
        artist(id: "test-id") {
          showsConnection(first: 5, status: "running") {
            edges {
              node {
                ...ArtistAboutShow_show
              }
            }
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({ Show: () => show })

    expect(screen.getByTestId("show-cover")).toBeOnTheScreen()
    expect(screen.getByText(show.name)).toBeOnTheScreen()
    expect(screen.getByText(show.partner.name)).toBeOnTheScreen()
    expect(screen.getByText(show.exhibitionPeriod)).toBeOnTheScreen()
  })

  it("navigates to the show", () => {
    renderWithRelay({ Show: () => show })

    fireEvent.press(screen.getByTestId("show-cover"))

    expect(navigate).toHaveBeenCalledWith(show.href)
  })
})

const show = {
  slug: "test-show",
  name: "Test Show",
  href: "www.test.com/img.jpeg",
  partner: {
    name: "Test Partner",
  },
  exhibitionPeriod: "Jul 12 - Jul 20",
}

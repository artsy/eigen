import { screen, fireEvent } from "@testing-library/react-native"
import { ShowItemTestsQuery } from "__generated__/ShowItemTestsQuery.graphql"
import { ShowItem } from "app/Components/ShowItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ShowItem", () => {
  const { renderWithRelay } = setupTestWrapper<ShowItemTestsQuery>({
    Component: ({ artist }) => {
      const shows = extractNodes(artist?.showsConnection)
      return <ShowItem show={shows[0]} />
    },
    query: graphql`
      query ShowItemTestsQuery @relay_test_operation {
        artist(id: "test-id") {
          showsConnection(first: 5, status: "running") {
            edges {
              node {
                ...ShowItem_show
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

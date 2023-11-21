import { screen } from "@testing-library/react-native"
import { VariableSizeShowsListTestQuery } from "__generated__/VariableSizeShowsListTestQuery.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import ShowsList from "./VariableSizeShowsList"

describe("VariableSizeShowsList", () => {
  const { renderWithRelay } = setupTestWrapper<VariableSizeShowsListTestQuery>({
    Component: ({ showsConnection }) => {
      const shows = extractNodes(showsConnection)
      return <ShowsList shows={shows} showSize="medium" />
    },
    query: graphql`
      query VariableSizeShowsListTestQuery @relay_test_operation {
        showsConnection(first: 2) {
          edges {
            node {
              ...VariableSizeShowsList_shows
            }
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay({
      ShowConnection: () => ({ edges: [{ node: showProps(1) }, { node: showProps(2) }] }),
    })

    expect(screen.getByText("Expansive Exhibition 1")).toBeOnTheScreen()
    expect(screen.getByText("Expansive Exhibition 2")).toBeOnTheScreen()
  })
})

const showProps = (n: number) => {
  return {
    id: `show-expansive-exhibition-${n}`,
    href: "artsy.net/show",
    cover_image: {
      url: "artsy.net/image-url",
    },
    kind: "solo",
    name: `Expansive Exhibition ${n}`,
    exhibition_period: "Jan 1 - March 1",
    status_update: "Closing in 2 days",
    status: "running",
    partner: {
      name: "Gallery",
    },
    location: {
      city: "Berlin",
    },
  }
}

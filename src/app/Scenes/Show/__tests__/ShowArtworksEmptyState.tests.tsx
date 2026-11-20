import { act, screen } from "@testing-library/react-native"
import { ShowArtworksEmptyStateTestsQuery } from "__generated__/ShowArtworksEmptyStateTestsQuery.graphql"
import { ShowArtworksEmptyStateFragmentContainer } from "app/Scenes/Show/Components/ShowArtworksEmptyState"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

describe("ShowArtworksEmptyState", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<ShowArtworksEmptyStateTestsQuery>
      environment={env}
      query={graphql`
        query ShowArtworksEmptyStateTestsQuery @relay_test_operation {
          show(id: "example-show-id") {
            ...ShowArtworksEmptyState_show
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowArtworksEmptyStateFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = async (mockResolvers = {}) => {
    await renderWithWrappers(<TestRenderer />)
    await act(() => {
      env.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
  }

  describe("fair booth", () => {
    it("renders the correct message for non-closed fair booths", async () => {
      await getWrapper({ Show: () => ({ isFairBooth: true }) })

      expect(
        screen.getByText(
          "This fair booth is currently unavailable. Please check back closer to the fair for artworks."
        )
      ).toBeOnTheScreen()
    })

    it("renders the correct message for closed fair booths", async () => {
      await getWrapper({
        Show: () => ({ isFairBooth: true, status: "closed" }),
      })

      expect(screen.getByText(/This fair booth is currently unavailable./)).toBeOnTheScreen()
      expect(
        screen.queryByText(/Please check back closer to the fair for artworks./)
      ).not.toBeOnTheScreen()
    })
  })

  describe("show", () => {
    it("renders the correct message for non-closed shows", async () => {
      await getWrapper({ Show: () => ({ isFairBooth: false }) })

      expect(
        screen.getByText(
          "This show is currently unavailable. Please check back closer to the show for artworks."
        )
      ).toBeOnTheScreen()
    })

    it("renders the correct message for closed shows", async () => {
      await getWrapper({
        Show: () => ({ isFairBooth: false, status: "closed" }),
      })

      expect(screen.getByText(/This show is currently unavailable./)).toBeOnTheScreen()
      expect(
        screen.queryByText(/Please check back closer to the show for artworks./)
      ).not.toBeOnTheScreen()
    })
  })
})

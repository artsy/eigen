import { screen } from "@testing-library/react-native"
import { FairEmptyStateTestsQuery } from "__generated__/FairEmptyStateTestsQuery.graphql"
import { FairEmptyStateFragmentContainer } from "app/Scenes/Fair/Components/FairEmptyState"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { DateTime } from "luxon"
import { graphql } from "react-relay"

const { renderWithRelay } = setupTestWrapper<FairEmptyStateTestsQuery>({
  Component: (props) => <FairEmptyStateFragmentContainer fair={props.fair!} />,
  query: graphql`
    query FairEmptyStateTestsQuery {
      fair(id: "example-fair-id") {
        ...FairEmptyState_fair
      }
    }
  `,
})

describe("FairEmptyState", () => {
  it("renders null when the fair is active", () => {
    renderWithRelay({ Fair: () => ({ isActive: true }) })
    expect(screen.queryByText(/This fair is currently unavailable/)).not.toBeOnTheScreen()
  })

  describe("inactive", () => {
    it("renders correctly when the fair is inactive", () => {
      renderWithRelay({ Fair: () => ({ isActive: false }) })
      expect(screen.getByText("This fair is currently unavailable.")).toBeOnTheScreen()
    })

    it("renders correctly when the fair is in the future", () => {
      renderWithRelay({
        Fair: () => ({ isActive: false, endAt: DateTime.local().plus({ days: 1 }) }),
      })
      expect(
        screen.getByText(
          "This fair is currently unavailable. Please check back closer to the fair for artworks."
        )
      ).toBeOnTheScreen()
    })
  })
})

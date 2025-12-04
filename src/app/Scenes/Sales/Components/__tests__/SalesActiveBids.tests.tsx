import { screen } from "@testing-library/react-native"
import { SalesActiveBidsQuery } from "__generated__/SalesActiveBidsQuery.graphql"
import {
  SalesActiveBidsQueryRenderer,
  SalesActiveBidsScreenQuery,
} from "app/Scenes/Sales/Components/SalesActiveBids"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

describe("SalesActiveBids", () => {
  const { renderWithRelay } = setupTestWrapper<SalesActiveBidsQuery>({
    Component: () => <SalesActiveBidsQueryRenderer />,
    query: SalesActiveBidsScreenQuery,
  })

  it("renders without throwing errors", () => {
    renderWithRelay()

    expect(screen.getByText("Your Active Bids")).toBeOnTheScreen()
  })
})

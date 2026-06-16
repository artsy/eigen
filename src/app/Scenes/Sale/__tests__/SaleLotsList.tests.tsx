import { screen } from "@testing-library/react-native"
import { FilterParams } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SaleLotsListSortMode } from "app/Scenes/Sale/Components/SaleLotsList"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SaleLotsListSortMode", () => {
  it("renders the right sort mode and count", () => {
    renderWithWrappers(
      <SaleLotsListSortMode
        filterParams={{ sort: "bidder_positions_count" } as FilterParams}
        filteredTotal={20}
        totalCount={100}
      />
    )

    expect(screen.getByText("Sorted by Least Bids")).toBeTruthy()
    expect(screen.getByText("Showing 20 of 100")).toBeTruthy()
  })
})

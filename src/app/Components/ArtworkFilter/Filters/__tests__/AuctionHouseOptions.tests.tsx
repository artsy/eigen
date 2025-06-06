import { fireEvent, screen } from "@testing-library/react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { AuctionHouseOptionsScreen } from "app/Components/ArtworkFilter/Filters/AuctionHouseOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("AuctionHouse options screen", () => {
  const MockAuctionHouseScreen = ({
    initialData = initialState,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <AuctionHouseOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "auctionResult",
    counts: {
      total: null,
      followedArtists: null,
    },
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  it("selects only the option that is selected", () => {
    renderWithWrappers(
      <MockAuctionHouseScreen {...getEssentialProps()} initialData={initialState} />
    )
    const options = screen.getAllByTestId("multi-select-option-button")
    const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

    expect(options[0]).toHaveTextContent("Sotheby's")
    expect(checkboxes[0]).toHaveProp("selected", false)

    fireEvent.press(screen.getByText("Sotheby's"))

    expect(checkboxes[0]).toHaveProp("selected", true)

    expect(screen.getByText("Clear")).toBeTruthy()
  })

  it("allows multiple auction houses to be selected", () => {
    renderWithWrappers(
      <MockAuctionHouseScreen {...getEssentialProps()} initialData={initialState} />
    )

    const options = screen.getAllByTestId("multi-select-option-button")
    const checkboxes = screen.getAllByTestId("multi-select-option-checkbox")

    expect(options).toHaveLength(5)

    expect(options[0]).toHaveTextContent("Sotheby's")
    expect(options[1]).toHaveTextContent("Christie's")
    expect(options[3]).toHaveTextContent("Bonhams")
    expect(options[4]).toHaveTextContent("Artsy Auction")

    expect(checkboxes[0]).toHaveProp("selected", false)
    expect(checkboxes[1]).toHaveProp("selected", false)
    expect(checkboxes[2]).toHaveProp("selected", false)
    expect(checkboxes[3]).toHaveProp("selected", false)
    expect(checkboxes[4]).toHaveProp("selected", false)

    fireEvent.press(screen.getByText("Sotheby's"))
    fireEvent.press(screen.getByText("Christie's"))
    fireEvent.press(screen.getByText("Bonhams"))
    fireEvent.press(screen.getByText("Artsy Auction"))

    expect(checkboxes[0]).toHaveProp("selected", true)
    expect(checkboxes[1]).toHaveProp("selected", true)
    expect(checkboxes[2]).toHaveProp("selected", false)
    expect(checkboxes[3]).toHaveProp("selected", true)
    expect(checkboxes[4]).toHaveProp("selected", true)
  })
})

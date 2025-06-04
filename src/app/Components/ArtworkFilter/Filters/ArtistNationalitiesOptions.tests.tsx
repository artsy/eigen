import { fireEvent, screen } from "@testing-library/react-native"
import { Aggregations, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { ArtistNationalitiesOptionsScreen } from "./ArtistNationalitiesOptions"
import { getEssentialProps } from "./helper"

const MOCK_AGGREGATIONS: Aggregations = [
  {
    slice: "ARTIST_NATIONALITY",
    counts: [
      { count: 1254, name: "American", value: "American" },
      { count: 373, name: "British", value: "British" },
      { count: 191, name: "German", value: "German" },
      { count: 103, name: "Italian", value: "Italian" },
      { count: 65, name: "Japanese", value: "Japanese" },
    ],
  },
]

describe("ArtistNationalitiesOptionsScreen", () => {
  const INITIAL_DATA: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: MOCK_AGGREGATIONS,
    filterType: "artwork",
    counts: {
      total: null,
      followedArtists: null,
    },
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  const TestWrapper = ({ initialData = INITIAL_DATA }) => {
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <ArtistNationalitiesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    renderWithWrappers(<TestWrapper />)

    expect(screen.getByText("American")).toBeOnTheScreen()
    expect(screen.getByText("British")).toBeOnTheScreen()
    expect(screen.getByText("German")).toBeOnTheScreen()
    expect(screen.getByText("Italian")).toBeOnTheScreen()
    expect(screen.getByText("Japanese")).toBeOnTheScreen()
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const initialData: ArtworkFiltersState = {
      ...INITIAL_DATA,
      selectedFilters: [
        {
          displayText: "British, American",
          paramName: FilterParamName.artistNationalities,
          paramValue: ["British", "American"],
        },
      ],
    }

    renderWithWrappers(<TestWrapper initialData={initialData} />)

    const checkboxes = screen.getAllByRole("checkbox")
    expect(checkboxes).toHaveLength(5)

    expect(checkboxes[0]).toBeChecked() // American
    expect(checkboxes[1]).toBeChecked() // British
    expect(checkboxes[2]).not.toBeChecked() // German
    expect(checkboxes[3]).not.toBeChecked() // Italian
    expect(checkboxes[4]).not.toBeChecked() // Japanese
  })

  it("clears all when `Clear` button is tapped", () => {
    const initialData: ArtworkFiltersState = {
      ...INITIAL_DATA,
      selectedFilters: [
        {
          displayText: "British, American",
          paramName: FilterParamName.artistNationalities,
          paramValue: ["British", "American"],
        },
      ],
    }

    renderWithWrappers(<TestWrapper initialData={initialData} />)

    const checkboxes = screen.getAllByRole("checkbox")

    expect(checkboxes[0]).toBeChecked() // American
    expect(checkboxes[1]).toBeChecked() // British
    expect(checkboxes[2]).not.toBeChecked() // German
    expect(checkboxes[3]).not.toBeChecked() // Italian
    expect(checkboxes[4]).not.toBeChecked() // Japanese

    fireEvent.press(screen.getByText("Clear"))

    expect(checkboxes[0]).not.toBeChecked() // American
    expect(checkboxes[1]).not.toBeChecked() // British
    expect(checkboxes[2]).not.toBeChecked() // German
    expect(checkboxes[3]).not.toBeChecked() // Italian
    expect(checkboxes[4]).not.toBeChecked() // Japanese
  })
})

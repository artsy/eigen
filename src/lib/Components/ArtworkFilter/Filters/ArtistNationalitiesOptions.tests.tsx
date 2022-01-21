import { Aggregations, FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { RightButtonContainer } from "lib/Components/FancyModal/FancyModalHeader"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Check } from "palette"
import React from "react"
import { ArtistNationalitiesOptionsScreen } from "./ArtistNationalitiesOptions"
import { getEssentialProps } from "./helper"
import { OptionListItem } from "./MultiSelectOption"

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
  }

  const MockArtistNationalitiesOptionsScreen = ({
    initialData = INITIAL_DATA,
  }: {
    initialData?: ArtworkFiltersState
  }) => {
    return (
      <ArtworkFiltersStoreProvider initialData={initialData}>
        <ArtistNationalitiesOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    const tree = renderWithWrappers(
      <MockArtistNationalitiesOptionsScreen initialData={INITIAL_DATA} />
    )
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(5)
    const items = tree.root.findAllByType(OptionListItem)
    expect(items.map(extractText)).toEqual(["American", "British", "German", "Italian", "Japanese"])
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

    const tree = renderWithWrappers(
      <MockArtistNationalitiesOptionsScreen initialData={initialData} />
    )
    const options = tree.root.findAllByType(Check)

    expect(options[0].props.selected).toBe(true)
    expect(options[1].props.selected).toBe(true)
    expect(options[2].props.selected).toBe(false)
    expect(options[3].props.selected).toBe(false)
    expect(options[4].props.selected).toBe(false)
  })

  it("clears all when clear button is tapped", () => {
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

    const tree = renderWithWrappers(
      <MockArtistNationalitiesOptionsScreen initialData={initialData} />
    )
    const options = tree.root.findAllByType(Check)
    const clear = tree.root.findByType(RightButtonContainer)

    expect(options[0].props.selected).toBe(true)
    expect(options[1].props.selected).toBe(true)
    expect(options[2].props.selected).toBe(false)
    expect(options[3].props.selected).toBe(false)
    expect(options[4].props.selected).toBe(false)

    clear.props.onPress()

    expect(options[0].props.selected).toBe(false)
    expect(options[1].props.selected).toBe(false)
    expect(options[2].props.selected).toBe(false)
    expect(options[3].props.selected).toBe(false)
    expect(options[4].props.selected).toBe(false)
  })
})

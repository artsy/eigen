import { SearchInput } from "lib/Components/SearchInput"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { FilterData, FilterParamName } from "../../ArtworkFilterHelpers"
import { MultiSelectOptionScreen } from "../MultiSelectOption"
import { getEssentialProps } from "./helper"

const EXAMPLE_FILTER_OPTIONS: FilterData[] = [
  { displayText: "First Example", paramValue: "first-example", paramName: FilterParamName.partnerIDs },
  { displayText: "Another One", paramValue: "another-one", paramName: FilterParamName.partnerIDs },
  { displayText: "The Third", paramValue: "the-third", paramName: FilterParamName.partnerIDs },
]

describe("MultiSelectOption", () => {
  it("renders the options", () => {
    const tree = renderWithWrappers(
      <MultiSelectOptionScreen filterOptions={EXAMPLE_FILTER_OPTIONS} searchable {...getEssentialProps()} />
    )

    expect(extractText(tree.root)).toEqual("First ExampleAnother OneThe Third")
  })

  describe("searchable", () => {
    it("filters the options with searchable", () => {
      const tree = renderWithWrappers(
        <MultiSelectOptionScreen filterOptions={EXAMPLE_FILTER_OPTIONS} searchable {...getEssentialProps()} />
      )

      expect(extractText(tree.root)).toEqual("First ExampleAnother OneThe Third")

      tree.root.findByType(SearchInput).props.onChangeText("another")

      expect(extractText(tree.root)).toEqual("Another One")
    })

    it("displays a message indicating no results when nothing matches the search input", () => {
      const tree = renderWithWrappers(
        <MultiSelectOptionScreen filterOptions={EXAMPLE_FILTER_OPTIONS} searchable {...getEssentialProps()} />
      )

      expect(extractText(tree.root)).toEqual("First ExampleAnother OneThe Third")

      tree.root.findByType(SearchInput).props.onChangeText("garbage")

      expect(extractText(tree.root)).toEqual("No results")
    })
  })
})

import { fireEvent } from "@testing-library/react-native"
import { FilterData, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { MultiSelectOptionScreen } from "app/Components/ArtworkFilter/Filters/MultiSelectOption"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const EXAMPLE_FILTER_OPTIONS: FilterData[] = [
  {
    displayText: "First Example",
    paramValue: "first-example",
    paramName: FilterParamName.partnerIDs,
  },
  { displayText: "Another One", paramValue: "another-one", paramName: FilterParamName.partnerIDs },
  { displayText: "The Third", paramValue: "the-third", paramName: FilterParamName.partnerIDs },
]

describe("MultiSelectOption", () => {
  it("renders the options", () => {
    const { getAllByTestId } = renderWithWrappers(
      <MultiSelectOptionScreen
        filterOptions={EXAMPLE_FILTER_OPTIONS}
        searchable
        {...getEssentialProps()}
      />
    )

    expect(getAllByTestId("multi-select-option-button").map(extractText)).toEqual([
      "First Example",
      "Another One",
      "The Third",
    ])
  })

  it("a disabled option cannot be clicked", () => {
    const onSelectMock = jest.fn()
    const { getAllByTestId } = renderWithWrappers(
      <MultiSelectOptionScreen
        filterOptions={EXAMPLE_FILTER_OPTIONS}
        onSelect={onSelectMock}
        isDisabled={() => true}
        {...getEssentialProps()}
      />
    )

    fireEvent.press(getAllByTestId("multi-select-option-button")[0])

    expect(onSelectMock).not.toBeCalled()
  })

  describe("searchable", () => {
    it("filters the options with searchable", () => {
      const { getAllByTestId, getByTestId } = renderWithWrappers(
        <MultiSelectOptionScreen
          filterOptions={EXAMPLE_FILTER_OPTIONS}
          searchable
          {...getEssentialProps()}
        />
      )

      expect(getAllByTestId("multi-select-option-button").map(extractText)).toEqual([
        "First Example",
        "Another One",
        "The Third",
      ])

      fireEvent.changeText(getByTestId("multi-select-search-input"), "another")

      expect(getAllByTestId("multi-select-option-button").map(extractText)).toEqual(["Another One"])
    })

    it("displays a message indicating no results when nothing matches the search input", () => {
      const { getAllByTestId, getByTestId, getByText } = renderWithWrappers(
        <MultiSelectOptionScreen
          filterOptions={EXAMPLE_FILTER_OPTIONS}
          searchable
          {...getEssentialProps()}
        />
      )

      expect(getAllByTestId("multi-select-option-button").map(extractText)).toEqual([
        "First Example",
        "Another One",
        "The Third",
      ])

      fireEvent.changeText(getByTestId("multi-select-search-input"), "garbage")

      expect(getByText("No results")).toBeTruthy()
    })
  })
})

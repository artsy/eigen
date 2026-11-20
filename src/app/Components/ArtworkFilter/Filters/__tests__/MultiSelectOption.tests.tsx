import { fireEvent, screen } from "@testing-library/react-native"
import { FilterData, FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { MultiSelectOptionScreen } from "app/Components/ArtworkFilter/Filters/MultiSelectOption"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const expectOptions = (names: string[]) => {
  const buttons = screen.getAllByTestId("multi-select-option-button")
  expect(buttons).toHaveLength(names.length)
  buttons.forEach((button, index) => {
    expect(button).toHaveTextContent(names[index])
  })
}

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
  it("renders the options", async () => {
    await renderWithWrappers(
      <MultiSelectOptionScreen
        filterOptions={EXAMPLE_FILTER_OPTIONS}
        searchable
        {...getEssentialProps()}
      />
    )

    expectOptions(["First Example", "Another One", "The Third"])
  })

  it("a disabled option cannot be clicked", async () => {
    const onSelectMock = jest.fn()
    await renderWithWrappers(
      <MultiSelectOptionScreen
        filterOptions={EXAMPLE_FILTER_OPTIONS}
        onSelect={onSelectMock}
        isDisabled={() => true}
        {...getEssentialProps()}
      />
    )

    await fireEvent.press(screen.getAllByTestId("multi-select-option-button")[0])

    expect(onSelectMock).not.toBeCalled()
  })

  describe("searchable", () => {
    it("filters the options with searchable", async () => {
      await renderWithWrappers(
        <MultiSelectOptionScreen
          filterOptions={EXAMPLE_FILTER_OPTIONS}
          searchable
          {...getEssentialProps()}
        />
      )

      expectOptions(["First Example", "Another One", "The Third"])

      await fireEvent.changeText(screen.getByTestId("multi-select-search-input"), "another")

      expectOptions(["Another One"])
    })

    it("displays a message indicating no results when nothing matches the search input", async () => {
      await renderWithWrappers(
        <MultiSelectOptionScreen
          filterOptions={EXAMPLE_FILTER_OPTIONS}
          searchable
          {...getEssentialProps()}
        />
      )

      expectOptions(["First Example", "Another One", "The Third"])

      await fireEvent.changeText(screen.getByTestId("multi-select-search-input"), "garbage")

      expect(screen.getByText("No results")).toBeTruthy()
    })
  })
})

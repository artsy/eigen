import { fireEvent, screen } from "@testing-library/react-native"
import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { useMultiSelect } from "app/Components/ArtworkFilter/Filters/useMultiSelect"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text, TouchableHighlight, TouchableWithoutFeedback, View } from "react-native"

describe("useMultiSelect", () => {
  const initialState: ArtworkFiltersState = {
    selectedFilters: [],
    appliedFilters: [],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "artwork",
    counts: {
      total: null,
      followedArtists: null,
    },
    showFilterArtworksModal: false,
    sizeMetric: "cm",
  }

  const OPTIONS = [
    { paramName: FilterParamName.colors, paramValue: "example-1", displayText: "Example 1" },
    { paramName: FilterParamName.colors, paramValue: "example-2", displayText: "Example 2" },
    { paramName: FilterParamName.colors, paramValue: "example-3", displayText: "Example 3" },
  ]

  const MockScreen: React.FC = () => {
    const { handleSelect, nextParamValues, isSelected, handleClear } = useMultiSelect({
      options: OPTIONS,
      paramName: FilterParamName.colors,
    })

    const selectedOptions = useSelectedOptionsDisplay()

    return (
      <View>
        <TouchableHighlight accessibilityRole="button" onPress={handleClear}>
          <Text>Clear</Text>
        </TouchableHighlight>

        {OPTIONS.map((option) => (
          <TouchableWithoutFeedback
            accessibilityRole="button"
            key={option.paramValue}
            onPress={() => {
              handleSelect(option, !isSelected(option))
            }}
          >
            <Text>{option.displayText}</Text>
          </TouchableWithoutFeedback>
        ))}

        <Text testID="nextParamValues">{JSON.stringify(nextParamValues)}</Text>
        <Text testID="selectedOptions">{JSON.stringify(selectedOptions)}</Text>
      </View>
    )
  }

  const MockComponent = ({ initialData = initialState }: { initialData?: ArtworkFiltersState }) => {
    return (
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...initialData,
        }}
      >
        <MockScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("manages the nextParamValues", async () => {
    await renderWithWrappers(<MockComponent initialData={initialState} />)

    expect(screen.getByTestId("nextParamValues")).toHaveTextContent("[]")

    await fireEvent.press(screen.getByText("Example 1"))

    expect(screen.getByTestId("nextParamValues")).toHaveTextContent('["example-1"]')

    await fireEvent.press(screen.getByText("Example 3"))

    expect(screen.getByTestId("nextParamValues")).toHaveTextContent('["example-1","example-3"]')

    await fireEvent.press(screen.getByText("Example 1"))

    expect(screen.getByTestId("nextParamValues")).toHaveTextContent('["example-3"]')
  })

  it("dispatches filter updates", async () => {
    await renderWithWrappers(<MockComponent initialData={initialState} />)

    await fireEvent.press(screen.getByText("Example 1"))
    await flushPromiseQueue()

    expect(screen.getByTestId("selectedOptions")).toHaveTextContent(
      '{"paramName":"colors","displayText":"Example 1","paramValue":["example-1"]}',
      { exact: false }
    )

    await fireEvent.press(screen.getByText("Example 3"))
    await flushPromiseQueue()

    expect(screen.getByTestId("selectedOptions")).toHaveTextContent(
      '{"paramName":"colors","displayText":"Example 1, Example 3","paramValue":["example-1","example-3"]}',
      { exact: false }
    )

    await fireEvent.press(screen.getByText("Example 2"))
    await flushPromiseQueue()

    expect(screen.getByTestId("selectedOptions")).toHaveTextContent(
      '{"paramName":"colors","displayText":"Example 1, Example 3, Example 2","paramValue":["example-1","example-3","example-2"]}',
      { exact: false }
    )
  })

  it("resets the state when cleared", async () => {
    await renderWithWrappers(<MockComponent initialData={initialState} />)

    await fireEvent.press(screen.getByText("Example 1"))
    await flushPromiseQueue()

    expect(screen.getByTestId("selectedOptions")).toHaveTextContent(
      '{"paramName":"colors","displayText":"Example 1","paramValue":["example-1"]}',
      { exact: false }
    )

    await fireEvent.press(screen.getByText("Clear"))
    await flushPromiseQueue()

    expect(screen.getByTestId("selectedOptions")).toHaveTextContent(
      '{"paramName":"colors","displayText":"All"}',
      { exact: false }
    )
  })
})

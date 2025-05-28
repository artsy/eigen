import { FilterParamName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { extractText } from "app/utils/tests/extractText"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Text, TouchableHighlight, TouchableWithoutFeedback, View } from "react-native"
import { getEssentialProps } from "./helper"
import { useMultiSelect } from "./useMultiSelect"

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

  it("manages the nextParamValues", () => {
    const tree = renderWithWrappersLEGACY(<MockComponent initialData={initialState} />)

    expect(extractText(tree.root.findByProps({ testID: "nextParamValues" }))).toEqual("[]")

    const buttons = tree.root.findAllByType(TouchableWithoutFeedback)

    buttons[0].props.onPress()

    expect(extractText(tree.root.findByProps({ testID: "nextParamValues" }))).toEqual(
      '["example-1"]'
    )

    buttons[2].props.onPress()

    expect(extractText(tree.root.findByProps({ testID: "nextParamValues" }))).toEqual(
      '["example-1","example-3"]'
    )

    buttons[0].props.onPress()

    expect(extractText(tree.root.findByProps({ testID: "nextParamValues" }))).toEqual(
      '["example-3"]'
    )
  })

  it("dispatches filter updates", async () => {
    const tree = renderWithWrappersLEGACY(<MockComponent initialData={initialState} />)
    const buttons = tree.root.findAllByType(TouchableWithoutFeedback)

    buttons[0].props.onPress()
    await flushPromiseQueue()

    expect(extractText(tree.root.findByProps({ testID: "selectedOptions" }))).toContain(
      '{"paramName":"colors","displayText":"Example 1","paramValue":["example-1"]}'
    )

    buttons[2].props.onPress()
    await flushPromiseQueue()

    expect(extractText(tree.root.findByProps({ testID: "selectedOptions" }))).toContain(
      '{"paramName":"colors","displayText":"Example 1, Example 3","paramValue":["example-1","example-3"]}'
    )

    buttons[1].props.onPress()
    await flushPromiseQueue()

    expect(extractText(tree.root.findByProps({ testID: "selectedOptions" }))).toContain(
      '{"paramName":"colors","displayText":"Example 1, Example 3, Example 2","paramValue":["example-1","example-3","example-2"]}'
    )
  })

  it("resets the state when cleared", async () => {
    const tree = renderWithWrappersLEGACY(<MockComponent initialData={initialState} />)
    const buttons = tree.root.findAllByType(TouchableWithoutFeedback)
    const clear = tree.root.findByType(TouchableHighlight)

    buttons[0].props.onPress()
    await flushPromiseQueue()

    expect(extractText(tree.root.findByProps({ testID: "selectedOptions" }))).toContain(
      '{"paramName":"colors","displayText":"Example 1","paramValue":["example-1"]}'
    )

    clear.props.onPress()
    await flushPromiseQueue()

    expect(extractText(tree.root.findByProps({ testID: "selectedOptions" }))).toContain(
      '{"paramName":"colors","displayText":"All"}'
    )
  })
})

import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import {
  ArtworkFilterContext,
  ArtworkFilterContextState,
  reducer,
  useSelectedOptionsDisplay,
} from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { FilterParamName, InitialState } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React, { useReducer } from "react"
import { Text, TouchableWithoutFeedback, View } from "react-native"
import { useMultiSelect } from "../useMultiSelect"
import { getEssentialProps } from "./helper"

describe("useMultiSelect", () => {
  let state: ArtworkFilterContextState

  beforeEach(() => {
    state = {
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
    }
  })

  const OPTIONS = [
    { paramName: FilterParamName.colors, paramValue: "example-1", displayText: "Example 1" },
    { paramName: FilterParamName.colors, paramValue: "example-2", displayText: "Example 2" },
    { paramName: FilterParamName.colors, paramValue: "example-3", displayText: "Example 3" },
  ]

  const MockScreen: React.FC = () => {
    const { handleSelect, nextParamValues, isSelected } = useMultiSelect({
      options: OPTIONS,
      paramName: FilterParamName.colors,
    })

    const selectedOptions = useSelectedOptionsDisplay()

    return (
      <View>
        {OPTIONS.map((option) => (
          <TouchableWithoutFeedback
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

  const MockComponent = ({ initialState }: InitialState) => {
    const [filterState, dispatch] = useReducer(reducer, initialState)

    return (
      <ArtworkFilterContext.Provider value={{ state: filterState, dispatch }}>
        <MockScreen {...getEssentialProps()} />
      </ArtworkFilterContext.Provider>
    )
  }

  it("manages the nextParamValues", () => {
    const tree = renderWithWrappers(<MockComponent initialState={state} />)

    expect(extractText(tree.root.findByProps({ testID: "nextParamValues" }))).toEqual("[]")

    const buttons = tree.root.findAllByType(TouchableWithoutFeedback)

    buttons[0].props.onPress()

    expect(extractText(tree.root.findByProps({ testID: "nextParamValues" }))).toEqual('["example-1"]')

    buttons[2].props.onPress()

    expect(extractText(tree.root.findByProps({ testID: "nextParamValues" }))).toEqual('["example-1","example-3"]')

    buttons[0].props.onPress()

    expect(extractText(tree.root.findByProps({ testID: "nextParamValues" }))).toEqual('["example-3"]')
  })

  it("dispatches filter updates", async () => {
    const tree = renderWithWrappers(<MockComponent initialState={state} />)
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
})

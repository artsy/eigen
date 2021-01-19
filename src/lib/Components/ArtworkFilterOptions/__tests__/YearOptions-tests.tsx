import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { InitialState } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Theme } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { ArtworkFilterContext, ArtworkFilterContextState } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { ALLOW_EMPTY_CREATED_DATES_FILTER, OptionItem, YearOptionsScreen, YearText } from "../YearOptions"
import { getEssentialProps } from "./helper"

const dispatchMock = jest.fn()
describe("Year Options Screen", () => {
  let state: ArtworkFilterContextState

  beforeEach(() => {
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [
        {
          slice: "earliestCreatedYear",
          counts: [
            {
              name: "2010",
              count: 0,
              value: "2010",
            },
          ],
        },
        {
          slice: "latestCreatedYear",
          counts: [
            {
              name: "2021",
              count: 0,
              value: "2021",
            },
          ],
        },
      ],
      filterType: "auctionResult",
      counts: {
        total: null,
        followedArtists: null,
      },
    }
  })

  const MockYearOptionsScreen = ({ initialState }: InitialState) => {
    return (
      <Theme>
        <ArtworkFilterContext.Provider
          value={{
            state: initialState,
            dispatch: dispatchMock,
          }}
        >
          <YearOptionsScreen {...getEssentialProps()} />
        </ArtworkFilterContext.Provider>
      </Theme>
    )
  }

  it("renders propertly", () => {
    const tree = renderWithWrappers(<MockYearOptionsScreen initialState={state} />)
    expect(extractText(tree.root.findAllByType(YearText)[0])).toEqual("2010 - 2021")
    expect(extractText(tree.root.findAllByType(OptionItem)[0])).toEqual(ALLOW_EMPTY_CREATED_DATES_FILTER.displayText)
  })

  it("selects the right year range and option", () => {
    const tree = renderWithWrappers(<MockYearOptionsScreen initialState={state} />)

    const multiSlider = tree.root.findAllByType(MultiSlider)[0]
    const optionItem = tree.root.findAllByType(OptionItem)[0]

    act(() => {
      multiSlider.props.onValuesChangeFinish(["2011", "2020"])
      optionItem.props.onPress()
    })

    expect(dispatchMock).toBeCalledTimes(3)
    expect(dispatchMock).toHaveBeenNthCalledWith(1, {
      payload: { displayText: "2011", paramName: "earliestCreatedYear", paramValue: "2011" },
      type: "selectFilters",
    })
    expect(dispatchMock).toHaveBeenNthCalledWith(2, {
      payload: { displayText: "2020", paramName: "latestCreatedYear", paramValue: "2020" },
      type: "selectFilters",
    })
    expect(dispatchMock).toHaveBeenNthCalledWith(3, {
      payload: {
        displayText: ALLOW_EMPTY_CREATED_DATES_FILTER.displayText,
        paramName: ALLOW_EMPTY_CREATED_DATES_FILTER.paramName,
        paramValue: false,
      },
      type: "selectFilters",
    })
  })
})

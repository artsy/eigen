import MultiSlider from "@ptomasroos/react-native-multi-slider"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { InitialState } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Theme } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { ArtworkFilterContext, ArtworkFilterContextState } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { YearOptionsScreen, YearText } from "../YearOptions"
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
    renderWithWrappers(<MockYearOptionsScreen initialState={state} />)
  })

  it("renders the right year", () => {
    const tree = renderWithWrappers(<MockYearOptionsScreen initialState={state} />)
    expect(extractText(tree.root.findAllByType(YearText)[0])).toContain("2010 - 2021")
  })

  it("selects the right year", () => {
    const tree = renderWithWrappers(<MockYearOptionsScreen initialState={state} />)

    const multiSlider = tree.root.findAllByType(MultiSlider)[0]

    act(() => {
      multiSlider.props.onValuesChangeFinish(["2011", "2020"])
    })

    expect(dispatchMock).toBeCalledTimes(2)
    expect(dispatchMock).toHaveBeenNthCalledWith(1, {
      payload: { displayText: "2011", paramName: "earliestCreatedYear", paramValue: "2011" },
      type: "selectFilters",
    })
    expect(dispatchMock).toHaveBeenNthCalledWith(2, {
      payload: { displayText: "2020", paramName: "latestCreatedYear", paramValue: "2020" },
      type: "selectFilters",
    })
  })
})

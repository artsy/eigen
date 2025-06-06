import { Input } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import {
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
  getArtworkFiltersModel,
  useSelectedOptionsDisplay,
} from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { PriceRangeOptionsScreen } from "app/Components/ArtworkFilter/Filters/PriceRangeOptions"
import { getEssentialProps } from "app/Components/ArtworkFilter/Filters/helper"
import { Range } from "app/Components/ArtworkFilter/Filters/helpers"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/utils/tests/extractText"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { debounce } from "lodash"
import { Text } from "react-native"

const DEFAULT_RANGE: Range = {
  min: "*",
  max: "*",
}

jest.mock("lodash/debounce", () => jest.fn())

describe("CustomPriceInput", () => {
  it("renders without error", () => {
    renderWithWrappers(
      <Input value={DEFAULT_RANGE} onChange={jest.fn()} {...getEssentialProps()} />
    )
  })

  it("renders the min value", () => {
    renderWithWrappers(
      <Input
        testID="price-min-input"
        value={{ min: 444, max: 99999 }}
        onChange={jest.fn()}
        {...getEssentialProps()}
      />
    )

    expect(screen.getByTestId("price-min-input").props.value.min).toBe(444)
  })

  it("renders the max value", () => {
    renderWithWrappers(
      <Input
        testID="price-max-input"
        value={{ min: 444, max: 99999 }}
        onChange={jest.fn()}
        {...getEssentialProps()}
      />
    )

    expect(screen.getByTestId("price-max-input").props.value.max).toBe(99999)
  })

  it("calls onChange with the min when it is updated", () => {
    const handleChange = jest.fn()
    renderWithWrappers(
      <Input
        testID="price-min-input"
        value={DEFAULT_RANGE}
        onChangeText={handleChange}
        {...getEssentialProps()}
      />
    )

    fireEvent.changeText(screen.getByTestId("price-min-input"), "777")

    expect(handleChange).toHaveBeenCalledWith("777")
  })

  it("calls onChange with the max when it is updated", () => {
    const handleChange = jest.fn()
    renderWithWrappers(
      <Input
        testID="price-max-input"
        value={DEFAULT_RANGE}
        onChangeText={handleChange}
        {...getEssentialProps()}
      />
    )

    fireEvent.changeText(screen.getByTestId("price-max-input"), "12345")

    expect(handleChange).toHaveBeenLastCalledWith("12345")
  })
})

describe("PriceRangeOptions", () => {
  const INITIAL_DATA: ArtworkFiltersState = {
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

  const MockPriceRangeOptionsScreen = () => {
    const selected = useSelectedOptionsDisplay()
    return (
      <>
        <Text testID="debug">{JSON.stringify(selected)}</Text>
        <PriceRangeOptionsScreen {...getEssentialProps()} />
      </>
    )
  }

  const getTree = () => {
    return renderWithWrappers(
      <ArtworkFiltersStoreProvider
        runtimeModel={{
          ...getArtworkFiltersModel(),
          ...INITIAL_DATA,
        }}
      >
        <MockPriceRangeOptionsScreen />
      </ArtworkFiltersStoreProvider>
    )
  }

  beforeEach(() => {
    ;(debounce as jest.Mock).mockImplementation((func) => func)
  })

  it("renders the header and the inputs", () => {
    getTree()

    expect(screen.getByText("Choose Your Price Range")).toBeTruthy()

    expect(screen.getByTestId("price-min-input")).toBeTruthy()
    expect(screen.getByTestId("price-max-input")).toBeTruthy()
    expect(screen.getByTestId("slider")).toBeTruthy()
  })

  it("dispatches a custom price", () => {
    getTree()

    fireEvent.changeText(screen.getByTestId("price-min-input"), "1111")
    fireEvent.changeText(screen.getByTestId("price-max-input"), "98765")

    expect(extractText(screen.getByTestId("debug"))).toContain(
      `{"displayText":"$1,111–98,765","paramValue":"1111-98765","paramName":"priceRange"}`
    )
  })

  it("dispatches the last entered price", () => {
    getTree()

    fireEvent.changeText(screen.getByTestId("price-min-input"), "1111")
    fireEvent.changeText(screen.getByTestId("price-min-input"), "2222")

    expect(extractText(screen.getByTestId("debug"))).toContain(
      `{"displayText":"$2,222+","paramValue":"2222-*","paramName":"priceRange"}`
    )
  })

  it('should display the "clear" button if a custom price is entered', () => {
    getTree()

    fireEvent.changeText(screen.getByTestId("price-min-input"), "1111")

    expect(screen.getByText("Clear")).toBeTruthy()
  })

  it('should not display the "clear" button if the default value is selected', () => {
    getTree()

    expect(screen.queryByText("Clear")).toBeNull()
  })

  it('selected value should be cleared when the "clear" button is pressed', () => {
    getTree()
    const minInput = screen.getByTestId("price-min-input")

    fireEvent.changeText(minInput, "1111")
    fireEvent.press(screen.getByText("Clear"))

    expect(minInput.props.value).toBe("")
  })

  it("should not update input with a special character (included in android num-pad)", async () => {
    getTree()
    const minInput = screen.getByTestId("price-min-input")

    fireEvent.changeText(minInput, ".")

    expect(minInput).toHaveProp("value", "")

    fireEvent.changeText(minInput, " ")
    expect(minInput).toHaveProp("value", "")
    fireEvent.changeText(minInput, "-")
    expect(minInput).toHaveProp("value", "")
    fireEvent.changeText(minInput, ",")
    expect(minInput).toHaveProp("value", "")

    fireEvent.changeText(minInput, "1242135")
    screen.queryByDisplayValue("1242135")
  })

  describe("Recent price ranges analytics", () => {
    it("should correctly track analytics", () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          priceRange: "0-5000",
        },
        recentPriceRanges: {
          ranges: ["0-100"],
        },
      })

      getTree()

      fireEvent.press(screen.getByText("$0–100"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "selectedRecentPriceRange",
            "collector_profile_sourced": false,
            "context_module": "recentPriceRanges",
            "context_screen_owner_type": "artworkPriceFilter",
          },
        ]
      `)
    })

    it("should correctly track analytics when the collector profile-sourced price range is selected", () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          priceRange: "0-5000",
        },
        recentPriceRanges: {
          ranges: ["0-100"],
        },
      })

      getTree()

      fireEvent.press(screen.getByText("$0–5,000"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "action": "selectedRecentPriceRange",
            "collector_profile_sourced": true,
            "context_module": "recentPriceRanges",
            "context_screen_owner_type": "artworkPriceFilter",
          },
        ]
      `)
    })
  })
})

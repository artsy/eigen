import { fireEvent } from "@testing-library/react-native"
import { PriceRange } from "app/Components/ArtworkFilter/Filters/helpers"
import { RecentPriceRanges } from "app/Components/ArtworkFilter/RecentPriceRanges"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Recent price ranges", () => {
  it("should be rendered", () => {
    __globalStoreTestUtils__?.injectState({
      recentPriceRanges: {
        ranges: ["*-500", "1000-2000", "3000-*"],
      },
    })

    const { getByText } = renderWithWrappers(
      <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
    )

    expect(getByText("Recent price ranges")).toBeTruthy()
    expect(getByText("$0–500")).toBeTruthy()
    expect(getByText("$1,000–2,000")).toBeTruthy()
    expect(getByText("$3,000+")).toBeTruthy()
  })

  it("should pass the selected price range to onSelected callback", () => {
    const onSelectedMock = jest.fn()
    __globalStoreTestUtils__?.injectState({
      recentPriceRanges: {
        ranges: ["*-500", "1000-2000", "3000-*"],
      },
    })

    const { getByText } = renderWithWrappers(
      <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={onSelectedMock} />
    )

    fireEvent.press(getByText("$0–500"))

    expect(onSelectedMock).toBeCalledWith({
      value: "*-500",
      isCollectorProfileSources: false,
    })
  })

  it("should render the empty state if recent price ranges are empty", () => {
    __globalStoreTestUtils__?.injectState({
      recentPriceRanges: {
        ranges: [],
      },
    })

    const { getByText } = renderWithWrappers(
      <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
    )

    const emptyText = "Your recent price ranges will show here"
    expect(getByText(emptyText)).toBeTruthy()
  })

  describe("the collector profile-sourced price range", () => {
    it("should NOT be rendered if it is NOT specified", () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          priceRange: "*-*",
        },
        recentPriceRanges: {
          ranges: [],
        },
      })

      const { queryAllByLabelText } = renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(queryAllByLabelText("Price range pill")).toHaveLength(0)
    })

    it("should be rendered if it is specified", () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          priceRange: "0-5000",
        },
        recentPriceRanges: {
          ranges: [],
        },
      })

      const { queryByText } = renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(queryByText("$0–5,000")).toBeTruthy()
    })

    it("should be rendered 5 pills maximum (4 recently selected, 1 collector profile-sourced)", () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          priceRange: "0-5000",
        },
        recentPriceRanges: {
          ranges: ["0-100", "100-200", "200-300", "300-400", "400-500"],
        },
      })

      const { queryByText } = renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(queryByText("$0–100")).toBeTruthy()
      expect(queryByText("$100–200")).toBeTruthy()
      expect(queryByText("$200–300")).toBeTruthy()
      expect(queryByText("$300–400")).toBeTruthy()

      // collector profile-sourced
      expect(queryByText("$0–5,000")).toBeTruthy()

      expect(queryByText("$400–500")).toBeNull()
    })
  })

  describe("Clear button", () => {
    it("should NOT be rendered if recent price ranges are empty", () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: [],
        },
      })

      const { queryByText } = renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(queryByText("Clear")).toBeNull()
    })

    it("should NOT be rendered if only the collector profile-sourced price range is available", () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: [],
        },
        userPrefs: {
          priceRange: "0-5000",
        },
      })

      const { queryByText } = renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(queryByText("Clear")).toBeNull()
    })

    it("should be rendered if only the custom price ranges are available", () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: ["0-100", "100-200"],
        },
      })

      const { getByText } = renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(getByText("Clear")).toBeTruthy()
    })

    it("should be rendered if when the custom and the collector profile-sourced price ranges are available", () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: ["0-100", "100-200"],
        },
        userPrefs: {
          priceRange: "0-5000",
        },
      })

      const { getByText } = renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(getByText("Clear")).toBeTruthy()
    })

    it("should clear all recent price ranges when button is pressed", () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: ["*-500", "1000-2000", "3000-*"],
        },
      })

      const { queryByText, getByText } = renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      fireEvent.press(getByText("Clear"))

      expect(queryByText("$0–500")).toBeNull()
      expect(queryByText("$1,000–2,000")).toBeNull()
      expect(queryByText("$3,000+")).toBeNull()
    })
  })
})

const defaultSelectedRange: PriceRange = [100, 200]

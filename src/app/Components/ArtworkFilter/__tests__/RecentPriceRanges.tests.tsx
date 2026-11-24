import { fireEvent, screen } from "@testing-library/react-native"
import { PriceRange } from "app/Components/ArtworkFilter/Filters/helpers"
import { RecentPriceRanges } from "app/Components/ArtworkFilter/RecentPriceRanges"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Recent price ranges", () => {
  it("should be rendered", async () => {
    __globalStoreTestUtils__?.injectState({
      recentPriceRanges: {
        ranges: ["*-500", "1000-2000", "3000-*"],
      },
    })

    await renderWithWrappers(
      <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
    )

    expect(screen.getByText("Recent price ranges")).toBeTruthy()
    expect(screen.getByText("$0–500")).toBeTruthy()
    expect(screen.getByText("$1,000–2,000")).toBeTruthy()
    expect(screen.getByText("$3,000+")).toBeTruthy()
  })

  it("should pass the selected price range to onSelected callback", async () => {
    const onSelectedMock = jest.fn()
    __globalStoreTestUtils__?.injectState({
      recentPriceRanges: {
        ranges: ["*-500", "1000-2000", "3000-*"],
      },
    })

    await renderWithWrappers(
      <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={onSelectedMock} />
    )

    await fireEvent.press(screen.getByText("$0–500"))

    expect(onSelectedMock).toBeCalledWith({
      value: "*-500",
      isCollectorProfileSources: false,
    })
  })

  it("should render the empty state if recent price ranges are empty", async () => {
    __globalStoreTestUtils__?.injectState({
      recentPriceRanges: {
        ranges: [],
      },
    })

    await renderWithWrappers(
      <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
    )

    const emptyText = "Your recent price ranges will show here"
    expect(screen.getByText(emptyText)).toBeTruthy()
  })

  describe("the collector profile-sourced price range", () => {
    it("should NOT be rendered if it is NOT specified", async () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          priceRange: "*-*",
        },
        recentPriceRanges: {
          ranges: [],
        },
      })

      await renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(screen.queryAllByLabelText("Price range pill")).toHaveLength(0)
    })

    it("should be rendered if it is specified", async () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          priceRange: "0-5000",
        },
        recentPriceRanges: {
          ranges: [],
        },
      })

      await renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(screen.getByText("$0–5,000")).toBeTruthy()
    })

    it("should be rendered 5 pills maximum (4 recently selected, 1 collector profile-sourced)", async () => {
      __globalStoreTestUtils__?.injectState({
        userPrefs: {
          priceRange: "0-5000",
        },
        recentPriceRanges: {
          ranges: ["0-100", "100-200", "200-300", "300-400", "400-500"],
        },
      })

      await renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(screen.getByText("$0–100")).toBeTruthy()
      expect(screen.getByText("$100–200")).toBeTruthy()
      expect(screen.getByText("$200–300")).toBeTruthy()
      expect(screen.getByText("$300–400")).toBeTruthy()

      // collector profile-sourced
      expect(screen.getByText("$0–5,000")).toBeTruthy()

      expect(screen.queryByText("$400–500")).toBeNull()
    })
  })

  describe("Clear button", () => {
    it("should NOT be rendered if recent price ranges are empty", async () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: [],
        },
      })

      await renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(screen.queryByText("Clear")).toBeNull()
    })

    it("should NOT be rendered if only the collector profile-sourced price range is available", async () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: [],
        },
        userPrefs: {
          priceRange: "0-5000",
        },
      })

      await renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(screen.queryByText("Clear")).toBeNull()
    })

    it("should be rendered if only the custom price ranges are available", async () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: ["0-100", "100-200"],
        },
      })

      await renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(screen.getByText("Clear")).toBeTruthy()
    })

    it("should be rendered if when the custom and the collector profile-sourced price ranges are available", async () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: ["0-100", "100-200"],
        },
        userPrefs: {
          priceRange: "0-5000",
        },
      })

      await renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      expect(screen.getByText("Clear")).toBeTruthy()
    })

    it("should clear all recent price ranges when button is pressed", async () => {
      __globalStoreTestUtils__?.injectState({
        recentPriceRanges: {
          ranges: ["*-500", "1000-2000", "3000-*"],
        },
      })

      await renderWithWrappers(
        <RecentPriceRanges selectedRange={defaultSelectedRange} onSelected={jest.fn} />
      )

      await fireEvent.press(screen.getByText("Clear"))

      expect(screen.queryByText("$0–500")).toBeNull()
      expect(screen.queryByText("$1,000–2,000")).toBeNull()
      expect(screen.queryByText("$3,000+")).toBeNull()
    })
  })
})

const defaultSelectedRange: PriceRange = [100, 200]

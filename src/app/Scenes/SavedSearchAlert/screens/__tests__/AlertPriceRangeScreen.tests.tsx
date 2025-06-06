import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { AlertPriceRangeScreenQueryRenderer } from "app/Scenes/SavedSearchAlert/screens/AlertPriceRangeScreen"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

// We don't care about Histogram internals, but we want to know with what props it was rendered
jest.mock("@artsy/palette-mobile", () => {
  const { Text } = jest.requireActual("react-native")
  return {
    ...jest.requireActual("@artsy/palette-mobile"),
    Histogram: (props: any) => {
      return (
        <>
          <Text testID="histogramRange">{JSON.stringify(props.selectedRange)}</Text>
          <Text testID="histogramBars">{JSON.stringify(props.bars)}</Text>
        </>
      )
    },
  }
})

const goBackMock = jest.fn()
const navigationMock = {
  goBack: goBackMock,
}

describe("AlertPriceRangeScreen", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: () => {
      return (
        <SavedSearchStoreProvider
          runtimeModel={{
            ...savedSearchModel,
            attributes: attributes as SearchCriteriaAttributes,
            entity: savedSearchEntity,
          }}
        >
          <AlertPriceRangeScreenQueryRenderer
            route={null as any}
            navigation={navigationMock as any}
          />
        </SavedSearchStoreProvider>
      )
    },
  })

  it("renders PriceRangeContainer with the correct props", async () => {
    renderWithRelay({
      Artist: () => artist,
    })

    // wait for suspense to go away
    await waitForElementToBeRemoved(() => screen.queryByTestId("alert-price-range-spinner"))

    expect(screen.getByText("Set price range you are interested in")).toBeTruthy()

    const histogramRangeJson = screen.getByTestId("histogramRange")
    const histogramBarsJson = screen.getByTestId("histogramBars")
    // eslint-disable-next-line
    const histogramRange = JSON.parse(histogramRangeJson.children[0] as string)
    // eslint-disable-next-line
    const histogramBars = JSON.parse(histogramBarsJson.children[0] as string)

    expect(histogramRange[0]).toEqual(800)
    expect(histogramRange[1]).toEqual(1500)
    expect(histogramBars[0]).toEqual({ count: 1288, value: 0 })
    expect(histogramBars[1]).toEqual({ count: 483, value: 50000 })
  })

  it("Clear button clears input fields", async () => {
    renderWithRelay({
      Artist: () => artist,
    })

    // wait for suspense to go away
    await waitForElementToBeRemoved(() => screen.queryByTestId("alert-price-range-spinner"))

    const minInput = screen.getByTestId("price-min-input")
    const maxInput = screen.getByTestId("price-max-input")

    expect(minInput.props.value).toBe("800")
    expect(maxInput.props.value).toBe("1500")

    const clearButton = screen.getByText("Clear")
    fireEvent.press(clearButton)

    expect(minInput.props.value).toBe("")
    expect(maxInput.props.value).toBe("")
  })

  it("Set Price Range button sets price range attribute, navigates back and saves recent price range", async () => {
    renderWithRelay({
      Artist: () => artist,
    })

    // wait for suspense to go away
    await waitForElementToBeRemoved(() => screen.queryByTestId("alert-price-range-spinner"))

    const submitButton = screen.getByText("Set Price Range")
    fireEvent.press(submitButton)

    expect(goBackMock).toHaveBeenCalledTimes(1)
  })
})

const savedSearchEntity: SavedSearchEntity = {
  artists: [{ id: "artistID", name: "artistName" }],
  owner: {
    type: OwnerType.artist,
    id: "ownerId",
    slug: "ownerSlug",
  },
}
const attributes: SearchCriteriaAttributes = {
  artistIDs: ["artistID"],
  priceRange: "800-1500",
}

const artist = {
  filterArtworksConnection: {
    aggregations: [
      {
        slice: "SIMPLE_PRICE_HISTOGRAM",
        counts: [
          {
            count: 1288,
            name: "0",
            value: "0",
          },
          {
            count: 483,
            name: "50000",
            value: "50000",
          },
        ],
      },
    ],
  },
}

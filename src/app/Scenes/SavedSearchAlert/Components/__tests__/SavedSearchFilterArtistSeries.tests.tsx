import { OwnerType } from "@artsy/cohesion"
import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { SavedSearchFilterArtistSeriesQR } from "app/Scenes/SavedSearchAlert/Components/SavedSearchFilterArtistSeries"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const mono100Hex = "#000000"

describe("SavedSearchFilterArtistSeriesQR", () => {
  it("renders options when artist series present", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchFilterArtistSeriesQR />
        </SavedSearchStoreProvider>
      ),
    })
    renderWithRelay({
      FilterArtworksConnection: () => ({
        aggregations: [
          {
            slice: "ARTIST_SERIES",
            counts: [
              {
                name: "Series 1",
                value: "series-1",
              },
              {
                name: "Series 2",
                value: "series-2",
              },
            ],
          },
        ],
      }),
    })
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-skeleton"))
    expect(screen.getByText("Artist Series")).toBeOnTheScreen()
    expect(screen.getByText("Series 1")).toBeOnTheScreen()
    expect(screen.getByText("Series 2")).toBeOnTheScreen()
  })

  it("renders nothing when artist series are not present", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchFilterArtistSeriesQR />
        </SavedSearchStoreProvider>
      ),
    })
    renderWithRelay({
      FilterArtworksConnection: () => ({
        aggregations: [
          {
            slice: "ARTIST_SERIES",
            counts: [],
          },
        ],
      }),
    })
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-skeleton"))
    expect(screen.queryByText("Artist Series")).not.toBeOnTheScreen()
  })

  it("updates artist series selections", async () => {
    const initialDataWithSelection: SavedSearchModel = {
      ...initialData,
      attributes: {
        artistSeriesIDs: ["series-1"],
      },
    }

    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialDataWithSelection}>
          <SavedSearchFilterArtistSeriesQR />
        </SavedSearchStoreProvider>
      ),
    })
    renderWithRelay({
      FilterArtworksConnection: () => ({
        aggregations: [
          {
            slice: "ARTIST_SERIES",
            counts: [
              {
                name: "Series 1",
                value: "series-1",
              },
              {
                name: "Series 2",
                value: "series-2",
              },
            ],
          },
        ],
      }),
    })
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-skeleton"))

    expect(screen.getByText("Series 1")).not.toHaveStyle({ color: mono100Hex })
    expect(screen.getByText("Series 2")).toHaveStyle({ color: mono100Hex })

    fireEvent(screen.getByText("Series 1"), "onPress")
    fireEvent(screen.getByText("Series 2"), "onPress")

    expect(screen.getByText("Series 1")).toHaveStyle({ color: mono100Hex })
    expect(screen.getByText("Series 2")).not.toHaveStyle({ color: mono100Hex })
  })

  it("truncates when necessary", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchFilterArtistSeriesQR />
        </SavedSearchStoreProvider>
      ),
    })
    renderWithRelay({
      FilterArtworksConnection: () => ({
        aggregations: [
          {
            slice: "ARTIST_SERIES",
            counts: [
              { name: "Series 1", value: "series-1" },
              { name: "Series 2", value: "series-2" },
              { name: "Series 3", value: "series-3" },
              { name: "Series 4", value: "series-4" },
              { name: "Series 5", value: "series-5" },
              { name: "Series 6", value: "series-6" },
              { name: "Series 7", value: "series-7" },
              { name: "Series 8", value: "series-8" },
            ],
          },
        ],
      }),
    })
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-skeleton"))
    expect(screen.getByText("Artist Series")).toBeOnTheScreen()
    expect(screen.getByText("Series 1")).toBeOnTheScreen()
    expect(screen.getByText("Series 7")).toBeOnTheScreen()
    expect(screen.queryByText("Series 8")).not.toBeOnTheScreen()
    expect(screen.getByText("Show more")).toBeOnTheScreen()

    // toggling
    fireEvent(screen.getByText("Show more"), "onPress")
    expect(screen.getByText("Series 8")).toBeOnTheScreen()
    fireEvent(screen.getByText("Show less"), "onPress")
    expect(screen.queryByText("Series 8")).not.toBeOnTheScreen()
  })

  it("does not truncate when not necessary", async () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: () => (
        <SavedSearchStoreProvider runtimeModel={initialData}>
          <SavedSearchFilterArtistSeriesQR />
        </SavedSearchStoreProvider>
      ),
    })
    renderWithRelay({
      FilterArtworksConnection: () => ({
        aggregations: [
          {
            slice: "ARTIST_SERIES",
            counts: [
              { name: "Series 1", value: "series-1" },
              { name: "Series 2", value: "series-2" },
              { name: "Series 3", value: "series-3" },
            ],
          },
        ],
      }),
    })
    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-skeleton"))
    expect(screen.getByText("Artist Series")).toBeOnTheScreen()
    expect(screen.queryByText("Show more")).not.toBeOnTheScreen()
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {},
  entity: {
    artists: [{ id: "artistID", name: "Banksy" }],
    owner: {
      type: OwnerType.artist,
      id: "ownerId",
      slug: "ownerSlug",
    },
  },
}

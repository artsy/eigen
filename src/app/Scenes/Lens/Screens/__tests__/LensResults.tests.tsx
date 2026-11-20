import { bullet } from "@artsy/palette-mobile"
import { fireEvent, screen, waitFor, within } from "@testing-library/react-native"
import {
  FilterArtworksInput,
  LensResultsTestsQuery,
} from "__generated__/LensResultsTestsQuery.graphql"
import {
  filterArtworksParams,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { LensResultsScreen } from "app/Scenes/Lens/Screens/LensResults"
import { discardTempPhotos } from "app/Scenes/Lens/utils/discardTempPhotos"
import { goBack, navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { BackHandler } from "react-native"
import { graphql } from "react-relay"
import { Observable } from "relay-runtime"

// Render FastImage as a host element with a testID so the source it receives can be asserted on
jest.mock("@d11/react-native-fast-image", () => {
  const React = require("react")
  const { View } = require("react-native")
  const actual = jest.requireActual("@d11/react-native-fast-image")
  const MockFastImage = Object.assign(
    React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} testID="fast-image" />),
    {
      resizeMode: actual.default.resizeMode,
      priority: actual.default.priority,
      cacheControl: actual.default.cacheControl,
      preload: actual.default.preload,
    }
  )
  return { __esModule: true, ...actual, default: MockFastImage }
})

jest.mock("app/Scenes/Lens/utils/discardTempPhotos", () => ({
  discardTempPhotos: jest.fn(),
}))

const mockNavigate = jest.fn()
const photoUri = "file:///tmp/cropped.jpg"
let fromLibrary = false

describe("LensResults", () => {
  const { renderWithRelay } = setupTestWrapper<LensResultsTestsQuery>({
    Component: () => (
      <LensResultsScreen
        route={
          {
            key: "LensResults",
            name: "LensResults",
            params: { s3Bucket: "my-bucket", s3Key: "my-key", photoUri, fromLibrary },
          } as any
        }
        navigation={{ navigate: mockNavigate } as any}
      />
    ),
    query: graphql`
      query LensResultsTestsQuery($s3Bucket: String!, $s3Key: String!, $input: FilterArtworksInput)
      @relay_test_operation {
        ...LensResults_artworks @arguments(s3Bucket: $s3Bucket, s3Key: $s3Key, input: $input)
        ...LensResults_aggregations @arguments(s3Bucket: $s3Bucket, s3Key: $s3Key)
      }
    `,
    // Must match the screen's initial input so it reads these results from the store
    variables: {
      s3Bucket: "my-bucket",
      s3Key: "my-key",
      input: prepareFilterArtworksParamsForInput(
        filterArtworksParams([], "artwork")
      ) as FilterArtworksInput,
    },
  })

  beforeEach(() => {
    jest.clearAllMocks()
    fromLibrary = false
  })

  it("uses the artwork's standard link when a result is pressed", async () => {
    await renderWithRelay({
      Artwork: () => ({
        title: "Cool Painting",
        slug: "some-artwork-slug",
        href: "/artwork/some-artwork-slug",
      }),
    })

    await fireEvent.press(screen.getByTestId("artworkGridItem-Cool Painting"))

    expect(navigate).toHaveBeenCalledExactlyOnceWith("/artwork/some-artwork-slug")
  })

  it("returns to the previous screen when backing out", async () => {
    await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    await fireEvent.press(screen.getByLabelText("Back"))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("returns to the previous screen on Android hardware back too", async () => {
    const addEventListener = jest.spyOn(BackHandler, "addEventListener")

    await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    const handler = addEventListener.mock.calls
      .filter(([event]) => event === "hardwareBackPress")
      .at(-1)?.[1]

    // `true`, or the stack's own handler runs next and pops.
    // RN 0.86 passes a HardwareBackPressEvent to `hardwareBackPress` handlers.
    expect(handler?.({ type: "hardwareBackPress", timeStamp: Date.now() })).toBe(true)

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it("offers a way to search another photo when there are no matches", async () => {
    await renderWithRelay({ FilterArtworksConnection: () => ({ edges: [] }) })

    expect(screen.getByText("No matches found. Please try another photo.")).toBeOnTheScreen()
    expect(screen.getByText("Try another photo")).toBeOnTheScreen()

    await fireEvent.press(screen.getByTestId("lensResultsSearchByPhotoButton"))

    expect(mockNavigate).toHaveBeenCalledWith("LensCamera")
  })

  it("does not offer that button when there are matches to tap", async () => {
    await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    expect(screen.queryByTestId("lensResultsSearchByPhotoButton")).toBeNull()
  })

  it("shows the photo the search ran on", async () => {
    await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    const thumbnail = within(screen.getByTestId("lensResultsPhotoThumbnail")).getByTestId(
      "fast-image"
    )

    expect(thumbnail).toHaveProp("source", expect.objectContaining({ uri: photoUri }))
  })

  it("tells the user these are matches to their photo", async () => {
    await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    expect(screen.getByText("Great taste! Here are some matches to your photo")).toBeTruthy()
  })

  it("claims no matches when there are none", async () => {
    await renderWithRelay({ FilterArtworksConnection: () => ({ edges: [] }) })

    expect(
      screen.getByText("Unfortunately, we couldn't find great matches for that photo")
    ).toBeOnTheScreen()
    expect(screen.queryByText("Great taste! Here are some matches to your photo")).toBeNull()
  })

  it("deletes the searched photo on the way out", async () => {
    const { unmount } = await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

    expect(discardTempPhotos).not.toHaveBeenCalled()

    await unmount()

    expect(discardTempPhotos).toHaveBeenCalledWith([photoUri])
  })

  describe("filters", () => {
    const openFilters = async () => {
      await fireEvent.press(screen.getByTestId("lensResultsFilterButton"))
      await screen.findByText("Show Results")
    }

    const applyFramedFilter = async () => {
      await openFilters()
      await fireEvent.press(screen.getByText("Framed"))
      await fireEvent.press(await screen.findByText("Show only framed works"))
      await fireEvent.press(screen.getByText("Show Results"))
    }

    it("does not offer filters when the photo has no matches", async () => {
      await renderWithRelay({ FilterArtworksConnection: () => ({ edges: [] }) })

      expect(screen.queryByTestId("lensResultsFilterButton")).toBeNull()
    })

    it("shows how many filters are applied", async () => {
      const { mockResolveLastOperation } = await renderWithRelay({
        Artwork: () => ({ title: "Cool Painting" }),
      })

      await applyFramedFilter()
      // The filtered search suspends the results until it comes back
      await mockResolveLastOperation({ Artwork: () => ({ title: "Cool Painting" }) })

      const filterButton = await screen.findByTestId("lensResultsFilterButton")
      expect(within(filterButton).getByText(`${bullet} 1`)).toBeOnTheScreen()
      expect(filterButton).toHaveProp("accessibilityLabel", "Filter, 1 applied")
    })

    it("keeps the photo on screen and retries the filtered search when it fails", async () => {
      const { env, mockRejectLastOperation } = await renderWithRelay({
        Artwork: () => ({ title: "Cool Painting" }),
      })

      /**
       * `useArtworkFilters` rethrows a failed refetch inside Relay's `onComplete`. Production
       * Relay swallows that, but its dev handler rethrows it asynchronously, which fails the test.
       * The error still reaches the screen's error boundary through render, which is what this
       * test checks.
       */
      Observable.onUnhandledError(() => {})

      try {
        await applyFramedFilter()
        await mockRejectLastOperation(new Error("Network request failed"))

        expect(await screen.findByText("Unable to load")).toBeOnTheScreen()
        expect(screen.getByTestId("lensResultsPhotoThumbnail")).toBeOnTheScreen()

        await fireEvent.press(screen.getByLabelText("Retry"))

        await waitFor(() =>
          expect(env.mock.getMostRecentOperation().request.variables.input).toMatchObject({
            framed: true,
          })
        )
      } finally {
        // Relay's dev handler, so later tests still fail on unhandled errors
        Observable.onUnhandledError((error, isUncaughtThrownError) => {
          if (isUncaughtThrownError) {
            setTimeout(() => {
              throw error
            })
          } else {
            console.error("RelayObservable: Unhandled Error", error)
          }
        })
      }
    })

    it("offers filters without sort, since image search only supports one order", async () => {
      await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

      await openFilters()

      expect(screen.getByText("Rarity")).toBeOnTheScreen()
      expect(screen.getByText("Framed")).toBeOnTheScreen()
      expect(screen.queryByText("Sort By")).not.toBeOnTheScreen()
    })

    it("offers filters for the aggregations of the image's matches", async () => {
      await renderWithRelay({
        Artwork: () => ({ title: "Cool Painting" }),
        FilterArtworksConnection: () => ({
          aggregations: [{ slice: "MEDIUM", counts: [{ name: "Painting", value: "painting" }] }],
        }),
      })

      await openFilters()

      expect(screen.getByText("Medium")).toBeOnTheScreen()
    })

    it("keeps searching by the same image when filters are applied", async () => {
      const { env } = await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

      await applyFramedFilter()

      const { variables } = env.mock.getMostRecentOperation().request
      expect(variables).toMatchObject({
        s3Bucket: "my-bucket",
        s3Key: "my-key",
        input: expect.objectContaining({ framed: true, sort: "-decayed_merch" }),
      })
    })

    it("reports the filter change against the image search", async () => {
      await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

      await applyFramedFilter()

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action_type: "commercialFilterParamsChanged",
          context_screen: "SearchByImage",
          context_screen_owner_type: "searchByImage",
        })
      )
    })

    it("offers to clear filters, not to try another photo, when filters match nothing", async () => {
      const { mockResolveLastOperation } = await renderWithRelay({
        Artwork: () => ({ title: "Cool Painting" }),
      })

      await applyFramedFilter()
      await mockResolveLastOperation({ FilterArtworksConnection: () => ({ edges: [] }) })

      expect(await screen.findByText("No results found for these filters.")).toBeOnTheScreen()
      expect(screen.getByText("Great taste! Here are some matches to your photo")).toBeOnTheScreen()
      expect(screen.queryByTestId("lensResultsSearchByPhotoButton")).toBeNull()

      await fireEvent.press(screen.getByTestId("lensResultsClearFiltersButton"))

      // Unfiltered results are already in the store, so they come back without a new request
      expect(await screen.findByTestId("artworkGridItem-Cool Painting")).toBeOnTheScreen()
    })
  })

  describe("tracking", () => {
    it("reports a search that found matches", async () => {
      await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

      expect(mockTrackEvent).toHaveBeenCalledExactlyOnceWith({
        action: "searchedByImageWithResults",
        context_owner_type: "searchByImage",
        photo_source: "camera",
      })
    })

    it("reports a search that found nothing", async () => {
      await renderWithRelay({ FilterArtworksConnection: () => ({ edges: [] }) })

      expect(mockTrackEvent).toHaveBeenCalledExactlyOnceWith({
        action: "searchedByImageWithNoResults",
        context_owner_type: "searchByImage",
        photo_source: "camera",
      })
    })

    it("separates a photo picked from the library from a capture", async () => {
      fromLibrary = true

      await renderWithRelay({ Artwork: () => ({ title: "Cool Painting" }) })

      expect(mockTrackEvent).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ photo_source: "photo_library" })
      )
    })

    it("attributes a tapped result to the image search, not to text search", async () => {
      await renderWithRelay({ Artwork: () => ({ title: "Cool Painting", slug: "cool-painting" }) })

      await fireEvent.press(screen.getByTestId("artworkGridItem-Cool Painting"))

      expect(mockTrackEvent).toHaveBeenLastCalledWith(
        expect.objectContaining({
          action: "tappedMainArtworkGrid",
          context_module: "artworkGrid",
          context_screen: "searchByImage",
          context_screen_owner_type: "searchByImage",
          destination_screen_owner_type: "artwork",
        })
      )
    })
  })
})

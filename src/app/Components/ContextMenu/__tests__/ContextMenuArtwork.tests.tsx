import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtworkRailCardTestsQuery } from "__generated__/ArtworkRailCardTestsQuery.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { navigate } from "app/system/navigation/navigate"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Platform } from "react-native"
import { graphql } from "react-relay"

jest.mock("app/system/flags/hooks/useExperimentFlag", () => ({
  useExperimentFlag: jest.fn(),
}))

describe("ContextMenuArtwork", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkRailCardTestsQuery>({
    Component: (props) => {
      if (!props.artwork) return null

      return <ArtworkRailCard {...props} artwork={props.artwork} testID="artwork-card" />
    },
    query: graphql`
      query ContextMenuArtworkTestsQuery @relay_test_operation {
        artwork(id: "the-artwork") {
          ...ArtworkRailCard_artwork
        }
      }
    `,
  })

  describe("on Android", () => {
    beforeEach(() => {
      Platform.OS = "android"
    })

    it("shows context menu on long press", async () => {
      renderWithRelay()

      const artworkCard = screen.getByTestId("android-context-menu-trigger")

      fireEvent(artworkCard, "onLongPress")

      await waitFor(() => {
        expect(screen.getByText("Create alert")).toBeOnTheScreen()
      })
      await waitFor(() => {
        expect(screen.getByText("Share")).toBeOnTheScreen()
      })
    })

    describe("Find similar", () => {
      const mockUseExperimentFlag = useExperimentFlag as jest.Mock

      afterEach(() => {
        mockUseExperimentFlag.mockReset()
        __globalStoreTestUtils__?.reset()
      })

      it("is not offered when Artsy Lens is off", async () => {
        mockUseExperimentFlag.mockReturnValue(false)
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtsyLens: true })

        renderWithRelay()

        fireEvent(screen.getByTestId("android-context-menu-trigger"), "onLongPress")

        await waitFor(() => {
          expect(screen.getByText("Share")).toBeOnTheScreen()
        })
        expect(screen.queryByText("Find similar")).not.toBeOnTheScreen()
      })

      it("navigates to similar artworks when Artsy Lens is on", async () => {
        mockUseExperimentFlag.mockImplementation((key) => key === "onyx_artsy-lens")
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableArtsyLens: true })

        renderWithRelay({ Artwork: () => ({ slug: "the-artwork-slug" }) })

        fireEvent(screen.getByTestId("android-context-menu-trigger"), "onLongPress")

        await waitFor(() => {
          expect(screen.getByText("Find similar")).toBeOnTheScreen()
        })

        fireEvent.press(screen.getByText("Find similar"))

        await waitFor(() => {
          expect(navigate).toHaveBeenCalledWith("/artwork/the-artwork-slug/similar")
        })
        expect(mockTrackEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            action: "tappedSearchByImage",
            context_module: "longPressContextMenu",
            type: "find_similar",
          })
        )
      })
    })
  })
})

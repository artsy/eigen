import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { ArtworkRailCardTestsQuery } from "__generated__/ArtworkRailCardTestsQuery.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Platform } from "react-native"
import { graphql } from "react-relay"

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
  })
})

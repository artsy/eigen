import { fireEvent, screen } from "@testing-library/react-native"
import { ArtworkRailCardCTAsTestsQuery } from "__generated__/ArtworkRailCardCTAsTestsQuery.graphql"
import { ArtworkRailCardCTAs } from "app/Components/ArtworkRail/ArtworkRailCardCTAs"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkRailCardCTAs", () => {
  const { renderWithRelay } = setupTestWrapper<ArtworkRailCardCTAsTestsQuery>({
    Component: (props) => <ArtworkRailCardCTAs {...props} artwork={props.artwork!} />,
    query: graphql`
      query ArtworkRailCardCTAsTestsQuery @relay_test_operation {
        artwork(id: "the-artwork") {
          ...ArtworkRailCardCTAs_artwork
        }
      }
    `,
  })

  describe("save artwork when AREnableRedesignSaveCTA is enebled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableRedesignSaveCTA: true,
      })
    })

    it("does not show heart icon when showSaveIcon is set to false", () => {
      renderWithRelay({ Artwork: () => artwork }, { showSaveIcon: false })

      expect(screen.queryByTestId("save-artwork")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-empty")).not.toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-filled")).not.toBeOnTheScreen()
    })

    it("saving artworks works when showSaveIcon is set to true", () => {
      renderWithRelay({ Artwork: () => artwork }, { showSaveIcon: true })

      expect(screen.getByTestId("heart-icon-empty")).toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-filled")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("save-artwork"))

      expect(screen.getByTestId("heart-icon-filled")).toBeOnTheScreen()
      expect(screen.queryByTestId("heart-icon-empty")).not.toBeOnTheScreen()
    })
  })

  describe("follow artwork when AREnableAddFollowCTA is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableAddFollowCTA: true,
      })
    })

    it("following an artist works", () => {
      renderWithRelay({
        Artwork: () => artwork,
      })

      expect(screen.getByTestId("follow-icon-empty")).toBeOnTheScreen()
      expect(screen.queryByTestId("follow-icon-filled")).not.toBeOnTheScreen()

      fireEvent.press(screen.getByTestId("follow-artist"))

      expect(screen.getByTestId("follow-icon-filled")).toBeOnTheScreen()
      expect(screen.queryByTestId("follow-icon-empty")).not.toBeOnTheScreen()
    })
  })
})

const artwork = {
  customArtworkLists: {
    totalCount: 0,
  },
  collectorSignals: {
    auction: {
      lotWatcherCount: 10,
    },
  },
  sale: {
    isAuction: true,
  },
}

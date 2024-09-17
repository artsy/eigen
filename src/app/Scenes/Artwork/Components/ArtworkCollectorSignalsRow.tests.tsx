import { screen } from "@testing-library/react-native"
import { ArtworkCollectorSignalsRow } from "app/Scenes/Artwork/Components/ArtworkCollectorSignalsRow"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkCollectorSignalsRow", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArtworkCollectorSignalsRow,
    query: graphql`
      query ArtworkCollectorSignalsRowTestsQuery @relay_test_operation {
        artwork(id: "example") {
          ...ArtworkCollectorSignalsRow_artwork
        }
      }
    `,
  })

  describe("when EnableCuratorsPicksAndInterestSignals flag is disabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableCuratorsPicksAndInterestSignals: false,
      })
    })

    it("renders showing now signal even when curator pic and increased interest is present", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            curatorsPick: true,
            increasedInterest: true,
            runningShow: {
              name: "Saenger Galería at The Armory Show 2024",
              href: "/show/saenger-galeria-saenger-galeria-at-the-armory-show-2024-1",
              startAt: "2024-08-28T00:00:00+00:00",
              endAt: "2024-09-22T00:00:00+00:00",
            },
          },
        }),
      })

      expect(screen.getByText(/Showing now/)).toBeOnTheScreen()
      expect(screen.queryByText(/Curators’ Pick/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Increased Interest/)).not.toBeOnTheScreen()
    })

    it("renders showing now signal when running show is present", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            runningShow: {
              name: "Saenger Galería at The Armory Show 2024",
              href: "/show/saenger-galeria-saenger-galeria-at-the-armory-show-2024-1",
              startAt: "2024-08-28T00:00:00+00:00",
              endAt: "2024-09-22T00:00:00+00:00",
            },
          },
        }),
      })

      expect(screen.getByText(/Showing now/)).toBeOnTheScreen()
      expect(screen.getByText(/Saenger Galería at The Armory Show 2024/)).toBeOnTheScreen()
    })

    it("doesn't render if running show is not present even if others present", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            runningShow: null,
            curatorsPick: true,
            increasedInterest: true,
          },
        }),
      })

      expect(screen.queryByText(/Curators’ Pick/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Increased Interest/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Showing now/)).not.toBeOnTheScreen()
    })
  })

  describe("when EnableCuratorsPicksAndInterestSignals flag is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({
        AREnableCuratorsPicksAndInterestSignals: true,
      })
    })

    it("does not render signals if they are not present", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            curatorsPick: false,
            increasedInterest: false,
            runningShow: null,
          },
        }),
      })

      expect(screen.queryByText(/Curators’ Pick/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Increased Interest/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Showing now/)).not.toBeOnTheScreen()
    })

    it("renders showing now signal when running show is present and other signals are not", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            curatorsPick: false,
            increasedInterest: false,
            runningShow: {
              name: "Saenger Galería at The Armory Show 2024",
              href: "/show/saenger-galeria-saenger-galeria-at-the-armory-show-2024-1",
              startAt: "2024-08-28T00:00:00+00:00",
              endAt: "2024-09-22T00:00:00+00:00",
            },
          },
        }),
      })

      expect(screen.queryByText(/Curators’ Pick/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Increased Interest/)).not.toBeOnTheScreen()
      expect(screen.getByText(/Showing now/)).toBeOnTheScreen()
      expect(screen.getByText(/Saenger Galería at The Armory Show 2024/)).toBeOnTheScreen()
    })

    it("doesn't render showing now if running show is present but other signals are present as well", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            curatorsPick: true,
            increasedInterest: false,
            runningShow: {
              name: "Saenger Galería at The Armory Show 2024",
              href: "/show/saenger-galeria-saenger-galeria-at-the-armory-show-2024-1",
              startAt: "2024-08-28T00:00:00+00:00",
              endAt: "2024-09-22T00:00:00+00:00",
            },
          },
        }),
      })

      expect(screen.queryByText(/Showing now/)).not.toBeOnTheScreen()
    })

    it("renders the curators pick signal", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            increasedInterest: false,
            curatorsPick: true,
          },
        }),
      })

      expect(screen.getByText(/Curators’ Pick/)).toBeOnTheScreen()
      expect(screen.getByText(/Hand selected by Artsy curators this week/)).toBeOnTheScreen()
      expect(screen.queryByText(/Increased Interest/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Showing now/)).not.toBeOnTheScreen()
    })

    it("renders the curator's pick signal even when there's an increased interest signal", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            increasedInterest: true,
            curatorsPick: true,
          },
        }),
      })

      expect(screen.getByText(/Curators’ Pick/)).toBeOnTheScreen()
      expect(screen.getByText(/Hand selected by Artsy curators this week/)).toBeOnTheScreen()
      expect(screen.queryByText(/Increased Interest/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Showing now/)).not.toBeOnTheScreen()
    })

    it("renders the increased interest signal", () => {
      renderWithRelay({
        Artwork: () => ({
          collectorSignals: {
            increasedInterest: true,
            curatorsPick: false,
          },
        }),
      })

      expect(screen.getByText(/Increased Interest/)).toBeOnTheScreen()
      expect(screen.getByText(/Based on collector activity in the past 14 days/)).toBeOnTheScreen()
      expect(screen.queryByText(/Curators’ Pick/)).not.toBeOnTheScreen()
      expect(screen.queryByText(/Showing now/)).not.toBeOnTheScreen()
    })
  })
})

import { screen } from "@testing-library/react-native"
import { ArtworkCuratorsPickIncreasedInterestCollectorSignal } from "app/Scenes/Artwork/Components/ArtworkCuratorsPickIncreasedInterestCollectorSignal"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkCuratorsPickIncreasedInterestCollectorSignal", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArtworkCuratorsPickIncreasedInterestCollectorSignal,
    query: graphql`
      query ArtworkCuratorsPickIncreasedInterestCollectorSignalTestsQuery @relay_test_operation {
        artwork(id: "example") {
          ...ArtworkCuratorsPickIncreasedInterestCollectorSignal_artwork
        }
      }
    `,
  })

  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCuratorsPicksAndInterestSignals: true })
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

    expect(screen.getByText("Increased Interest")).toBeOnTheScreen()
    expect(screen.getByText("Based on collector activity in the past 14 days")).toBeOnTheScreen()
  })

  it("renders the increased interest signal even when there's a curator's pick signal", () => {
    renderWithRelay({
      Artwork: () => ({
        collectorSignals: {
          increasedInterest: true,
          curatorsPick: true,
        },
      }),
    })

    expect(screen.getByText("Increased Interest")).toBeOnTheScreen()
    expect(screen.getByText("Based on collector activity in the past 14 days")).toBeOnTheScreen()
    expect(screen.queryByText("Curators’ Pick")).not.toBeOnTheScreen()
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

    expect(screen.getByText("Curators’ Pick")).toBeOnTheScreen()
    expect(screen.getByText("Hand selected by Artsy curators this week")).toBeOnTheScreen()
  })

  it("doesn't render if there are no signals", () => {
    renderWithRelay({
      Artwork: () => ({
        collectorSignals: {
          increasedInterest: false,
          curatorsPick: false,
        },
      }),
    })

    expect(screen.queryByText("Increased Interest")).not.toBeOnTheScreen()
    expect(screen.queryByText("Curators’ Pick")).not.toBeOnTheScreen()
  })
})

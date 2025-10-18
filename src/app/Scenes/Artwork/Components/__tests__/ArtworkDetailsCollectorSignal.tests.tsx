import { screen } from "@testing-library/react-native"
import { ArtworkDetailsCollectorSignal } from "app/Scenes/Artwork/Components/ArtworkDetailsCollectorSignal"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkDetailsCollectorSignal", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArtworkDetailsCollectorSignal,
    query: graphql`
      query ArtworkDetailsCollectorSignalTestsQuery @relay_test_operation {
        artwork(id: "example") {
          ...useCollectorSignal_artwork
        }
      }
    `,
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

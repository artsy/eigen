import { screen } from "@testing-library/react-native"
import { ArtworkShowingNowCollectorSignal } from "app/Scenes/Artwork/Components/ArtworkShowingNowCollectorSignal"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtworkShowingNowCollectorSignal", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArtworkShowingNowCollectorSignal,
    query: graphql`
      query ArtworkShowingNowCollectorSignalTestsQuery @relay_test_operation {
        artwork(id: "example") {
          ...ArtworkShowingNowCollectorSignal_artwork
        }
      }
    `,
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

  it("doesn't render if running show is not present", () => {
    renderWithRelay({
      Artwork: () => ({
        collectorSignals: {
          runningShow: null,
        },
      }),
    })

    expect(screen.queryByText(/Showing now/)).not.toBeOnTheScreen()
  })
})

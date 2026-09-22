import { screen } from "@testing-library/react-native"
import { ArtistKindPills } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistPreview/ArtistKindPills"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtistKindPills", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ArtistKindPills,
    query: graphql`
      query ArtistKindPillsTestsQuery @relay_test_operation {
        artist(id: "artist-id") {
          ...ArtistKindPills_artist
        }
      }
    `,
  })

  it("renders a pill for an insight with entities", () => {
    renderWithRelay({
      ArtistInsight: () => ({
        label: "Collected by a major institution",
        entities: ["A fancy museum"],
        description: null,
      }),
    })

    expect(screen.getByText("Collected by a major institution")).toBeOnTheScreen()
  })

  it("renders a pill for an insight with a description", () => {
    renderWithRelay({
      ArtistInsight: () => ({
        label: "Critically acclaimed",
        entities: [],
        description: "Recognized by bigwigs",
      }),
    })

    expect(screen.getByText("Critically acclaimed")).toBeOnTheScreen()
  })

  it("renders nothing for an insight with neither entities nor a description", () => {
    renderWithRelay({
      ArtistInsight: () => ({
        label: "Collected by nobody",
        entities: [],
        description: null,
      }),
    })

    expect(screen.queryByText("Collected by nobody")).not.toBeOnTheScreen()
  })
})

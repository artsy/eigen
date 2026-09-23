import { Pill } from "@artsy/palette-mobile"
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

  it("renders a pill for an artist with insights", () => {
    renderWithRelay({
      Artist: () => ({
        insights: [
          {
            label: "Fancy pants",
            entities: ["A fancy museum"],
          },
        ],
      }),
    })

    expect(screen.UNSAFE_queryAllByType(Pill)).toHaveLength(1)
    expect(screen.getByText("Fancy pants")).toBeOnTheScreen()
  })

  it("renders no pill for an artist with no insights", () => {
    renderWithRelay({
      Artist: () => ({
        insights: [],
      }),
    })

    expect(screen.UNSAFE_queryAllByType(Pill)).toHaveLength(0)
  })
})

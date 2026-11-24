import { screen } from "@testing-library/react-native"
import { ArtistKindPills } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModalArtistPreview/ArtistKindPills"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@artsy/palette-mobile", () => {
  const { Text } = jest.requireActual("react-native")
  return {
    ...jest.requireActual("@artsy/palette-mobile"),
    Pill: ({ children }: { children: React.ReactNode }) => <Text testID="pill">{children}</Text>,
  }
})

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

  it("renders a pill for an artist with insights", async () => {
    await renderWithRelay({
      Artist: () => ({
        insights: [
          {
            label: "Fancy pants",
            entities: ["A fancy museum"],
          },
        ],
      }),
    })

    expect(screen.getAllByTestId("pill")).toHaveLength(1)
    expect(screen.getByText("Fancy pants")).toBeOnTheScreen()
  })

  it("renders no pill for an artist with no insights", async () => {
    await renderWithRelay({
      Artist: () => ({
        insights: [],
      }),
    })

    expect(screen.queryAllByTestId("pill")).toHaveLength(0)
  })
})

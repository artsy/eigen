import { fireEvent, screen } from "@testing-library/react-native"
import { TagArtworksTestsQuery } from "__generated__/TagArtworksTestsQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { TagArtworksPaginationContainer } from "app/Scenes/Tag/TagArtworks"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("TagArtworks", () => {
  const { renderWithRelay } = setupTestWrapper<TagArtworksTestsQuery>({
    Component: (props) => (
      <ArtworkFiltersStoreProvider>
        <TagArtworksPaginationContainer tag={props.tag!} />
      </ArtworkFiltersStoreProvider>
    ),
    query: graphql`
      query TagArtworksTestsQuery($input: FilterArtworksInput) @relay_test_operation {
        tag(id: "cat") {
          ...TagArtworks_tag @arguments(input: $input)
        }
      }
    `,
  })

  it("renders filter header", async () => {
    renderWithRelay({})

    expect(screen.getByText("Sort & Filter")).toBeOnTheScreen()
  })

  it("renders artworks grid", () => {
    renderWithRelay({
      FilterArtworksConnection() {
        return {
          counts: {
            total: 10,
          },
        }
      },
    })

    expect(screen.getByText(/mock-value-for-field-"title"/)).toBeOnTheScreen()
    expect(screen.getByText("Showing 10 works")).toBeOnTheScreen()
  })

  it("renders empty artworks grid view", async () => {
    renderWithRelay({
      FilterArtworksConnection() {
        return {
          counts: {
            total: 0,
          },
          edges: [],
        }
      },
    })

    expect(
      screen.getByText("There aren’t any works available in the tag at this time.")
    ).toBeOnTheScreen()
  })

  it("renders empty message when artworks is empty", () => {
    renderWithRelay({
      FilterArtworksConnection() {
        return {
          edges: [],
        }
      },
    })

    expect(
      screen.getByText("There aren’t any works available in the tag at this time.")
    ).toBeTruthy()
  })

  it("opens the filter modal when pressing sort & filter", async () => {
    renderWithRelay({})

    expect(screen.queryByText("Show Results")).not.toBeOnTheScreen()
    fireEvent.press(screen.getByText("Sort & Filter"))

    expect(screen.getByText("Show Results")).toBeOnTheScreen()
    expect(screen.getByText("Ways to Buy")).toBeOnTheScreen()
    expect(screen.getByText("Rarity")).toBeOnTheScreen()
    expect(screen.getByText("Artists")).toBeOnTheScreen()
    expect(screen.getByText("Sort By")).toBeOnTheScreen()
  })
})

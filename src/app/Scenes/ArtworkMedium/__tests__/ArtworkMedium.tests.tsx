import { screen } from "@testing-library/react-native"
import { ArtworkMediumQuery } from "__generated__/ArtworkMediumQuery.graphql"
import {
  ARTWORK_MEDIUM_QUERY,
  ArtworkMediumFragmentContainer,
} from "app/Scenes/ArtworkMedium/ArtworkMedium"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"

const { renderWithRelay } = setupTestWrapper<ArtworkMediumQuery>({
  Component: ({ artwork }) => <ArtworkMediumFragmentContainer artwork={artwork!} />,
  query: ARTWORK_MEDIUM_QUERY,
  variables: { id: "artwork-id" },
})

describe("ArtworkMedium", () => {
  it("renders correctly", async () => {
    await renderWithRelay({
      ArtworkMedium: () => ({
        name: "Painting",
        longDescription: "Paint on a support, presumably.",
      }),
    })

    expect(screen.getByText("Painting")).toBeOnTheScreen()
    expect(screen.getByText("Paint on a support, presumably.")).toBeOnTheScreen()
    expect(
      screen.getByText(
        "Artsy has nineteen medium types. Medium types are categories that define the material or format used to create the artwork."
      )
    ).toBeOnTheScreen()
  })
})

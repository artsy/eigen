import { ArtworkListsProvider } from "app/Components/ArtworkLists/ArtworkListsContext"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { SelectArtworkListsForArtworkView } from "./SelectArtworkListsForArtworkView"

describe("SelectArtworkListsForArtworkView", () => {
  const TestRenderer = () => {
    return (
      <ArtworkListsProvider>
        <SelectArtworkListsForArtworkView />
      </ArtworkListsProvider>
    )
  }

  it("should display `Create New List` button", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    expect(getByText("Create New List")).toBeTruthy()
  })

  it("should display `Save` button", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)

    expect(getByText("Save")).toBeTruthy()
  })
})

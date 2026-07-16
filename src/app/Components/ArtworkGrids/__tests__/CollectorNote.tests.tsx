import { screen } from "@testing-library/react-native"
import { CollectorNote } from "app/Components/ArtworkGrids/CollectorNote"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CollectorNote", () => {
  it("renders the note text and label", () => {
    renderWithWrappers(<CollectorNote note="Chosen for its bold use of color" />)

    expect(screen.getByText("Curator’s note")).toBeOnTheScreen()
    expect(screen.getByText("Chosen for its bold use of color")).toBeOnTheScreen()
  })

  it("renders nothing when the note is empty", () => {
    renderWithWrappers(<CollectorNote note="" />)

    expect(screen.queryByText("Curator’s note")).not.toBeOnTheScreen()
  })
})

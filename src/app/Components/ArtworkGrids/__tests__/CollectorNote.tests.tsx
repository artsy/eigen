import { screen } from "@testing-library/react-native"
import { CollectorNote } from "app/Components/ArtworkGrids/CollectorNote"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CollectorNote", () => {
  it("renders a tappable Curator's note label", () => {
    renderWithWrappers(<CollectorNote note="Chosen for its bold use of color" />)

    // The inline representation is a compact label; the full note lives in the
    // bottom sheet that opens on tap.
    expect(screen.getByText("Curator’s note")).toBeOnTheScreen()
    expect(screen.getByLabelText("Read the curator’s note")).toBeOnTheScreen()
  })

  it("renders nothing when the note is empty", () => {
    renderWithWrappers(<CollectorNote note="" />)

    expect(screen.queryByText("Curator’s note")).not.toBeOnTheScreen()
  })
})

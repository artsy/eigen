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

  it("shows a Read more cue for long notes but not short ones", () => {
    const { rerender } = renderWithWrappers(<CollectorNote note="A short note." />)
    expect(screen.queryByText("Read more")).not.toBeOnTheScreen()

    rerender(<CollectorNote note={"A much longer curator note ".repeat(6)} />)
    expect(screen.getByText("Read more")).toBeOnTheScreen()
  })
})

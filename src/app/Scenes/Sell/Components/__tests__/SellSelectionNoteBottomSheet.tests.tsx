import { fireEvent, screen } from "@testing-library/react-native"
import {
  SellSelectionNoteBottomSheet,
  SellSelectionWork,
} from "app/Scenes/Sell/Components/SellSelectionNoteBottomSheet"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const sellableWork: SellSelectionWork = {
  internalID: "id-a2",
  artistNames: "Artist A",
  title: "Sellable Work",
  thumbnail: null,
}
const unsellableWork: SellSelectionWork = {
  internalID: "id-c3",
  artistNames: "Artist B",
  title: "Unsellable Work",
  thumbnail: null,
}

const renderSheet = (props: Partial<React.ComponentProps<typeof SellSelectionNoteBottomSheet>>) =>
  renderWithWrappers(
    <SellSelectionNoteBottomSheet
      visible
      sellableWorks={[sellableWork]}
      unsellableWorks={[unsellableWork]}
      selectedWorkIDs={["id-a2", "id-c3"]}
      onToggleWork={jest.fn()}
      onProceed={jest.fn()}
      onDismiss={jest.fn()}
      {...props}
    />
  )

describe("SellSelectionNoteBottomSheet", () => {
  it("lists the works we can and can’t sell", () => {
    renderSheet({})

    expect(screen.getByText(/We can help you with 1\/2 of the works/)).toBeOnTheScreen()
    expect(screen.getByRole("checkbox", { name: "Artist A, Sellable Work" })).toBeChecked()
    expect(screen.getByText("Not able to sell yet")).toBeOnTheScreen()
    expect(screen.getByText("Unsellable Work")).toBeOnTheScreen()
    expect(screen.getAllByRole("checkbox")).toHaveLength(1)
  })

  it("hides the sellable section when nothing can be sold", () => {
    renderSheet({ sellableWorks: [], selectedWorkIDs: ["id-c3"] })

    expect(screen.queryByText("Works we can sell")).not.toBeOnTheScreen()
    expect(screen.getByText("Proceed to Listing")).toBeDisabled()
  })

  it("reports ticks and proceeds while a sellable work is ticked", () => {
    const onToggleWork = jest.fn()
    const onProceed = jest.fn()
    renderSheet({ onToggleWork, onProceed })

    fireEvent.press(screen.getByRole("checkbox", { name: "Artist A, Sellable Work" }))
    expect(onToggleWork).toHaveBeenCalledWith("id-a2")

    fireEvent.press(screen.getByText("Proceed to Listing"))
    expect(onProceed).toHaveBeenCalledTimes(1)
  })

  it("disables Proceed once every sellable work is unticked", () => {
    renderSheet({ selectedWorkIDs: ["id-c3"] })

    expect(screen.getByRole("checkbox", { name: "Artist A, Sellable Work" })).not.toBeChecked()
    expect(screen.getByText("Proceed to Listing")).toBeDisabled()
  })
})

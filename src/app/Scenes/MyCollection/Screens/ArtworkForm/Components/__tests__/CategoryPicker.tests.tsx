import { fireEvent, screen } from "@testing-library/react-native"
import { CategoryPicker } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/CategoryPicker"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CategoryPicker", () => {
  it("displays and selects the correct category", async () => {
    const handleChangeMock = jest.fn()
    renderWithWrappers(
      <CategoryPicker
        handleChange={handleChangeMock}
        options={artworkMediumCategories}
        value={artworkMediumCategories[0].value}
      />
    )

    expect(screen.queryByTestId("modal-CategorySelect")).not.toBeVisible()

    const SelectInput = screen.getByText("Painting")
    fireEvent.press(SelectInput)

    // wait for modal to be visible
    await screen.findByTestId("modal-CategorySelect")

    fireEvent.press(screen.getByText(artworkMediumCategories[2].label))

    expect(handleChangeMock).toHaveBeenCalledWith("Photography", 2)
  })
})

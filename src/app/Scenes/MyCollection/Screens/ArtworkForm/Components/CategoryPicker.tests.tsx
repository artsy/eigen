import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { artworkMediumCategories } from "app/utils/artworkMediumCategories"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { CategoryPicker } from "./CategoryPicker"

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

    const SelectInput = screen.getByText("Painting")
    fireEvent.press(SelectInput)

    const modal = screen.UNSAFE_getByType(FancyModal)

    // wait for modal to be visible
    await waitFor(() => expect(modal).toHaveProp("visible", true))

    fireEvent.press(screen.getByText(artworkMediumCategories[2].label))

    expect(handleChangeMock).toHaveBeenCalledWith("Photography", 2)
  })
})

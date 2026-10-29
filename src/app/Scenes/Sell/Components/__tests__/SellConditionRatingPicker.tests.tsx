import { fireEvent, screen } from "@testing-library/react-native"
import { SellConditionRatingPicker } from "app/Scenes/Sell/Components/SellConditionRatingPicker"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SellConditionRatingPicker", () => {
  it("shows the four ratings with none checked", () => {
    renderWithWrappers(<SellConditionRatingPicker value={null} onChange={jest.fn()} />)

    const ratings = screen.getAllByRole("radio")
    expect(ratings).toHaveLength(4)
    ratings.forEach((rating) => expect(rating).not.toBeChecked())
  })

  it("checks the current rating", () => {
    renderWithWrappers(<SellConditionRatingPicker value="VERY_GOOD" onChange={jest.fn()} />)

    expect(screen.getByRole("radio", { name: /^Very Good\./ })).toBeChecked()
    expect(screen.getByRole("radio", { name: /^Fair\./ })).not.toBeChecked()
  })

  it("reports the rating the user presses", () => {
    const onChange = jest.fn()
    renderWithWrappers(<SellConditionRatingPicker value={null} onChange={onChange} />)

    fireEvent.press(screen.getByRole("radio", { name: /^Poor\./ }))

    expect(onChange).toHaveBeenCalledWith("POOR")
  })
})

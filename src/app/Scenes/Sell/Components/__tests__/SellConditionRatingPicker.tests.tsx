import { fireEvent, screen } from "@testing-library/react-native"
import { SellConditionRatingPicker } from "app/Scenes/Sell/Components/SellConditionRatingPicker"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SellConditionRatingPicker", () => {
  it("shows the four ratings with none checked", async () => {
    await renderWithWrappers(<SellConditionRatingPicker value={null} onChange={jest.fn()} />)

    const ratings = screen.getAllByRole("radio")
    expect(ratings).toHaveLength(4)
    ratings.forEach((rating) => expect(rating).not.toBeChecked())
  })

  it("lists the ratings from Fair to Excellent", async () => {
    await renderWithWrappers(<SellConditionRatingPicker value={null} onChange={jest.fn()} />)

    const titles = screen.getAllByRole("radio").map((rating) => rating.props.accessibilityLabel)
    expect(titles.map((label: string) => label.split(".")[0])).toEqual([
      "Fair",
      "Good",
      "Very Good",
      "Excellent",
    ])
  })

  it("checks the current rating", async () => {
    await renderWithWrappers(<SellConditionRatingPicker value="VERY_GOOD" onChange={jest.fn()} />)

    expect(screen.getByRole("radio", { name: /^Very Good\./ })).toBeChecked()
    expect(screen.getByRole("radio", { name: /^Fair\./ })).not.toBeChecked()
  })

  it("reports the rating the user presses", async () => {
    const onChange = jest.fn()
    await renderWithWrappers(<SellConditionRatingPicker value={null} onChange={onChange} />)

    await fireEvent.press(screen.getByRole("radio", { name: /^Good\./ }))

    expect(onChange).toHaveBeenCalledWith("GOOD")
  })
})

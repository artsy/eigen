import { fireEvent, screen } from "@testing-library/react-native"
import { SellOptionCards } from "app/Scenes/Sell/Components/SellOptionCards"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const OPTIONS = [
  { value: "A", title: "Option A", description: "The first option." },
  { value: "B", title: "Option B", description: "The second option." },
]

describe("SellOptionCards", () => {
  it("checks only the current option", () => {
    renderWithWrappers(<SellOptionCards options={OPTIONS} value="B" onChange={jest.fn()} />)

    expect(screen.getByRole("radio", { name: /^Option A\./ })).not.toBeChecked()
    expect(screen.getByRole("radio", { name: /^Option B\./ })).toBeChecked()
  })

  it("reports the option the user presses", () => {
    const onChange = jest.fn()
    renderWithWrappers(<SellOptionCards options={OPTIONS} value={null} onChange={onChange} />)

    fireEvent.press(screen.getByRole("radio", { name: /^Option A\./ }))

    expect(onChange).toHaveBeenCalledWith("A")
  })

  it("ignores presses while disabled", () => {
    const onChange = jest.fn()
    renderWithWrappers(
      <SellOptionCards options={OPTIONS} value={null} onChange={onChange} disabled />
    )

    fireEvent.press(screen.getByRole("radio", { name: /^Option A\./ }))

    expect(screen.getByRole("radio", { name: /^Option A\./ })).toBeDisabled()
    expect(onChange).not.toHaveBeenCalled()
  })
})

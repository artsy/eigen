import { fireEvent, screen } from "@testing-library/react-native"
import { SellPayoutBreakdown } from "app/Scenes/Sell/Components/SellPayoutBreakdown"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SellPayoutBreakdown", () => {
  it("shows dashes until there's an asking price", () => {
    renderWithWrappers(<SellPayoutBreakdown askingPrice={null} onFeeInfoPress={jest.fn()} />)

    expect(screen.getAllByText("—")).toHaveLength(3)
  })

  it("shows the fee and what the seller receives", () => {
    renderWithWrappers(<SellPayoutBreakdown askingPrice={3200} onFeeInfoPress={jest.fn()} />)

    expect(screen.getByText("US$3,200")).toBeOnTheScreen()
    expect(screen.getByText("−US$480")).toBeOnTheScreen()
    expect(screen.getByText("US$2,720")).toBeOnTheScreen()
  })

  it("asks for the fee explanation", () => {
    const onFeeInfoPress = jest.fn()
    renderWithWrappers(<SellPayoutBreakdown askingPrice={null} onFeeInfoPress={onFeeInfoPress} />)

    fireEvent.press(screen.getByLabelText("About Artsy's fee"))

    expect(onFeeInfoPress).toHaveBeenCalledTimes(1)
  })
})

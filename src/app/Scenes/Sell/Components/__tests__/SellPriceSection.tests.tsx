import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellPriceSection } from "app/Scenes/Sell/Components/SellPriceSection"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useState } from "react"
import { Alert } from "react-native"

const TestPriceSection: React.FC<{ disabled?: boolean }> = ({ disabled = false }) => {
  const [askingPrice, setAskingPrice] = useState("")

  return (
    <SellPriceSection
      artistNames="Theo Bardsley"
      askingPrice={askingPrice}
      onAskingPriceChange={setAskingPrice}
      disabled={disabled}
    />
  )
}

describe("SellPriceSection", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("shows the recommended range for the artist", () => {
    renderWithWrappers(<TestPriceSection />)

    expect(screen.getByText("US$3,000–3,400")).toBeOnTheScreen()
    expect(screen.getByText("Based on comparable sales by Theo Bardsley")).toBeOnTheScreen()
  })

  it("formats the asking price and updates the payout", () => {
    renderWithWrappers(<TestPriceSection />)

    fireEvent.changeText(screen.getByLabelText("Asking price"), "03,200")

    expect(screen.getByLabelText("Asking price")).toHaveDisplayValue("3,200")
    expect(screen.getByText("−US$480")).toBeOnTheScreen()
    expect(screen.getByText("US$2,720")).toBeOnTheScreen()
  })

  it("doesn't take a price while disabled", () => {
    renderWithWrappers(<TestPriceSection disabled />)

    expect(screen.getByLabelText("Asking price")).toHaveProp("editable", false)
  })

  it("says the insights link isn't built yet", () => {
    const alertSpy = jest.spyOn(Alert, "alert")
    renderWithWrappers(<TestPriceSection />)

    fireEvent.press(screen.getByText("See more Insights >"))

    expect(alertSpy).toHaveBeenCalledWith("See more Insights", "Not yet implemented.")
  })

  it("explains Artsy's fee", async () => {
    renderWithWrappers(<TestPriceSection />)

    fireEvent.press(screen.getByLabelText("About Artsy's fee"))
    expect(await screen.findByText(/flat 15% fee/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Got it"))
    await waitFor(() => expect(screen.queryByText(/flat 15% fee/)).not.toBeOnTheScreen())
  })
})

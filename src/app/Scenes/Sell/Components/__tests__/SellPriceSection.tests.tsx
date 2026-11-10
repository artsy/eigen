import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellFeeInfoBottomSheet } from "app/Scenes/Sell/Components/SellFeeInfoBottomSheet"
import { SellPriceSection } from "app/Scenes/Sell/Components/SellPriceSection"
import {
  SellConditionStep,
  SellFlowStore,
  sellFlowStoreModel,
} from "app/Scenes/Sell/State/SellFlowStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Alert } from "react-native"

const TestPriceSection: React.FC<{ rating?: SellConditionStep["rating"] }> = ({
  rating = "FAIR",
}) => (
  <SellFlowStore.Provider
    runtimeModel={{
      ...sellFlowStoreModel,
      conditionStep: { rating, photos: [], notes: "", askingPrice: "" },
    }}
  >
    <SellPriceSection artistNames="Theo Bardsley" />
  </SellFlowStore.Provider>
)

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

  it("drops the cents from a pasted price", () => {
    renderWithWrappers(<TestPriceSection />)

    fireEvent.changeText(screen.getByLabelText("Asking price"), "3,200.50")

    expect(screen.getByLabelText("Asking price")).toHaveDisplayValue("3,200")
  })

  it("keeps the price under a billion dollars", () => {
    renderWithWrappers(<TestPriceSection />)

    expect(screen.getByLabelText("Asking price")).toHaveProp("maxLength", "999,999,999".length)
  })

  it("locks the price until a condition is picked, and says why", () => {
    renderWithWrappers(<TestPriceSection rating={null} />)

    expect(screen.getByLabelText("Asking price")).toHaveProp("editable", false)
    expect(screen.getByText("Pick a condition to set your price.")).toBeOnTheScreen()
  })

  it("says the insights link isn’t built yet", () => {
    const alertSpy = jest.spyOn(Alert, "alert")
    renderWithWrappers(<TestPriceSection />)

    fireEvent.press(screen.getByText("See more Insights >"))

    expect(alertSpy).toHaveBeenCalledWith("See more Insights", "Not yet implemented.")
  })

  it("explains Artsy’s fee", async () => {
    renderWithWrappers(<TestPriceSection />)

    fireEvent.press(screen.getByLabelText("About Artsy’s fee"))
    expect(await screen.findByText(/flat 15% fee/)).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Got it"))
    // The bottom sheet mock keeps its children rendered, so check what the sheet was told
    await waitFor(() =>
      expect(screen.UNSAFE_getByType(SellFeeInfoBottomSheet).props.visible).toBe(false)
    )
  })
})

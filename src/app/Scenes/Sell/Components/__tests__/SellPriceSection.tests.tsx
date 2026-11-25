import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellPriceSection } from "app/Scenes/Sell/Components/SellPriceSection"
import {
  SellConditionStore,
  SellConditionStoreModel,
  sellConditionStoreModel,
} from "app/Scenes/Sell/State/SellConditionStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Alert } from "react-native"

// gorhom unmounts a sheet's content when it closes, but the global mock keeps it mounted
jest.mock("app/Components/BottomSheet/AutomountedBottomSheetModal", () => {
  const { createElement } = jest.requireActual("react")
  const { AutomountedBottomSheetModal } = jest.requireActual(
    "app/Components/BottomSheet/AutomountedBottomSheetModal"
  )
  return {
    AutomountedBottomSheetModal: (props: { visible: boolean }) =>
      props.visible ? createElement(AutomountedBottomSheetModal, props) : null,
  }
})

const TestPriceSection: React.FC<{
  rating?: SellConditionStoreModel["rating"]
  recommendedPriceRange?: string | null
}> = ({ rating = "FAIR", recommendedPriceRange = "US$2,800–3,600" }) => (
  <SellConditionStore.Provider runtimeModel={{ ...sellConditionStoreModel, rating }}>
    <SellPriceSection artistNames="Theo Bardsley" recommendedPriceRange={recommendedPriceRange} />
  </SellConditionStore.Provider>
)

describe("SellPriceSection", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("shows the recommended range for the artwork", async () => {
    await renderWithWrappers(<TestPriceSection />)

    expect(screen.getByText("US$2,800–3,600")).toBeOnTheScreen()
    expect(screen.getByText("Based on comparable sales by Theo Bardsley")).toBeOnTheScreen()
  })

  it("hides the recommendation and the insights link without a range", async () => {
    await renderWithWrappers(<TestPriceSection recommendedPriceRange={null} />)

    expect(screen.queryByText("Recommended price range")).not.toBeOnTheScreen()
    expect(screen.queryByText(/Based on comparable sales/)).not.toBeOnTheScreen()
    expect(screen.queryByText("See more Insights >")).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Asking price")).toBeOnTheScreen()
  })

  it("formats the asking price and updates the payout", async () => {
    await renderWithWrappers(<TestPriceSection />)

    await fireEvent.changeText(screen.getByLabelText("Asking price"), "03,200")

    expect(screen.getByLabelText("Asking price")).toHaveDisplayValue("3,200")
    expect(screen.getByText("−US$480")).toBeOnTheScreen()
    expect(screen.getByText("US$2,720")).toBeOnTheScreen()
  })

  it("drops the cents from a pasted price", async () => {
    await renderWithWrappers(<TestPriceSection />)

    await fireEvent.changeText(screen.getByLabelText("Asking price"), "3,200.50")

    expect(screen.getByLabelText("Asking price")).toHaveDisplayValue("3,200")
  })

  it("keeps the price under a billion dollars", async () => {
    await renderWithWrappers(<TestPriceSection />)

    expect(screen.getByLabelText("Asking price")).toHaveProp("maxLength", "999,999,999".length)
  })

  it("locks the price until a condition is picked, and says why", async () => {
    await renderWithWrappers(<TestPriceSection rating={null} />)

    expect(screen.getByLabelText("Asking price")).toHaveProp("editable", false)
    expect(screen.getByText("Pick a condition to set your price.")).toBeOnTheScreen()
  })

  it("says the insights link isn’t built yet", async () => {
    const alertSpy = jest.spyOn(Alert, "alert")
    await renderWithWrappers(<TestPriceSection />)

    await fireEvent.press(screen.getByText("See more Insights >"))

    expect(alertSpy).toHaveBeenCalledWith("See more Insights", "Not yet implemented.")
  })

  it("explains Artsy’s fee", async () => {
    await renderWithWrappers(<TestPriceSection />)

    await fireEvent.press(screen.getByLabelText("About Artsy’s fee"))
    expect(await screen.findByText(/flat 15% fee/)).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Got it"))
    await waitFor(() => expect(screen.queryByText(/flat 15% fee/)).not.toBeOnTheScreen())
  })
})

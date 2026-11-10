import { fireEvent, screen } from "@testing-library/react-native"
import { SellShippingQuestions } from "app/Scenes/Sell/Components/SellShippingQuestions"
import { SellLocationStore, sellLocationStoreModel } from "app/Scenes/Sell/State/SellLocationStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const ADDRESS = { id: "place-1", name: "401 Broadway, New York, NY, USA" }

const TestShippingQuestions: React.FC<{ locationComplete?: boolean }> = ({
  locationComplete = true,
}) => (
  <SellLocationStore.Provider
    runtimeModel={{
      ...sellLocationStoreModel,
      ...(locationComplete && { address: ADDRESS, zip: "10013" }),
    }}
  >
    <SellShippingQuestions />
  </SellLocationStore.Provider>
)

describe("SellShippingQuestions", () => {
  it("locks every question until the location is complete", () => {
    renderWithWrappers(<TestShippingQuestions locationComplete={false} />)

    expect(screen.getByRole("radio", { name: /^Framed\./ })).toBeDisabled()
  })

  it("unlocks each question once the one before it is answered", () => {
    renderWithWrappers(<TestShippingQuestions />)

    expect(screen.getByRole("radio", { name: /^Courier packs\./ })).toBeDisabled()

    fireEvent.press(screen.getByRole("radio", { name: /^Framed\./ }))
    expect(screen.getByRole("radio", { name: /^Courier packs\./ })).toBeEnabled()
    expect(screen.getByRole("radio", { name: /^Courier needs to collect\./ })).toBeDisabled()

    fireEvent.press(screen.getByRole("radio", { name: /^Courier packs\./ }))
    expect(screen.getByRole("radio", { name: /^Courier needs to collect\./ })).toBeEnabled()
  })
})

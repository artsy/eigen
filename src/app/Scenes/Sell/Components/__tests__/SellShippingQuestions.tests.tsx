import { fireEvent, screen } from "@testing-library/react-native"
import {
  EMPTY_SELL_SHIPPING,
  SellShippingQuestions,
  areSellShippingAnswersComplete,
} from "app/Scenes/Sell/Components/SellShippingQuestions"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useState } from "react"

const TestShippingQuestions: React.FC<{ disabled?: boolean }> = ({ disabled = false }) => {
  const [answers, setAnswers] = useState(EMPTY_SELL_SHIPPING)

  return <SellShippingQuestions value={answers} onChange={setAnswers} disabled={disabled} />
}

describe("SellShippingQuestions", () => {
  it("locks every question until the location is complete", () => {
    renderWithWrappers(<TestShippingQuestions disabled />)

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

describe("areSellShippingAnswersComplete", () => {
  it("needs all three answers", () => {
    expect(
      areSellShippingAnswersComplete({ packaging: "FRAMED", packer: "COURIER", delivery: null })
    ).toBe(false)
    expect(
      areSellShippingAnswersComplete({
        packaging: "FRAMED",
        packer: "COURIER",
        delivery: "EITHER",
      })
    ).toBe(true)
  })
})

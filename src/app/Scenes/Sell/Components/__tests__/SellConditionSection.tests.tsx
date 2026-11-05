import { fireEvent, screen } from "@testing-library/react-native"
import {
  EMPTY_SELL_CONDITION,
  SellConditionSection,
} from "app/Scenes/Sell/Components/SellConditionSection"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useState } from "react"

const TestConditionSection: React.FC = () => {
  const [value, setValue] = useState(EMPTY_SELL_CONDITION)

  return <SellConditionSection value={value} onChange={setValue} />
}

describe("SellConditionSection", () => {
  it("keeps the rating and notes the user enters", () => {
    renderWithWrappers(<TestConditionSection />)

    fireEvent.press(screen.getByRole("radio", { name: /^Fair\./ }))
    fireEvent.changeText(screen.getByLabelText("Notes"), "Small tear at the corner")

    expect(screen.getByRole("radio", { name: /^Fair\./ })).toBeChecked()
    expect(screen.getByLabelText("Notes")).toHaveDisplayValue("Small tear at the corner")
  })
})

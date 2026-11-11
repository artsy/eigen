import { fireEvent, screen } from "@testing-library/react-native"
import { SellConditionSection } from "app/Scenes/Sell/Components/SellConditionSection"
import { SellConditionStore } from "app/Scenes/Sell/State/SellConditionStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const TestConditionSection: React.FC = () => (
  <SellConditionStore.Provider>
    <SellConditionSection />
  </SellConditionStore.Provider>
)

describe("SellConditionSection", () => {
  it("keeps the rating and notes the user enters", () => {
    renderWithWrappers(<TestConditionSection />)

    fireEvent.press(screen.getByRole("radio", { name: /^Fair\./ }))
    fireEvent.changeText(screen.getByLabelText("Notes"), "Small tear at the corner")

    expect(screen.getByRole("radio", { name: /^Fair\./ })).toBeChecked()
    expect(screen.getByLabelText("Notes")).toHaveDisplayValue("Small tear at the corner")
  })
})

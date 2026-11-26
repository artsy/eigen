import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SellConditionSection } from "app/Scenes/Sell/Components/SellConditionSection"
import { SellConditionStore } from "app/Scenes/Sell/State/SellConditionStore"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/requestPhotos", () => ({ showPhotoActionSheet: jest.fn() }))

const TestConditionSection: React.FC = () => (
  <SellConditionStore.Provider>
    <SellConditionSection />
  </SellConditionStore.Provider>
)

describe("SellConditionSection", () => {
  it("keeps the rating and notes the user enters", async () => {
    await renderWithWrappers(<TestConditionSection />)

    await fireEvent.press(screen.getByRole("radio", { name: /^Fair\./ }))
    await fireEvent.changeText(screen.getByLabelText("Notes"), "Small tear at the corner")

    expect(screen.getByRole("radio", { name: /^Fair\./ })).toBeChecked()
    expect(screen.getByLabelText("Notes")).toHaveDisplayValue("Small tear at the corner")
  })

  it("keeps only the first 10 photos when more are added", async () => {
    const pick = (from: number, count: number) =>
      jest.mocked(showPhotoActionSheet).mockResolvedValue(
        Array.from({ length: count }, (_, index) => ({
          path: `file:///${from + index}.jpg`,
        })) as Awaited<ReturnType<typeof showPhotoActionSheet>>
      )
    await renderWithWrappers(<TestConditionSection />)

    pick(0, 8)
    await fireEvent.press(screen.getByText("Upload photos"))
    await waitFor(() => expect(screen.getAllByTestId("sell-condition-photo")).toHaveLength(8))

    pick(8, 5)
    await fireEvent.press(screen.getByText("Add more photos"))
    await waitFor(() => expect(screen.getAllByTestId("sell-condition-photo")).toHaveLength(10))
    expect(screen.queryByText("Add more photos")).not.toBeOnTheScreen()
  })
})

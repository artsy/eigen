import { Text } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { InfoButton } from "./InfoButton"

describe("InfoButton", () => {
  it("renders the button and opens and closes the modal correctly", async () => {
    const mockOnPress = jest.fn()

    renderWithWrappers(
      <InfoButton
        title="title"
        subTitle="subTitle"
        modalContent={<Text>Modal Content</Text>}
        onPress={mockOnPress}
      />
    )

    expect(screen.getAllByText("title")).toBeDefined()
    expect(screen.getAllByText("subTitle")).toBeDefined()

    fireEvent.press(screen.getAllByText("title")[0])

    expect(mockOnPress).toHaveBeenCalledTimes(1)

    expect(screen.getByText("Modal Content")).toBeTruthy()

    fireEvent.press(screen.getByText("Close"))
  })
})

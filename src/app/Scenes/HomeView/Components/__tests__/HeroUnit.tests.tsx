import { fireEvent, screen } from "@testing-library/react-native"
import { HeroUnit } from "app/Scenes/HomeView/Components/HeroUnit"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("HeroUnit", () => {
  const mockItem = {
    internalID: "hero-unit-id",
    title: "Test Hero Unit",
    body: "This is a test hero unit",
    imageSrc: "https://example.com/image.jpg",
    url: "/test-url",
    buttonText: "Learn More",
  }
  const mockOnPress = jest.fn()

  it("renders", () => {
    renderWithWrappers(<HeroUnit item={mockItem} onPress={mockOnPress} />)

    // Verify component renders correctly
    expect(screen.getByText("Test Hero Unit")).toBeOnTheScreen()
    expect(screen.getByText("This is a test hero unit")).toBeOnTheScreen()
    expect(screen.getByText("Learn More")).toBeOnTheScreen()
  })

  it("handles press events", () => {
    renderWithWrappers(<HeroUnit item={mockItem} onPress={mockOnPress} />)

    fireEvent.press(screen.getByText("Test Hero Unit"))

    expect(mockOnPress).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith("/test-url")
  })

  it("handles button press events", () => {
    renderWithWrappers(<HeroUnit item={mockItem} onPress={mockOnPress} />)

    fireEvent.press(screen.getByText("Learn More"))

    expect(mockOnPress).toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledWith("/test-url")
  })
})

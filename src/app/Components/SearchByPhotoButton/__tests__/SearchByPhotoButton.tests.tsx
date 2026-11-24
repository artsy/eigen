import { fireEvent, screen } from "@testing-library/react-native"
import { SearchByPhotoButton } from "app/Components/SearchByPhotoButton/SearchByPhotoButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { StyleSheet } from "react-native"

const labelColor = () => StyleSheet.flatten(screen.getByText("Search by Photo").props.style).color

describe("SearchByPhotoButton", () => {
  it("calls onPress", async () => {
    const onPress = jest.fn()

    await renderWithWrappers(<SearchByPhotoButton onPress={onPress} />)

    await fireEvent.press(screen.getByTestId("search-by-photo-button"))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  // Flipping the variants makes the button invisible, which no higher-level test would catch.
  it("labels the fillDark variant in white, for light surfaces", async () => {
    await renderWithWrappers(<SearchByPhotoButton variant="fillDark" onPress={jest.fn()} />)

    expect(labelColor()).toBe("rgba(255, 255, 255, 1)")
  })

  it("labels the fillLight variant in black, for the black Lens screens", async () => {
    await renderWithWrappers(<SearchByPhotoButton variant="fillLight" onPress={jest.fn()} />)

    expect(labelColor()).toBe("rgba(0, 0, 0, 1)")
  })
})

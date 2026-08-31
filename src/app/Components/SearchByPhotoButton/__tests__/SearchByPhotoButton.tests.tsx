import { fireEvent, screen } from "@testing-library/react-native"
import { SearchByPhotoButton } from "app/Components/SearchByPhotoButton/SearchByPhotoButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { StyleSheet } from "react-native"

const labelColor = () => StyleSheet.flatten(screen.getByText("Search by photo").props.style).color

describe("SearchByPhotoButton", () => {
  it("calls onPress", () => {
    const onPress = jest.fn()

    renderWithWrappers(<SearchByPhotoButton onPress={onPress} />)

    fireEvent.press(screen.getByLabelText("Search by photo"))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  // Flipping the variants makes the button invisible, which no higher-level test would catch.
  it("labels the dark variant in white, for light surfaces", () => {
    renderWithWrappers(<SearchByPhotoButton variant="dark" onPress={jest.fn()} />)

    expect(labelColor()).toBe("#FFFFFF")
  })

  it("labels the light variant in black, for the black Lens screens", () => {
    renderWithWrappers(<SearchByPhotoButton variant="light" onPress={jest.fn()} />)

    expect(labelColor()).toBe("#000000")
  })
})

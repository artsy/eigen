import { fireEvent, screen, within } from "@testing-library/react-native"
import { Rarity } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/RarityLegacy"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useFormikContext } from "formik"

jest.mock("formik")

describe("Rarity", () => {
  const useFormikContextMock = useFormikContext as jest.Mock
  const changeField = jest.fn()

  beforeEach(() => {
    changeField.mockClear()
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(() => changeField),
      values: {
        attributionClass: "LIMITED_EDITION",
      },
      setFieldValue: jest.fn(() => jest.fn()),
      handleBlur: jest.fn(() => jest.fn()),
    }))
  })

  it("displays the correct rarity", async () => {
    await renderWithWrappers(<Rarity />)

    await fireEvent.press(screen.getByTestId("rarity-select"))

    // The modal opens a frame after the press. The field also shows "Limited Edition" as its
    // value, so pick the option from the modal.
    const modal = await screen.findByTestId("modal-rarity-select")
    await fireEvent.press(within(modal).getByText("Limited Edition"))
    expect(changeField).toHaveBeenCalledWith("LIMITED_EDITION")

    screen.getByLabelText("Edition number input")
  })

  it("displays the modal with all classification types", async () => {
    await renderWithWrappers(<Rarity />)

    await fireEvent.press(screen.getByText("What's this?"))
    screen.getByText("Classifications")

    expect(screen.getByText("Unique")).toBeTruthy()
    // there are two of these because even though the modal is open,
    // testing library also renders on the test dom the underlying component
    expect(screen.getAllByText("Limited Edition")).toHaveLength(2)
    expect(screen.getByText("Open Edition")).toBeTruthy()
    expect(screen.getByText("Unknown Edition")).toBeTruthy()
  })
})

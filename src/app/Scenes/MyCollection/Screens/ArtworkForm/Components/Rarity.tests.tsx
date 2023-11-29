import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useFormikContext } from "formik"
import { Rarity } from "./Rarity"

jest.mock("formik")

describe("Rarity", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(() => jest.fn()),
      values: {
        attributionClass: "LIMITED_EDITION",
      },
      setFieldValue: jest.fn(() => jest.fn()),
      handleBlur: jest.fn(() => jest.fn()),
    }))
  })

  it("displays the correct rarity", async () => {
    renderWithWrappers(<Rarity />)

    fireEvent.press(screen.getByTestId("rarity-select"))

    await waitFor(() => screen.getByText("Limited Edition"))

    fireEvent.press(screen.getByText("Limited Edition"))

    await waitFor(() => screen.getByLabelText("Edition number input"))
  })

  it("displays the modal with all classification types", async () => {
    renderWithWrappers(<Rarity />)

    fireEvent.press(screen.getByText("What is this?"))

    await waitFor(() => screen.getByText("Classifications"))


    expect(screen.getByText("Unique")).toBeTruthy()
    // there are two of these because even though the modal is open,
    // testing library also renders on the test dom the underlying component
    expect(screen.getAllByText("Limited Edition")).toHaveLength(2)
    expect(screen.getByText("Open Edition")).toBeTruthy()
    expect(screen.getByText("Unknown Edition")).toBeTruthy()
  })
})

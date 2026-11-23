import { screen } from "@testing-library/react-native"
import { Dimensions } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/Dimensions"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useFormikContext } from "formik"

jest.mock("formik")

describe("Dimensions", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      values: {
        height: "20",
        width: "30",
        depth: "40",
      },
    }))
  })

  it("displays correct dimensions", () => {
    renderWithWrappers(<Dimensions />)
    expect(screen.getByTestId("HeightInput")).toHaveDisplayValue("20")
    expect(screen.getByTestId("WidthInput")).toHaveDisplayValue("30")
    expect(screen.getByTestId("DepthInput")).toHaveDisplayValue("40")
  })
})

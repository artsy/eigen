import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { useFormikContext } from "formik"
import { Select } from "palette/elements/Select"
import { MediumPicker } from "./MediumPicker"

jest.mock("formik")

describe("MediumPicker", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      values: {
        medium: "Painting",
      },
    }))
  })

  it("displays the correct medium", () => {
    const wrapper = renderWithWrappersLEGACY(<MediumPicker />)
    const select = wrapper.root.findByType(Select)
    expect(select.props.value).toBe("Painting")
  })
})

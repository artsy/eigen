import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { useFormikContext } from "formik"
import { Select } from "palette/elements/Select"
import { CategoryPicker } from "./CategoryPicker"

jest.mock("formik")

describe("CategoryPicker", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      values: {
        category: "Painting",
      },
    }))
  })

  it("displays the correct category", () => {
    const wrapper = renderWithWrappersLEGACY(<CategoryPicker />)
    const select = wrapper.root.findByType(Select)
    expect(select.props.value).toBe("Painting")
  })
})

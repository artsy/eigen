import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { useFormikContext } from "formik"
import { Input } from "palette"
import { Dimensions } from "./Dimensions"

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
    const wrapper = renderWithWrappersLEGACY(<Dimensions />)
    const inputs = wrapper.root.findAllByType(Input)
    expect(inputs[0].props.value).toBe("20")
    expect(inputs[1].props.value).toBe("30")
    expect(inputs[2].props.value).toBe("40")
  })
})

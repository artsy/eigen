import { useFormikContext } from "formik"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Select } from "palette/elements/Select"
import React from "react"
import { RarityPicker } from "./RarityPicker"

jest.mock("formik")

describe("RarityPicker", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      values: {
        attributionClass: "Open edition",
      },
    }))
  })

  it("displays the correct rarity", () => {
    const wrapper = renderWithWrappers(<RarityPicker />)
    const select = wrapper.root.findByType(Select)
    expect(select.props.value).toBe("Open edition")
  })
})

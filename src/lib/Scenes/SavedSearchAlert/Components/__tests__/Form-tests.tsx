import { useFormikContext } from 'formik'
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Form } from "../Form"

jest.mock("formik")

describe("Saved search alert form", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      handleSubmit: jest.fn(),
      isSubmitting: false,
      values: {
        name: "",
      },
      errors: {},
    }))
  })

  it("renders without throwing an error", () => {
    renderWithWrappers(<Form />)
  })
})

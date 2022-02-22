import { useFormikContext } from "formik"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { mockSubmissionForm } from "./ArtworkDetails.tests"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"

jest.unmock("react-relay")
jest.mock("formik")

const useFormikContextMock = useFormikContext as jest.Mock

describe("ArtworkDetailsForm", () => {
  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      errors: {},
      values: mockSubmissionForm,
    }))
  })

  afterEach(() => jest.clearAllMocks())

  it("Validation", async () => {
    const { findByText } = renderWithWrappersTL(<ArtworkDetailsForm />)
    expect(findByText("hello")).toBeTruthy()
  })
})

import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { UploadPhotos } from "./UploadPhotos"

jest.unmock("react-relay")

const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("UploadPhotos", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <UploadPhotos handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => mockEnvironment.mockClear())

  it("renders correct explanation for upload photos form", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    expect(
      getByText(
        "To evaluate your submission faster, please upload high-quality photos of the work's front and back."
      )
    ).toBeTruthy()

    expect(
      getByText("If possible, include photos of any signatures or certificates of authenticity.")
    ).toBeTruthy()
  })

  it("renders Save and Continue button", () => {
    const { getByTestId } = renderWithWrappersTL(<TestRenderer />)
    expect(getByTestId("Submission_Save_Photos_Button")).toBeTruthy()
  })
})

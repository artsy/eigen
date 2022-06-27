import { fireEvent, waitFor } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Linking } from "react-native"

import { Modal } from "./Modal"

describe("Modal", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error", () => {
    const { getByText } = renderWithWrappersTL(
      <Modal visible headerText="An error occurred" detailText="This is an error moop." />
    )

    expect(getByText("An error occurred")).toBeTruthy()
    expect(getByText("This is an error moop.")).toBeTruthy()
  })

  it("should call `closeModal` when `Ok` button is pressed", () => {
    const closeModalMock = jest.fn()
    const { getByText } = renderWithWrappersTL(
      <Modal visible headerText="Header" detailText="Detail" closeModal={closeModalMock} />
    )

    fireEvent.press(getByText("Ok"))

    expect(closeModalMock).toBeCalled()
  })

  it("renders markdown details", async () => {
    Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    Linking.openURL = jest.fn()

    const { getByText } = renderWithWrappersTL(
      <Modal
        visible
        headerText="Header"
        detailText="Contact [username@email.com](mailto:username@email.com)"
      />
    )

    fireEvent.press(getByText("username@email.com"))

    await waitFor(() => expect(Linking.openURL).toBeCalledWith("mailto:username@email.com"))
  })
})

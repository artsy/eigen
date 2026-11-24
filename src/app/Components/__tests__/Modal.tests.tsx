import { fireEvent, waitFor, screen } from "@testing-library/react-native"
import { Modal } from "app/Components/Modal"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Linking } from "react-native"

describe("Modal", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders without throwing an error", async () => {
    await renderWithWrappers(
      <Modal visible headerText="An error occurred" detailText="This is an error moop." />
    )

    expect(screen.getByText("An error occurred")).toBeTruthy()
    expect(screen.getByText("This is an error moop.")).toBeTruthy()
  })

  it("should call `closeModal` when `Ok` button is pressed", async () => {
    const closeModalMock = jest.fn()
    await renderWithWrappers(
      <Modal visible headerText="Header" detailText="Detail" closeModal={closeModalMock} />
    )

    await fireEvent.press(screen.getByText("Ok"))

    expect(closeModalMock).toBeCalled()
  })

  it("renders markdown details", async () => {
    Linking.canOpenURL = jest.fn().mockReturnValue(Promise.resolve(true))
    Linking.openURL = jest.fn()

    await renderWithWrappers(
      <Modal
        visible
        headerText="Header"
        detailText="Contact [username@email.com](mailto:username@email.com)"
      />
    )

    await fireEvent.press(screen.getByText("username@email.com"))

    await waitFor(() => expect(Linking.openURL).toBeCalledWith("mailto:username@email.com"))
  })
})

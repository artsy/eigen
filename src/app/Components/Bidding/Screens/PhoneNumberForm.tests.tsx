import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { FakeNavigator } from "app/Components/Bidding/Helpers/FakeNavigator"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { PhoneNumberForm } from "./PhoneNumberForm"

describe("PhoneNumberForm component", () => {
  const onSubmitMock = jest.fn()
  const fakeNavigator = new FakeNavigator()

  it("User can immediately type their phone number and save it after load", async () => {
    renderWithWrappers(<PhoneNumberForm onSubmit={onSubmitMock} navigator={fakeNavigator as any} />)

    const phoneInput = screen.getByTestId("phone-input")
    fireEvent.changeText(phoneInput, "2125554444")

    fireEvent.press(screen.queryAllByText("Add phone number")[1])
    await waitFor(() => expect(onSubmitMock).toHaveBeenLastCalledWith("+1 (212) 555-4444"))
  })

  it("correctly populates relevant inputs with the passed address fields", () => {
    renderWithWrappers(
      <PhoneNumberForm
        onSubmit={onSubmitMock}
        navigator={fakeNavigator as any}
        phoneNumber="2125554444"
      />
    )

    expect(screen.getByTestId("phone-input")?.props.value).toEqual("(212) 555-4444")
  })
})

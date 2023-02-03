import { act, fireEvent, waitFor } from "@testing-library/react-native"
import { FakeNavigator } from "app/Components/Bidding/Helpers/FakeNavigator"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { PhoneNumberForm } from "./PhoneNumberForm"

describe("PhoneNumberForm component", () => {
  const onSubmitMock = jest.fn()
  const fakeNavigator = new FakeNavigator()

  it("renders without throwing an error", () => {
    const container = renderWithWrappers(
      <PhoneNumberForm onSubmit={onSubmitMock} navigator={fakeNavigator as any} />
    )

    expect(container).toBeTruthy()
  })

  it("User can immediately type their phone number and save it after load", async () => {
    const [phoneNumber, formattedPhoneNumber] = ["7738675309", "+1 (773) 867-5309"]

    const container = renderWithWrappers(
      <PhoneNumberForm onSubmit={onSubmitMock} navigator={fakeNavigator as any} />
    )
    const { getByTestId } = container

    const phoneInput = getByTestId("phone-input")
    fireEvent.changeText(phoneInput, phoneNumber)

    act(() => fireEvent.press(container.queryAllByText("Add phone number")[1]))
    waitFor(() => {
      expect(onSubmitMock).toHaveBeenLastCalledWith(formattedPhoneNumber)
    })
  })

  it("correctly populates relevant inputs with the passed address fields", () => {
    const [phoneNumber, formattedPhoneNumber] = ["7738675309", "(773) 867-5309"]

    const container = renderWithWrappers(
      <PhoneNumberForm
        onSubmit={onSubmitMock}
        navigator={fakeNavigator as any}
        phoneNumber={phoneNumber}
      />
    )

    expect(container.getByTestId("phone-input")?.props.value).toEqual(formattedPhoneNumber)
  })
})

import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { FakeNavigator } from "../Helpers/FakeNavigator"

import { PhoneNumberForm } from "./PhoneNumberForm"

describe("PhoneNumberForm component", () => {
  const onSubmitMock = jest.fn()
  const fakeNavigator = new FakeNavigator()

  it("renders without throwing an error", () => {
    const container = renderWithWrappersTL(
      <PhoneNumberForm onSubmit={onSubmitMock} navigator={fakeNavigator as any} />
    )

    expect(container).toBeTruthy()
  })

  it("User can immediately type their phone number and save it after load", async () => {
    const [phoneNumber, formattedPhoneNumber] = ["7738675309", "+1 (773) 867-5309"]

    const container = renderWithWrappersTL(
      <PhoneNumberForm onSubmit={onSubmitMock} navigator={fakeNavigator as any} />
    )
    const { getByTestId } = container

    const phoneInput = getByTestId("phone-input")
    fireEvent.changeText(phoneInput, phoneNumber)

    fireEvent.press(container.queryAllByText("Add phone number")[1])

    expect(onSubmitMock).toHaveBeenLastCalledWith(formattedPhoneNumber)
  })

  it("correctly populates relevant inputs with the passed address fields", () => {
    const [phoneNumber, formattedPhoneNumber] = ["7738675309", "(773) 867-5309"]

    const container = renderWithWrappersTL(
      <PhoneNumberForm
        onSubmit={onSubmitMock}
        navigator={fakeNavigator as any}
        phoneNumber={phoneNumber}
      />
    )

    expect(container.getByTestId("phone-input")?.props.value).toEqual(formattedPhoneNumber)
  })
})

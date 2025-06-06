import { fireEvent, screen } from "@testing-library/react-native"
import { FakeNavigator } from "app/Components/Bidding/Helpers/FakeNavigator"
import { BillingAddress } from "app/Components/Bidding/Screens/BillingAddress"
import { mockFullAddress } from "app/Components/Bidding/__mocks__/billingAddress"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("BillingAddress component", () => {
  const onSubmitMock = jest.fn()
  const fakeNavigator = new FakeNavigator()

  it("renders 7 inputs and correctly mutates typed values", () => {
    renderWithWrappers(<BillingAddress onSubmit={onSubmitMock} navigator={fakeNavigator as any} />)

    const nameInput = screen.getByTestId("input-full-name")
    const address1Input = screen.getByTestId("input-address-1")
    const address2Input = screen.getByTestId("input-address-2")
    const cityInput = screen.getByTestId("input-city")
    const stateInput = screen.getByTestId("input-state-province-region")
    const postcodeInput = screen.getByTestId("input-post-code")
    const phoneInput = screen.getByTestId("input-phone")

    fireEvent.changeText(nameInput, "mockName")
    fireEvent.changeText(address1Input, "mockAddress1")
    fireEvent.changeText(address2Input, "mockAddress2")
    fireEvent.changeText(cityInput, "mockCity")
    fireEvent.changeText(stateInput, "mockState")
    fireEvent.changeText(postcodeInput, "mockPostcode")
    fireEvent.changeText(phoneInput, "mockPhone")

    expect(nameInput.props.value).toEqual("mockName")
    expect(address1Input.props.value).toEqual("mockAddress1")
    expect(address2Input.props.value).toEqual("mockAddress2")
    expect(cityInput.props.value).toEqual("mockCity")
    expect(stateInput.props.value).toEqual("mockState")
    expect(postcodeInput.props.value).toEqual("mockPostcode")
    expect(phoneInput.props.value).toEqual("mockPhone")
  })

  it("correctly populates relevant inputs with the passed address fields", () => {
    renderWithWrappers(
      <BillingAddress
        onSubmit={onSubmitMock}
        billingAddress={mockFullAddress}
        navigator={fakeNavigator as any}
      />
    )

    expect(screen.getByTestId("input-full-name").props.value).toEqual(mockFullAddress.fullName)
    expect(screen.getByTestId("input-address-1").props.value).toEqual(mockFullAddress.addressLine1)
    expect(screen.getByTestId("input-address-2").props.value).toEqual(mockFullAddress.addressLine2)
    expect(screen.getByTestId("input-city").props.value).toEqual(mockFullAddress.city)
    expect(screen.getByTestId("input-state-province-region").props.value).toEqual(
      mockFullAddress.state
    )
    expect(screen.getByTestId("input-post-code").props.value).toEqual(mockFullAddress.postalCode)
    expect(screen.getByTestId("input-phone").props.value).toEqual(mockFullAddress.phoneNumber)
  })

  it("fires the passed callback when address is submitted and no required field is missing", () => {
    renderWithWrappers(
      <BillingAddress
        onSubmit={onSubmitMock}
        billingAddress={mockFullAddress}
        navigator={fakeNavigator as any}
      />
    )

    screen.getByTestId("button-add").props.onClick()

    expect(onSubmitMock).toHaveBeenCalled()
  })
})

import { screen } from "@testing-library/react-native"
import { FakeNavigator } from "app/Components/Bidding/Helpers/FakeNavigator"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { PhoneNumberForm } from "./PhoneNumberForm"

describe("PhoneNumberForm component", () => {
  const onSubmitMock = jest.fn()
  const fakeNavigator = new FakeNavigator()

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

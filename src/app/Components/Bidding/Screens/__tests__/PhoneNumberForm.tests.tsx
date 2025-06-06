import { screen } from "@testing-library/react-native"
import { PhoneNumberForm } from "app/Components/Bidding/Screens/PhoneNumberForm"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("PhoneNumberForm component", () => {
  const onSubmitMock = jest.fn()

  it("correctly populates relevant inputs with the passed address fields", () => {
    renderWithWrappers(
      <PhoneNumberForm
        navigation={null!}
        route={
          {
            params: {
              phoneNumber: "2125554444",
              onSubmit: onSubmitMock,
            },
          } as any
        }
      />
    )

    expect(screen.getByTestId("phone-input")?.props.value).toEqual("(212) 555-4444")
  })
})

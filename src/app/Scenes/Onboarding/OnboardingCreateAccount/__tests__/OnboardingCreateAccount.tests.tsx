import { Checkbox } from "@artsy/palette-mobile"
import { OnboardingCreateAccountWithEmail } from "app/Scenes/Onboarding/OnboardingCreateAccount/OnboardingCreateAccount"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { fetchMockResponseOnce } from "app/utils/tests/fetchMockHelpers"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

const goBackMock = jest.fn()
const replaceMock = jest.fn()

const navigationMock = {
  goBack: goBackMock,
  replace: replaceMock,
}

describe("OnboardingCreateAccount", () => {
  it("form validation works properly", async () => {
    const tree = renderWithWrappersLEGACY(
      <OnboardingCreateAccountWithEmail navigation={navigationMock as any} route={null as any} />
    )

    const signUpButton = tree.root.findByProps({ testID: "signUpButton" })

    signUpButton.props.onPress()

    const emailInput = tree.root.findByProps({ testID: "emailInput" })

    expect(emailInput.props.placeholder).toEqual("Email address")

    emailInput.props.onChangeText("invalidEmail")

    signUpButton.props.onPress()

    await flushPromiseQueue()
    expect(emailInput.props.placeholder).toEqual("Email address")
    expect(emailInput.props.error).toEqual("Please provide a valid email address")

    emailInput.props.onChangeText("valid@email.com")

    expect(signUpButton.props.disabled).toEqual(false)
    expect(signUpButton.props.error).toEqual(undefined)

    fetchMockResponseOnce(
      JSON.stringify({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
    )

    fetchMockResponseOnce({
      status: 404,
    })

    signUpButton.props.onPress()

    await flushPromiseQueue()

    const passwordInput = tree.root.findByProps({ testID: "passwordInput" })
    expect(passwordInput.props.placeholder).toEqual("Password")

    passwordInput.props.onChangeText("invalidEmail")
    signUpButton.props.onPress()
    await flushPromiseQueue()

    expect(passwordInput.props.error).toEqual("Your password should contain at least one digit")

    passwordInput.props.onChangeText("validEmail1")
    signUpButton.props.onPress()
    await flushPromiseQueue()

    const nameInput = tree.root.findByProps({ testID: "nameInput" })
    nameInput.props.onChangeText("Full Name")
    expect(nameInput.props.placeholder).toEqual("First and last name")

    expect(signUpButton.props.disabled).toEqual(true)

    const termsCheckBox = tree.root.findAllByType(Checkbox)[0]
    termsCheckBox.props.onPress()

    await flushPromiseQueue()

    expect(signUpButton.props.disabled).toEqual(false)

    fetchMockResponseOnce({ status: 201 })
    fetchMockResponseOnce(
      JSON.stringify({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
    )
    fetchMockResponseOnce(
      JSON.stringify({
        access_token: "my-access-token",
        expires_in: "a billion years",
        status: 201,
      })
    )
    fetchMockResponseOnce(
      JSON.stringify({
        id: "my-user-id",
      })
    )
    const isLoggedIn = !!__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken
    expect(isLoggedIn).toEqual(false)

    signUpButton.props.onPress()

    setTimeout(() => {
      expect(isLoggedIn).toEqual(true)
    }, 2000)
  })

  it("shows go to login button when the email is already used", async () => {
    const tree = renderWithWrappersLEGACY(
      <OnboardingCreateAccountWithEmail navigation={navigationMock as any} route={null as any} />
    )

    const signUpButton = tree.root.findByProps({ testID: "signUpButton" })

    const emailInput = tree.root.findByProps({ testID: "emailInput" })

    emailInput.props.onChangeText("used-email@example.com")

    fetchMockResponseOnce(
      JSON.stringify({
        xapp_token: "my-special-token",
        expires_in: "never",
      })
    )

    fetchMockResponseOnce({ status: 200 })
    signUpButton.props.onPress()

    setTimeout(() => {
      expect(emailInput.props.error).toEqual("We found an account with this email")
      const loginButton = tree.root.findByProps({ testID: "loginButton" })
      loginButton.props.onPress()
      expect(replaceMock).toHaveBeenCalledWith("OnboardingLogin", {
        withFadeAnimation: true,
        email: "used-email@example.com",
      })
    }, 2000)
  })
})

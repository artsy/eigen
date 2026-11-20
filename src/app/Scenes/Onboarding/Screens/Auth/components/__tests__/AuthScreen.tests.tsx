import { screen } from "@testing-library/react-native"
import { AuthContext } from "app/Scenes/Onboarding/Screens/Auth/AuthContext"
import { AuthScreen } from "app/Scenes/Onboarding/Screens/Auth/components/AuthScreen"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("AuthScreen", () => {
  it("is visible when it is the current screen", async () => {
    jest
      .spyOn(AuthContext, "useStoreState")
      .mockReturnValue({ currentScreen: { name: "LoginWelcomeStep" } })
    await renderWithWrappers(<AuthScreen name="LoginWelcomeStep" />)

    expect(screen.getByTestId("auth-screen")).toBeVisible()
    expect(screen.getByTestId("auth-screen").props.zIndex).toEqual(1)
  })

  it("is not visible when it is not the current screen", async () => {
    jest
      .spyOn(AuthContext, "useStoreState")
      .mockReturnValue({ currentScreen: { name: "SignUpPasswordStep" } })
    await renderWithWrappers(<AuthScreen name="LoginWelcomeStep" />)

    expect(screen.queryByTestId("auth-screen")).toBeNull()
  })
})

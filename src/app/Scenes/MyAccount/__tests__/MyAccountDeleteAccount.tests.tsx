import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { MyAccountDeleteAccountTestsQuery } from "__generated__/MyAccountDeleteAccountTestsQuery.graphql"
import { MyAccountDeleteAccountFragmentContainer } from "app/Scenes/MyAccount/MyAccountDeleteAccount"
import { deleteUserAccount } from "app/Scenes/MyAccount/deleteUserAccount"
import { GlobalStore } from "app/store/GlobalStore"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Alert, InteractionManager } from "react-native"
import { graphql } from "react-relay"

jest.mock("app/Scenes/MyAccount/deleteUserAccount", () => ({
  deleteUserAccount: jest.fn(),
}))

describe("MyAccountDeleteAccount", () => {
  const { renderWithRelay } = setupTestWrapper<MyAccountDeleteAccountTestsQuery>({
    Component: (props) => <MyAccountDeleteAccountFragmentContainer me={props.me!} />,
    query: graphql`
      query MyAccountDeleteAccountTestsQuery @relay_test_operation {
        me {
          ...MyAccountDeleteAccount_me
        }
      }
    `,
  })

  let alert: jest.SpyInstance
  let signOut: jest.SpyInstance

  beforeEach(() => {
    ;(deleteUserAccount as jest.Mock).mockResolvedValue({
      deleteMyAccountMutation: { userAccountOrError: { success: true } },
    })
    alert = jest.spyOn(Alert, "alert")
    signOut = jest.spyOn(GlobalStore.actions.auth, "signOut").mockResolvedValue(undefined as any)
    jest.spyOn(InteractionManager, "runAfterInteractions").mockImplementation((task: any) => {
      task()
      return { then: jest.fn(), done: jest.fn(), cancel: jest.fn() } as any
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("signs out only once the confirmation alert is dismissed", async () => {
    renderWithRelay({ Me: () => ({ hasPassword: true }) })

    fireEvent.changeText(
      screen.getByPlaceholderText("Please share with us why you are leaving"),
      "Testing"
    )
    fireEvent.changeText(screen.getByPlaceholderText("Enter your password to continue"), "secret")
    fireEvent.press(screen.getByRole("button", { name: "Delete My Account" }))

    await waitFor(() =>
      expect(alert).toHaveBeenCalledWith(
        "Account deletion request submitted!",
        expect.any(String),
        expect.any(Array)
      )
    )
    expect(signOut).not.toHaveBeenCalled()

    const [okButton] = alert.mock.calls[0][2]
    okButton.onPress()

    expect(signOut).toHaveBeenCalled()
  })
})

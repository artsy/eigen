import { fireEvent } from "@testing-library/react-native"
import { MyAccountEditEmailTestsQuery } from "__generated__/MyAccountEditEmailTestsQuery.graphql"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MyAccountEditEmailContainer, MyAccountEditEmailQueryRenderer } from "./MyAccountEditEmail"

const mockShow = jest.fn()
const mockHide = jest.fn()
const mockHideOldest = jest.fn()

jest.mock("app/Components/Toast/toastHook", () => ({
  ...jest.requireActual("app/Components/Toast/toastHook"),
  useToast: () => ({
    show: mockShow,
    hide: mockHide,
    hideOldest: mockHideOldest,
  }),
}))

describe(MyAccountEditEmailQueryRenderer, () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapper<MyAccountEditEmailTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return <MyAccountEditEmailContainer me={props.me} />
      }
      return null
    },
    query: graphql`
      query MyAccountEditEmailTestsQuery @relay_test_operation {
        me {
          ...MyAccountEditEmail_me
        }
      }
    `,
  })

  it("shows confirm email toast when email is changed", async () => {
    const { getByText, getByLabelText, env } = renderWithRelay({
      Me: () => ({
        email: "old-email@test.com",
      }),
    })

    await flushPromiseQueue()

    expect(getByText("Email")).toBeTruthy()

    const input = getByLabelText("email-input")
    expect(input.props.value).toEqual("old-email@test.com")

    fireEvent.changeText(input, "new-email@test.com")
    expect(input.props.value).toEqual("new-email@test.com")

    const saveButton = getByLabelText("save-button")
    fireEvent.press(saveButton)

    resolveMostRecentRelayOperation(env, {
      Me: () => ({
        email: "new-email@test.com",
      }),
    })

    await flushPromiseQueue()

    expect(mockShow).toHaveBeenCalledWith(
      "Please confirm your new email for this update to take effect",
      "middle",
      {
        duration: "long",
      }
    )
  })

  it("does not show confirm email toast when email did not change", async () => {
    const { getByText, getByLabelText, env } = renderWithRelay({
      Me: () => ({
        email: "old-email@test.com",
      }),
    })

    await flushPromiseQueue()

    expect(getByText("Email")).toBeTruthy()

    const input = getByLabelText("email-input")
    expect(input.props.value).toEqual("old-email@test.com")

    fireEvent.changeText(input, "old-email@test.com")
    expect(input.props.value).toEqual("old-email@test.com")

    const saveButton = getByLabelText("save-button")
    fireEvent.press(saveButton)

    resolveMostRecentRelayOperation(env, {
      Me: () => ({
        email: "old-email@test.com",
      }),
    })

    await flushPromiseQueue()

    expect(mockShow).not.toHaveBeenCalled()
  })
})

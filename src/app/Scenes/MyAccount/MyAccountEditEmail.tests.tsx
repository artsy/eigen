import { fireEvent } from "@testing-library/react-native"
import { MyAccountEditEmailTestsQuery } from "__generated__/MyAccountEditEmailTestsQuery.graphql"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { flushPromiseQueue } from "../../tests/flushPromiseQueue"
import { MyAccountEditEmailContainer } from "./MyAccountEditEmail"

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

describe("MyAccountEditEmailQueryRenderer", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const TestRenderer = () => (
    <QueryRenderer<MyAccountEditEmailTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query MyAccountEditEmailTestsQuery @relay_test_operation {
          me {
            ...MyAccountEditEmail_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.me) {
          return <MyAccountEditEmailContainer me={props.me} />
        }
        return null
      }}
    />
  )
  it("shows confirm email toast when email is changed", async () => {
    const { getByText, getByLabelText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
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

    resolveMostRecentRelayOperation({
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
    const { getByText, getByLabelText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation({
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

    resolveMostRecentRelayOperation({
      Me: () => ({
        email: "old-email@test.com",
      }),
    })

    await flushPromiseQueue()

    expect(mockShow).not.toHaveBeenCalled()
  })
})

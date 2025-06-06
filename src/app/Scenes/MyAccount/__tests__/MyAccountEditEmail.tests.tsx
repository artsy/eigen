import { screen } from "@testing-library/react-native"
import { MyAccountEditEmailTestsQuery } from "__generated__/MyAccountEditEmailTestsQuery.graphql"
import { MyAccountEditEmail } from "app/Scenes/MyAccount/MyAccountEditEmail"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

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

  const { renderWithRelay } = setupTestWrapper<MyAccountEditEmailTestsQuery>({
    Component: (props) => {
      if (props?.me) {
        return <MyAccountEditEmail me={props.me} />
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

  it("show email input", async () => {
    renderWithRelay({
      Me: () => ({
        email: "old-email@test.com",
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByLabelText("email-input")).toBeTruthy()
  })
})

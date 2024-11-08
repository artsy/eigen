import { screen } from "@testing-library/react-native"
import { MyAccountEditEmailTestsQuery } from "__generated__/MyAccountEditEmailTestsQuery.graphql"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
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

import { act, screen } from "@testing-library/react-native"
import { UserProfileQueryRenderer } from "app/Scenes/MyProfile/LoggedInUserInfo"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Components/Spinner", () => {
  const { View } = require("react-native")
  return { __esModule: true, default: () => <View testID="spinner" /> }
})

describe(UserProfileQueryRenderer, () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = getMockRelayEnvironment()
  })

  it("spins until the operation resolves", async () => {
    await renderWithWrappers(<UserProfileQueryRenderer />)
    expect(screen.getAllByTestId("spinner")).toHaveLength(1)
  })

  it("renders upon sucess", async () => {
    await renderWithWrappers(<UserProfileQueryRenderer />)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "LoggedInUserInfoQuery"
    )

    await act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          me: {
            name: "Unit Test User",
            email: "example@example.com",
          },
        },
      })
    })

    expect(screen.queryByTestId("spinner")).not.toBeOnTheScreen()
    // A single line of text with the user's info, and nothing else
    expect(screen.getAllByText(/.*/)).toHaveLength(1)
    expect(screen.getByText("Logged in as: Unit Test User (example@example.com)")).toBeOnTheScreen()
  })

  it("renders null upon failure", async () => {
    await renderWithWrappers(<UserProfileQueryRenderer />)

    await rejectMostRecentRelayOperation(env, new Error())

    // Nothing is rendered: no spinner and no text
    expect(screen.queryByTestId("spinner")).not.toBeOnTheScreen()
    expect(screen.queryAllByText(/.*/)).toHaveLength(0)
  })
})

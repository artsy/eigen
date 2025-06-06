import { Text } from "@artsy/palette-mobile"
import Spinner from "app/Components/Spinner"
import { UserProfileQueryRenderer } from "app/Scenes/MyProfile/LoggedInUserInfo"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { extractText } from "app/utils/tests/extractText"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

describe(UserProfileQueryRenderer, () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = getMockRelayEnvironment()
  })

  it("spins until the operation resolves", () => {
    const tree = renderWithWrappersLEGACY(<UserProfileQueryRenderer />)
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)
  })

  it("renders upon sucess", () => {
    const tree = renderWithWrappersLEGACY(<UserProfileQueryRenderer />)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "LoggedInUserInfoQuery"
    )

    act(() => {
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

    const userInfo = tree.root.findAllByType(Text)
    expect(userInfo).toHaveLength(1)
    expect(extractText(tree.root)).toContain("Unit Test User (example@example.com)")
  })

  it("renders null upon failure", () => {
    const tree = renderWithWrappersLEGACY(<UserProfileQueryRenderer />)

    rejectMostRecentRelayOperation(env, new Error())

    expect(tree).toMatchInlineSnapshot(`null`)
  })
})

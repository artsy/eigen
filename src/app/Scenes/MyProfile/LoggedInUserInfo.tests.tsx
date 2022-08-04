import Spinner from "app/Components/Spinner"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractText } from "app/tests/extractText"
import { rejectMostRecentRelayOperation } from "app/tests/rejectMostRecentRelayOperation"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { Text } from "palette"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { MyProfileQueryRenderer } from "./LoggedInUserInfo"

jest.unmock("react-relay")
const env = defaultEnvironment as any as ReturnType<typeof createMockEnvironment>

describe(MyProfileQueryRenderer, () => {
  it("spins until the operation resolves", () => {
    const tree = renderWithWrappersLEGACY(<MyProfileQueryRenderer />)
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)
  })

  it("renders upon sucess", () => {
    const tree = renderWithWrappersLEGACY(<MyProfileQueryRenderer />)
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
    const tree = renderWithWrappersLEGACY(<MyProfileQueryRenderer />)

    rejectMostRecentRelayOperation(env, new Error())

    expect(tree).toMatchInlineSnapshot(`null`)
  })
})

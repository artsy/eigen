import Spinner from "app/Components/Spinner"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import {
  rejectMostRecentRelayOperation,
  resolveMostRecentRelayOperationRawPayload,
} from "app/tests/resolveMostRecentRelayOperation"
import { Text } from "palette"
import { UserProfileQueryRenderer } from "./LoggedInUserInfo"

describe(UserProfileQueryRenderer, () => {
  it("spins until the operation resolves", () => {
    const tree = renderWithWrappersLEGACY(<UserProfileQueryRenderer />)
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)
  })

  it("renders upon sucess", () => {
    const tree = renderWithWrappersLEGACY(<UserProfileQueryRenderer />)
    resolveMostRecentRelayOperationRawPayload({
      errors: [],
      data: {
        me: {
          name: "Unit Test User",
          email: "example@example.com",
        },
      },
    })

    const userInfo = tree.root.findAllByType(Text)
    expect(userInfo).toHaveLength(1)
    expect(extractText(tree.root)).toContain("Unit Test User (example@example.com)")
  })

  it("renders null upon failure", () => {
    const tree = renderWithWrappersLEGACY(<UserProfileQueryRenderer />)

    rejectMostRecentRelayOperation(new Error())

    expect(tree).toMatchInlineSnapshot(`null`)
  })
})

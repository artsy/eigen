import { Serif, Theme } from "@artsy/palette"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import React from "react"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { UserProfileQueryRenderer } from "../LoggedInUserInfo"

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

jest.unmock("react-relay")
const env = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe(UserProfileQueryRenderer, () => {
  it("renders", async () => {
    const tree = ReactTestRenderer.create(
      <Theme>
        <UserProfileQueryRenderer />
      </Theme>
    )
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("LoggedInUserInfoQuery")

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

    const userInfo = tree.root.findAllByType(Serif)
    expect(userInfo).toHaveLength(1)
    expect(extractText(tree.root)).toContain("Unit Test User (example@example.com)")
  })
})

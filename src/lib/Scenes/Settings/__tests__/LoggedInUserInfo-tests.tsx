import { Serif, Theme } from "@artsy/palette"
import Spinner from "lib/Components/Spinner"
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
  it("spins until the operation resolves", () => {
    const tree = ReactTestRenderer.create(
      <Theme>
        <UserProfileQueryRenderer />
      </Theme>
    )
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)
  })

  it("renders upon sucess", () => {
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

  it("renders null upon failure", () => {
    const tree = ReactTestRenderer.create(
      <Theme>
        <UserProfileQueryRenderer />
      </Theme>
    )

    act(() => {
      env.mock.rejectMostRecentOperation(new Error())
    })

    expect(tree).toMatchInlineSnapshot(`null`)
  })
})

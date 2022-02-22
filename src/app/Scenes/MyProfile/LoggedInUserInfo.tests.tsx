import Spinner from "app/Components/Spinner"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Serif } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { UserProfileQueryRenderer } from "./LoggedInUserInfo"

jest.unmock("react-relay")
const env = defaultEnvironment as any as ReturnType<typeof createMockEnvironment>

describe(UserProfileQueryRenderer, () => {
  it("spins until the operation resolves", () => {
    const tree = renderWithWrappers(<UserProfileQueryRenderer />)
    expect(tree.root.findAllByType(Spinner)).toHaveLength(1)
  })

  it("renders upon sucess", () => {
    const tree = renderWithWrappers(<UserProfileQueryRenderer />)
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

    const userInfo = tree.root.findAllByType(Serif)
    expect(userInfo).toHaveLength(1)
    expect(extractText(tree.root)).toContain("Unit Test User (example@example.com)")
  })

  it("renders null upon failure", () => {
    const tree = renderWithWrappers(<UserProfileQueryRenderer />)

    act(() => {
      env.mock.rejectMostRecentOperation(new Error())
    })

    expect(tree).toMatchInlineSnapshot(`null`)
  })
})

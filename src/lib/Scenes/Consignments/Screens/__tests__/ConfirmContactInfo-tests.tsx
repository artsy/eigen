import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { Alert } from "react-native"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ConfirmContactInfoQueryRenderer } from "../ConfirmContactInfo"

jest.unmock("react-relay")
jest.mock("lib/relay/createEnvironment", () => {
  return {
    defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
  }
})

const env = defaultEnvironment as ReturnType<typeof createMockEnvironment>
const navigator = { push: jest.fn() } as any
const submissionRequestValidationCheck = jest.fn()

jest.spyOn(Alert, "alert")

beforeEach(() => {
  navigator.push.mockClear()
  submissionRequestValidationCheck.mockClear()
  env.mockClear()
  ;(Alert.alert as jest.Mock).mockClear()
})

const render = () => {
  return renderWithWrappers(
    <ConfirmContactInfoQueryRenderer
      navigator={navigator}
      submissionRequestValidationCheck={submissionRequestValidationCheck}
    />
  )
}

describe("ConfirmContactInfo", () => {
  it("shows a phone input", () => {
    const tree = render()
    env.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        Me() {
          return { phone: "+447825577663" }
        },
      })
    )
    expect(tree.root.findAllByType(PhoneInput)).toHaveLength(1)
    expect(tree.root.findByType(PhoneInput).props.value).toBe("+447825577663")
  })

  it("shows a submit button", () => {
    const tree = render()
    env.mock.resolveMostRecentOperation((op) => MockPayloadGenerator.generate(op))
    expect(tree.root.findAllByType(Button)).toHaveLength(1)
    expect(extractText(tree.root.findByType(Button))).toMatch("Submit")
  })

  it("updates the users phone number when submitting", async () => {
    const tree = render()
    await act(() =>
      env.mock.resolveMostRecentOperation((op) =>
        MockPayloadGenerator.generate(op, {
          Me() {
            return { phone: "+447825577663" }
          },
        })
      )
    )
    await act(() => {
      tree.root.findByType(PhoneInput).props.onChangeText("+15558902345")
    })
    tree.root.findByType(Button).props.onPress()
    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("updateMyUserProfileMutation")
    expect(env.mock.getMostRecentOperation().request.variables).toEqual({ input: { phone: "+15558902345" } })
  })

  it("shows an alert if something went wrong", async () => {
    const tree = render()
    await act(() =>
      env.mock.resolveMostRecentOperation((op) =>
        MockPayloadGenerator.generate(op, {
          Me() {
            return { phone: "+447825577663" }
          },
        })
      )
    )
    tree.root.findByType(Button).props.onPress()
    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("updateMyUserProfileMutation")

    expect(Alert.alert).not.toHaveBeenCalled()
    await act(() => {
      env.mock.rejectMostRecentOperation(new Error())
    })
    await flushPromiseQueue()
    expect(Alert.alert).toHaveBeenCalled()
  })
})

import { waitFor } from "@testing-library/react-native"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractText } from "app/tests/extractText"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers, renderWithWrappersTL } from "app/tests/renderWithWrappers"
import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import { Button } from "palette"
import { PhoneInput } from "palette/elements/Input/PhoneInput/PhoneInput"
import { Alert } from "react-native"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { ConfirmContactInfoQueryRenderer } from "./ConfirmContactInfo"

jest.unmock("react-relay")

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
    <NavigatorIOS
      initialRoute={{
        component: ConfirmContactInfoQueryRenderer,
        passProps: {
          navigator,
          submissionRequestValidationCheck,
        },
      }}
    />
  )
}

describe("ConfirmContactInfo", () => {
  it("shows a pre-populated phone input and submit is enabled", async () => {
    const { getByA11yLabel, getByPlaceholderText } = renderWithWrappersTL(
      <NavigatorIOS
        initialRoute={{
          component: ConfirmContactInfoQueryRenderer,
          passProps: {
            navigator,
            submissionRequestValidationCheck,
          },
        }}
      />
    )
    env.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        Me() {
          return { phone: "+447825577663" }
        },
      })
    )

    const phoneInput = getByPlaceholderText("0000 000000")
    expect(phoneInput).toBeTruthy()
    expect(phoneInput).toHaveProp("value", "7825 577663")
    await waitFor(() => expect(getByA11yLabel("Submit")).not.toBeDisabled())
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
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "updateMyUserProfileMutation"
    )
    expect(env.mock.getMostRecentOperation().request.variables).toEqual({
      input: { phone: "+1 (555) 890-2345" },
    })
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
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "updateMyUserProfileMutation"
    )

    expect(Alert.alert).not.toHaveBeenCalled()
    await act(() => {
      env.mock.rejectMostRecentOperation(new Error())
    })
    await flushPromiseQueue()
    expect(Alert.alert).toHaveBeenCalled()
  })
})

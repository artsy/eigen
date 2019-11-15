import { Theme } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { CatchErrors } from "lib/utils/CatchErrors"
import React from "react"
import { TouchableOpacity } from "react-native"
import ReactTestRenderer, { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { AutosuggestResult, AutosuggestResults } from "../AutosuggestResults"

const TestWrapper: typeof AutosuggestResults = props => (
  <Theme>
    <CatchErrors>
      <AutosuggestResults {...props} />
    </CatchErrors>
  </Theme>
)

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

jest.mock("lodash", () => ({
  throttle: f => f,
}))

jest.unmock("react-relay")

// tslint:disable-next-line:no-empty
jest.mock("react-native-sentry", () => ({ captureMessage() {} }))

jest.mock("lib/NativeModules/SwitchBoard", () => ({ presentNavigationViewController: jest.fn() }))

const env = defaultEnvironment as ReturnType<typeof createMockEnvironment>

const consoleErrorMock = jest.fn()
console.error = (...args: string[]) => {
  if (args[0].startsWith("Warning: An update to %s inside a test was not wrapped in act(...).")) {
    return
  }
  consoleErrorMock(...args)
}

describe("AutosuggestResults", () => {
  beforeEach(() => {
    env.mockClear()
    consoleErrorMock.mockClear()
  })

  afterEach(() => {
    expect(consoleErrorMock).not.toHaveBeenCalled()
  })

  it(`has no elements to begin with`, async () => {
    const tree = ReactTestRenderer.create(<TestWrapper query="" />)
    expect(tree.root.findAllByType(AutosuggestResult)).toHaveLength(0)
  })

  it(`makes a request for search results when the query is not empty`, async () => {
    const tree = ReactTestRenderer.create(<TestWrapper query="" />)
    expect(env.mock.getAllOperations()).toHaveLength(0)

    act(() => tree.update(<TestWrapper query="hey" />))

    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.variables.query).toBe("hey")
  })

  it(`makes a request for search results when the query is not empty`, async () => {
    const tree = ReactTestRenderer.create(<TestWrapper query="" />)
    expect(env.mock.getAllOperations()).toHaveLength(0)

    act(() => tree.update(<TestWrapper query="hey" />))

    expect(env.mock.getAllOperations()).toHaveLength(1)
    expect(env.mock.getMostRecentOperation().request.variables.query).toBe("hey")
  })

  it(`renders the appropriate results after having made the request`, async () => {
    let tree = null as ReactTestRenderer.ReactTestRenderer
    act(() => {
      tree = ReactTestRenderer.create(<TestWrapper query="michael" />)
    })
    expect(env.mock.getMostRecentOperation().request.variables.query).toBe("michael")

    env.mock.resolveMostRecentOperation(op =>
      MockPayloadGenerator.generate(op, {
        SearchableEdge(_, id) {
          return { node: { href: `${id()}` } }
        },
        SearchableConnection() {
          return { edges: [{}, {}, {}, {}, {}] }
        },
      })
    )

    await flushPromiseQueue()

    expect(tree.root.findAllByType(AutosuggestResult)).toHaveLength(5)
  })

  it(`clears the results if the query is empty again`, async () => {
    let tree = null as ReactTestRenderer.ReactTestRenderer
    act(() => {
      tree = ReactTestRenderer.create(<TestWrapper query="michael" />)
    })

    env.mock.resolveMostRecentOperation(op => MockPayloadGenerator.generate(op))

    await flushPromiseQueue()

    expect(tree.root.findAllByType(AutosuggestResult)).toHaveLength(1)

    act(() => {
      tree.update(<TestWrapper query="" />)
    })

    expect(tree.root.findAllByType(AutosuggestResult)).toHaveLength(0)

    expect(env.mock.getAllOperations()).toHaveLength(0)
  })

  it(`clears the results if the query returned an error`, async () => {
    let tree = null as ReactTestRenderer.ReactTestRenderer
    act(() => {
      tree = ReactTestRenderer.create(<TestWrapper query="michael" />)
    })

    env.mock.resolveMostRecentOperation(op => MockPayloadGenerator.generate(op))

    await flushPromiseQueue()

    expect(tree.root.findAllByType(AutosuggestResult)).toHaveLength(1)

    act(() => {
      tree.update(<TestWrapper query="jackson" />)
    })

    env.mock.rejectMostRecentOperation(new Error("bad times"))

    await flushPromiseQueue()

    expect(tree.root.findAllByType(AutosuggestResult)).toHaveLength(0)
  })

  it(`lets you navigate to the result`, async () => {
    let tree = null as ReactTestRenderer.ReactTestRenderer
    act(() => {
      tree = ReactTestRenderer.create(<TestWrapper query="michael" />)
    })

    env.mock.resolveMostRecentOperation(op =>
      MockPayloadGenerator.generate(op, {
        SearchableConnection() {
          return { edges: [{ node: { href: "michael-jackson.html" } }, { node: { href: "michael-jordan.html" } }] }
        },
      })
    )

    await flushPromiseQueue()

    const results = tree.root.findAllByType(AutosuggestResult)

    expect(SwitchBoard.presentNavigationViewController).not.toHaveBeenCalled()

    results[0].findByType(TouchableOpacity).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "michael-jackson.html")

    results[1].findByType(TouchableOpacity).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(expect.anything(), "michael-jordan.html")
  })
})

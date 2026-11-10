import { captureMessage } from "@sentry/react-native"
import { assertNever } from "app/utils/assertNever"

jest.mock("@sentry/react-native", () => ({
  captureMessage: jest.fn(),
}))

describe("assertNever", () => {
  const originalDev = __DEV__

  afterEach(() => {
    // @ts-expect-error __DEV__ is a global constant
    global.__DEV__ = originalDev
    jest.clearAllMocks()
  })

  it("throws in development", () => {
    // @ts-expect-error __DEV__ is a global constant
    global.__DEV__ = true

    expect(() => assertNever({ subject: "Gallery Name" } as never)).toThrow(
      'assertNever: unexpected value {"subject":"Gallery Name"}'
    )
    expect(captureMessage).not.toHaveBeenCalled()
  })

  it("reports to Sentry instead of crashing in production", () => {
    // @ts-expect-error __DEV__ is a global constant
    global.__DEV__ = false

    expect(() => assertNever({ subject: "Gallery Name" } as never)).not.toThrow()
    expect(captureMessage).toHaveBeenCalledWith(
      'assertNever: unexpected value {"subject":"Gallery Name"}',
      "warning"
    )
  })
})

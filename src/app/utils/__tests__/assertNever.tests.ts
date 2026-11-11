import { assertNever } from "app/utils/assertNever"

describe("assertNever", () => {
  it("throws with the unexpected value", () => {
    expect(() => assertNever({ type: "unknown" } as never)).toThrow(
      'assertNever: unexpected value {"type":"unknown"}'
    )
  })
})

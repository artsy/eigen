import { assignDeep, sanitize } from "app/store/persistence/utils"

jest.mock("../migration", () => ({ migrate: jest.fn((a) => a.state) }))

describe("sanitize", () => {
  const fixture = {
    sessionState: { blah: true },
    get computedProperty() {
      return 3
    },
    persistedProperty: true,
    bar: {
      sessionState: { blah: true },
      get nestedComputedProperty() {
        return 3
      },
      nestedPersistedProperty: "hello",
    },
    baz: [
      {
        sessionState: { blah: true },
        get nestedInArrayComputedProperty() {
          return 3
        },
        nestedInArrayPersistedProperty: 3,
      },
    ],
  }

  it("removes computed properties and session states", () => {
    expect(sanitize(fixture)).toEqual({
      persistedProperty: true,
      bar: {
        nestedPersistedProperty: "hello",
      },
      baz: [{ nestedInArrayPersistedProperty: 3 }],
    })
  })

  it("can't serialize non-json-compatible properties", () => {
    expect(sanitize({ regex: /abcdef/g })).toEqual({ regex: null })
    expect(console.error).toHaveBeenCalled()
    expect((console.error as jest.Mock).mock.calls[0][0]).toMatchInlineSnapshot(
      `"Cannot serialize value at path regex: /abcdef/g"`
    )
  })
})

describe("assignDeep", () => {
  it("merges one object into another, modifying the underlying object", () => {
    const obj = {
      foo: true,
    }
    assignDeep(obj, { bar: true })
    expect(obj).toEqual({ foo: true, bar: true })
  })
  it("overwrites existing properties", () => {
    const obj = {
      foo: true,
      bar: false,
    }
    assignDeep(obj, { bar: true })
    expect(obj).toEqual({ foo: true, bar: true })
  })
  it("deeply merges aligned objects", () => {
    const obj = {
      level0: {
        a: false,
        b: true,
        level1: {
          a: false,
          b: true,
        },
      },
    }
    assignDeep(obj, {
      level0: {
        a: true,
        c: true,
        level1: {
          a: true,
          c: true,
        },
      },
    })
    expect(obj).toEqual({
      level0: {
        a: true,
        b: true,
        c: true,
        level1: {
          a: true,
          b: true,
          c: true,
        },
      },
    })
  })
  it("overwrites misaligned objects", () => {
    const obj = {
      foo: { bar: true },
      bar: true,
      baz: false,
    }
    assignDeep(obj, { foo: true, bar: { foo: true } })
    expect(obj).toEqual({ foo: true, bar: { foo: true }, baz: false })
  })
  it("does not merge inside arrays", () => {
    const obj = {
      foo: [{ bar: true }],
    }
    assignDeep(obj, { foo: [{}] })
    expect(obj).toEqual({ foo: [{}] })
  })
})

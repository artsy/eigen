import { objectToGraphQLInput } from "../objectToGraphQL"

describe("JS -> GQL", () => {
  it("handles some string", () => {
    const result = `{ a: "a", b: "b" }`
    const input = { a: "a", b: "b" }
    expect(objectToGraphQLInput(input)).toEqual(result)
  })

  it("handles some numbers", () => {
    const result = `{ a: 6, b: "b" }`
    const input = { a: 6, b: "b" }
    expect(objectToGraphQLInput(input)).toEqual(result)
  })

  it("ignores null values", () => {
    const result = `{ a: 6 }`
    const input = { a: 6, b: null }
    expect(objectToGraphQLInput(input)).toEqual(result)
  })

  it("handles enums correctly", () => {
    const result = `{ a: 6, b: NO, c: "NO" }`
    const input = { a: 6, b: "NO", c: "NO" }
    expect(objectToGraphQLInput(input, ["b"])).toEqual(result)
  })

  it("handles bools correctly", () => {
    const result = "{ a: true, b: false }"
    const input = { a: true, b: false, c: undefined }
    expect(objectToGraphQLInput(input, ["b"])).toEqual(result)
  })
})

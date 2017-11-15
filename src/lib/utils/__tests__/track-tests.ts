import { Schema } from "../track"

describe("analytics constants", () => {
  it("action names all start with a lowercase", () => {
    // grab string values from enum
    const values = Object.keys(Schema.ActionNames).map(k => Schema.ActionNames[k as any])
    values.map(name => expect(name[0] === name[0].toLowerCase()).toBeTruthy())
  })
})

import { validatePresence } from "../index"

describe("Presence validator", () => {
  it("returns null when the input is present", () => {
    expect(validatePresence("Yuki Nishijima")).toEqual(null)
    expect(validatePresence(["url/to/uploaded/image.jpg"])).toEqual(null)
    expect(validatePresence({ firstName: "Yuki", lastName: "Nishijima" })).toEqual(null)
  })

  it("returns an error message when the input is not present", () => {
    expect(validatePresence(null)).toEqual("This field is required")
    expect(validatePresence(undefined)).toEqual("This field is required")
    expect(validatePresence(false)).toEqual("This field is required")
    expect(validatePresence("")).toEqual("This field is required")
    expect(validatePresence([])).toEqual("This field is required")
    expect(validatePresence({})).toEqual("This field is required")
  })
})

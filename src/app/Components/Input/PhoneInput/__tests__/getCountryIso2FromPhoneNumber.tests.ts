import { getCountryIso2FromPhoneNumber } from "app/Components/Input/PhoneInput/getCountryIso2FromPhoneNumber"

describe(getCountryIso2FromPhoneNumber, () => {
  it("works for canada", () => {
    expect(getCountryIso2FromPhoneNumber("+1-613-555-0131")).toBe("ca")
  })
  it("works for uk", () => {
    expect(getCountryIso2FromPhoneNumber("+44 7824 334455")).toBe("gb")
  })
  it("works for usa", () => {
    expect(getCountryIso2FromPhoneNumber("+1 (212) 509-6995")).toBe("us")
  })
  it("works for china", () => {
    expect(getCountryIso2FromPhoneNumber("+86 0755-29929015")).toBe("cn")
  })
  it("works for china", () => {
    expect(getCountryIso2FromPhoneNumber("+86 0755-29929015")).toBe("cn")
  })
  it("works for montserrat", () => {
    expect(getCountryIso2FromPhoneNumber("+16644915210")).toBe("ms")
  })
})

import { mockFullAddress, mockPartiallyEmptyAddress } from "../__mocks__/billingAddress"
import { validateAddressFieldsPresence } from "./validateAddressFieldsPresence"

describe("Presence validator", () => {
  it("returns empty array when all required address fields present", () => {
    expect(validateAddressFieldsPresence(mockFullAddress)).toEqual([])
  })

  it("correctly returns missing fields' keys as string[]", () => {
    expect(validateAddressFieldsPresence(mockPartiallyEmptyAddress)).toEqual([
      "fullName",
      "state",
      "country",
    ])
  })
})

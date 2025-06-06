import { validateAddressFieldsPresence } from "app/Components/Bidding/Validators/validateAddressFieldsPresence"
import {
  mockFullAddress,
  mockPartiallyEmptyAddress,
} from "app/Components/Bidding/__mocks__/billingAddress"

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

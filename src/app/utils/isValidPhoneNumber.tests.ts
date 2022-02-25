import { isValidPhoneNumber } from "./isValidPhoneNumber"

describe("Test numbers for validity", () => {
  it("returns true for valid numbers", () => {
    const validPhoneNumber = "+30 6936101101"
    const validPhoneNumber0 = "+30 693 6101101"
    const validPhoneNumber01 = "+30 (693) 6101101"

    expect(isValidPhoneNumber(validPhoneNumber)).toBeTrue()
    expect(isValidPhoneNumber(validPhoneNumber0)).toBeTrue()
    expect(isValidPhoneNumber(validPhoneNumber01)).toBeTrue()

    const validPhoneNumber1 = "+1 12312312323"
    const validPhoneNumber11 = "+1 (123) 12312323"
    expect(isValidPhoneNumber(validPhoneNumber1)).toBeTrue()
    expect(isValidPhoneNumber(validPhoneNumber11)).toBeTrue()
  })
  it("returns false for non valid number", () => {
    const invalidPhoneNumber = "+30 693610110123523456"
    const invalidPhoneNumber0 = "+3035"
    const invalidPhoneNumber01 = "154"
    const invalidPhoneNumber1 = "1544567894567"
    expect(isValidPhoneNumber(invalidPhoneNumber)).not.toBeTrue()
    expect(isValidPhoneNumber(invalidPhoneNumber0)).not.toBeTrue()
    expect(isValidPhoneNumber(invalidPhoneNumber01)).not.toBeTrue()
    expect(isValidPhoneNumber(invalidPhoneNumber1)).not.toBeTrue()
  })
})

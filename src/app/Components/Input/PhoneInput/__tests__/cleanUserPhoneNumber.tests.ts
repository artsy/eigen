import { cleanUserPhoneNumber } from "app/Components/Input/PhoneInput/cleanUserPhoneNumber"
import { getCountry } from "react-native-localize"

describe(cleanUserPhoneNumber, () => {
  it("handles +-prefixed numbers correctly", () => {
    expect(cleanUserPhoneNumber("+33 32423 5342")).toEqual({
      countryCode: "fr",
      phoneNumber: "324235342",
    })
    expect(cleanUserPhoneNumber("+18076221000")).toEqual({
      countryCode: "ca",
      phoneNumber: "8076221000",
    })
    expect(cleanUserPhoneNumber("+1(555)-622-100")).toEqual({
      countryCode: "us",
      phoneNumber: "555622100",
    })
  })
  it("handles international dialing prefixes for different countries", () => {
    ;(getCountry as jest.Mock).mockReturnValueOnce("GB")
    expect(cleanUserPhoneNumber("0044237482934")).toEqual({
      countryCode: "gb",
      phoneNumber: "237482934",
    })
    ;(getCountry as jest.Mock).mockReturnValueOnce("US")
    expect(cleanUserPhoneNumber("0113343523453434")).toEqual({
      countryCode: "fr",
      phoneNumber: "43523453434",
    })
    ;(getCountry as jest.Mock).mockReturnValueOnce("US")
    expect(cleanUserPhoneNumber("0111(555)-823-394")).toEqual({
      countryCode: "us",
      phoneNumber: "555823394",
    })
    ;(getCountry as jest.Mock).mockReturnValueOnce("AU")
    expect(cleanUserPhoneNumber("001149543645878")).toEqual({
      countryCode: "de",
      phoneNumber: "543645878",
    })
    ;(getCountry as jest.Mock).mockReturnValueOnce("AU")
    expect(cleanUserPhoneNumber("001449543645878")).toEqual({
      countryCode: "de",
      phoneNumber: "543645878",
    })
  })
  it("removes trunk codes when no country code is available", () => {
    ;(getCountry as jest.Mock).mockReturnValueOnce("GB")
    expect(cleanUserPhoneNumber("07825577554")).toEqual({
      countryCode: "gb",
      phoneNumber: "7825577554",
    })
    ;(getCountry as jest.Mock).mockReturnValueOnce("US")
    expect(cleanUserPhoneNumber("17187558131")).toEqual({
      countryCode: "us",
      phoneNumber: "7187558131",
    })
  })
  it("leaves the trunk code intact if it doesn't make sense in the user's current locale", () => {
    ;(getCountry as jest.Mock).mockReturnValueOnce("US")
    expect(cleanUserPhoneNumber("07825577554")).toEqual({
      countryCode: "us",
      phoneNumber: "07825577554",
    })
    ;(getCountry as jest.Mock).mockReturnValueOnce("GB")
    expect(cleanUserPhoneNumber("17187558131")).toEqual({
      countryCode: "gb",
      phoneNumber: "17187558131",
    })
  })
})

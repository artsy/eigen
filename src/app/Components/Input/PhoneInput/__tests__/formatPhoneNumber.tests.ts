import { formatPhoneNumber } from "app/Components/Input/PhoneInput/formatPhoneNumber"

describe(formatPhoneNumber, () => {
  it("leaves the current value alone if the user is deleting characters", () => {
    expect(
      formatPhoneNumber({
        current: "(333)-894900",
        previous: "(333)-894-900",
        countryCode: "us",
      })
    ).toBe("(333)-894900")

    expect(
      formatPhoneNumber({
        current: "(333-894-900",
        previous: "(333)-894-900",
        countryCode: "us",
      })
    ).toBe("(333-894-900")
  })

  it("works with empty strings", () => {
    expect(
      formatPhoneNumber({
        current: "",
        previous: "(333)-894-900",
        countryCode: "us",
      })
    ).toBe("")

    expect(
      formatPhoneNumber({
        current: "",
        countryCode: "us",
      })
    ).toBe("")
  })

  it("formats a given phone number to the given country's default format", () => {
    expect(
      formatPhoneNumber({
        current: "7825577664",
        countryCode: "gb",
      })
    ).toBe("7825 577664")

    expect(
      formatPhoneNumber({
        current: "782557766",
        countryCode: "us",
      })
    ).toBe("(782) 557-766")
  })
})

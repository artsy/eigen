import { userProfileYupSchema } from "app/Scenes/MyProfile/Components/UserProfileFields"

const isValid = (values: { instagram?: string; linkedIn?: string }) =>
  userProfileYupSchema.isValid({ name: "Collector", ...values })

describe("userProfileYupSchema", () => {
  it("accepts handles with leading or trailing whitespace", async () => {
    expect(await isValid({ instagram: "artsy " })).toBe(true)
    expect(await isValid({ instagram: " @artsy.shop " })).toBe(true)
    expect(await isValid({ linkedIn: "artsy-net " })).toBe(true)
  })

  it("still rejects handles with invalid characters", async () => {
    expect(await isValid({ instagram: "invalid handle!" })).toBe(false)
    expect(await isValid({ instagram: "two words" })).toBe(false)
    expect(await isValid({ linkedIn: "artsy.net" })).toBe(false)
  })

  it("accepts empty and whitespace-only handles", async () => {
    expect(await isValid({ instagram: "", linkedIn: "" })).toBe(true)
    expect(await isValid({ instagram: "  " })).toBe(true)
  })
})

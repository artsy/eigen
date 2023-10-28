import { Flex } from "@artsy/palette-mobile"

// import { Flex } from "@artsy/palette-mobile/dist/elements/Flex/Flex"

describe("slow flex", () => {
  it("does thing", () => {
    const flex = Flex
    expect(flex).toBeDefined()
    expect(flex).toBe(flex)
  })
})

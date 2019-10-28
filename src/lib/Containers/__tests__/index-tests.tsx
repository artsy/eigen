import exportsFromIndex from "../"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))
jest.mock("lib/options", () => ({ options: {} }))

it("should export all components", () => {
  expect(Object.keys(exportsFromIndex)).toMatchInlineSnapshot(`
    Array [
      "Artist",
      "Artwork",
      "BidFlow",
      "CitySavedList",
      "CityBMWList",
      "CitySectionList",
      "Conversation",
      "CityFairList",
      "Gene",
      "Fair",
      "Home",
      "Inbox",
      "Inquiry",
      "MyProfile",
      "Partner",
      "RegistrationFlow",
      "Show",
      "WorksForYou",
    ]
  `)
})

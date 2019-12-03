import exportsFromIndex from "../"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))
jest.mock("lib/options", () => ({ options: {} }))
jest.mock("@react-native-community/netinfo", () => {
  return {
    addEventListener: jest.fn(),
    isConnected: {
      fetch: () => {
        return new Promise(accept => {
          accept(false)
        })
      },
      addEventListener: jest.fn(),
    },
  }
})

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

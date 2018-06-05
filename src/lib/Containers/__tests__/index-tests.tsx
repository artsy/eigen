import exportsFromIndex from "../"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

it("should export all components", () => {
  expect(Object.keys(exportsFromIndex)).toEqual([
    "Artist",
    "BidFlow",
    "Conversation",
    "Home",
    "Gene",
    "Sale",
    "WorksForYou",
    "MyProfile",
    "Inbox",
    "Inquiry",
  ])
})

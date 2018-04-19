import exportsFromIndex from "../"

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

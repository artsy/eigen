import exportsFromIndex from "../"

it("should export all components", () => {
  expect(Object.keys(exportsFromIndex)).toEqual([
    "Artist",
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

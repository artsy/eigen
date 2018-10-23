import exportsFromIndex from "../"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

it("should export all components", () => {
  expect(Object.keys(exportsFromIndex)).toEqual([
    "Artist",
    "BidFlow",
    "Conversation",
    "Gene",
    "ReferenceShow",
    "Fair",
    "Home",
    "Inbox",
    "Inquiry",
    "MyProfile",
    "RegistrationFlow",
    "Sale",
    "WorksForYou",
  ])
})

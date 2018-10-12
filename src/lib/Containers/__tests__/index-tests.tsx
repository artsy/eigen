import * as exportsFromIndex from "../"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

it("should export all components", () => {
  expect(Object.keys(exportsFromIndex)).toEqual([
    "Fair",
    "MyProfile",
    "Artist",
    "Conversation",
    "Gene",
    "Inbox",
    "Inquiry",
    "Sale",
    "WorksForYou",
  ])
})

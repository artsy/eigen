import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"

const list = { internalID: "list-123", name: "My List", default: false }

describe("LastSavedListModel", () => {
  it("defaults to null", () => {
    expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toBeNull()
  })

  it("stores the last saved list", () => {
    GlobalStore.actions.lastSavedList.setLastSavedList(list)

    expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toEqual(list)
  })

  it("can be cleared", () => {
    GlobalStore.actions.lastSavedList.setLastSavedList(list)
    GlobalStore.actions.lastSavedList.setLastSavedList(null)

    expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toBeNull()
  })

  describe("forgetListIfMatches", () => {
    it("clears the list when the ID matches", () => {
      GlobalStore.actions.lastSavedList.setLastSavedList(list)
      GlobalStore.actions.lastSavedList.forgetListIfMatches("list-123")

      expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toBeNull()
    })

    it("leaves the list untouched when the ID does not match", () => {
      GlobalStore.actions.lastSavedList.setLastSavedList(list)
      GlobalStore.actions.lastSavedList.forgetListIfMatches("another-list")

      expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toEqual(list)
    })
  })

  describe("renameListIfMatches", () => {
    it("renames the list when the ID matches", () => {
      GlobalStore.actions.lastSavedList.setLastSavedList(list)
      GlobalStore.actions.lastSavedList.renameListIfMatches({
        internalID: "list-123",
        name: "Renamed",
      })

      expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toEqual({
        ...list,
        name: "Renamed",
      })
    })

    it("leaves the name untouched when the ID does not match", () => {
      GlobalStore.actions.lastSavedList.setLastSavedList(list)
      GlobalStore.actions.lastSavedList.renameListIfMatches({
        internalID: "another-list",
        name: "Renamed",
      })

      expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toEqual(list)
    })
  })

  it("is cleared on sign out", async () => {
    GlobalStore.actions.lastSavedList.setLastSavedList(list)

    await GlobalStore.actions.auth.signOut()

    expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toBeNull()
  })
})

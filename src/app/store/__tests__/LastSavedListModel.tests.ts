import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"

describe("LastSavedListModel", () => {
  it("defaults to null", () => {
    expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toBeNull()
  })

  it("stores the last saved list", () => {
    GlobalStore.actions.lastSavedList.setLastSavedList({
      internalID: "list-123",
      name: "My List",
    })

    expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toEqual({
      internalID: "list-123",
      name: "My List",
    })
  })

  it("can be cleared", () => {
    GlobalStore.actions.lastSavedList.setLastSavedList({
      internalID: "list-123",
      name: "My List",
    })
    GlobalStore.actions.lastSavedList.setLastSavedList(null)

    expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toBeNull()
  })

  it("is cleared on sign out", async () => {
    GlobalStore.actions.lastSavedList.setLastSavedList({
      internalID: "list-123",
      name: "My List",
    })

    await GlobalStore.actions.auth.signOut()

    expect(__globalStoreTestUtils__?.getCurrentState().lastSavedList.lastSavedList).toBeNull()
  })
})

import { sellConditionStoreModel } from "app/Scenes/Sell/State/SellConditionStore"
import { createStore } from "easy-peasy"

const SAVED = { path: "https://images.example.com/saved.jpg", imageID: "image-1" }

const storeWithSavedPhoto = () => {
  const store = createStore(sellConditionStoreModel)
  store.getActions().setSavedPhotos([SAVED])
  return store
}

describe("SellConditionStore", () => {
  it("doesn’t count saved photos as answers, but counts new and removed ones", () => {
    const store = storeWithSavedPhoto()
    expect(store.getState().hasAnswers).toBe(false)

    store.getActions().setPhotos([SAVED, { path: "file:///new.jpg" }])
    expect(store.getState().hasAnswers).toBe(true)

    store.getActions().setPhotos([])
    expect(store.getState().hasAnswers).toBe(true)
  })

  it("takes in photos saved before a failed save, and keeps the rest to retry", () => {
    const store = storeWithSavedPhoto()
    store.getActions().setPhotos([SAVED, { path: "file:///a.jpg" }, { path: "file:///b.jpg" }])

    const savedA = { path: "https://images.example.com/a.jpg", imageID: "image-a" }
    store.getActions().restoreSavedPhotos([SAVED, savedA])

    expect(store.getState().photos).toEqual([SAVED, savedA, { path: "file:///b.jpg" }])
    expect(store.getState().savedPhotoIDs).toEqual(["image-1", "image-a"])
  })

  it("keeps a removed saved photo hidden when its delete failed, so a retry deletes it", () => {
    const store = storeWithSavedPhoto()
    store.getActions().setPhotos([])

    store.getActions().restoreSavedPhotos([SAVED])

    expect(store.getState().photos).toEqual([])
    expect(store.getState().savedPhotoIDs).toEqual(["image-1"])
  })
})

describe("SellConditionStore notes", () => {
  it("counts the notes as an answer only once they differ from the saved ones", () => {
    const store = createStore({
      ...sellConditionStoreModel,
      notes: "Signed on the back",
      savedNotes: "Signed on the back",
    })
    expect(store.getState().hasAnswers).toBe(false)

    store.getActions().setNotes("Signed on the back, small tear")
    expect(store.getState().hasAnswers).toBe(true)

    store.getActions().setSavedNotes("Signed on the back, small tear")
    expect(store.getState().hasAnswers).toBe(false)
  })

  it("ignores whitespace around the saved notes", () => {
    const store = createStore({
      ...sellConditionStoreModel,
      notes: "Signed on the back\n",
      savedNotes: "Signed on the back\n",
    })
    expect(store.getState().hasAnswers).toBe(false)
  })
})

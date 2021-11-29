import AsyncStorage from "@react-native-community/async-storage"
import { DateTime } from "luxon"
import { expirationKey, retrieveLocalImage, storeLocalImage } from "./LocalImageStore"

describe("LocalImageStore", () => {
  const dateNow = Date.now
  // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  const mockNow = 1525983752000

  beforeEach(() => {
    jest.useFakeTimers()
    Date.now = () => mockNow
  })

  afterEach(() => {
    Date.now = dateNow
  })

  it("stores a single image with a key", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    storeLocalImage(imagePath, imageKey)
    const retrievedImage = await retrieveLocalImage(imageKey)
    console.log(`Retrieved image ${retrievedImage}`)
    expect(retrievedImage).toEqual(imagePath)
  })

  it("defaults to expiring after 2 minutes", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    storeLocalImage(imagePath, imageKey)
    const expirationTime = await AsyncStorage.getItem(expirationKey(imageKey))
    const in2mins = DateTime.fromMillis(Date.now()).plus({ minutes: 2 }).toISO()
    expect(expirationTime).toEqual(in2mins)
  })

  it("does not return expired images", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    storeLocalImage(imagePath, imageKey)
    const in3mins = DateTime.fromMillis(Date.now()).plus({ minutes: 3 }).toMillis()
    const retrievedImage = await retrieveLocalImage(imageKey, in3mins)
    expect(retrievedImage).toBe(null)
  })
})

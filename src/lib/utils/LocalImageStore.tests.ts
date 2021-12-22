import AsyncStorage from "@react-native-community/async-storage"
import { DateTime } from "luxon"
import { LocalImage, retrieveLocalImage, storeLocalImage } from "./LocalImageStore"

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
    const image: LocalImage = {
      path: imagePath,
      width: 10,
      height: 11,
    }
    storeLocalImage(image, imageKey)
    const retrievedImage = await retrieveLocalImage(imageKey)
    expect(retrievedImage?.path).toEqual(imagePath)
    expect(retrievedImage?.width).toEqual(10)
    expect(retrievedImage?.height).toEqual(11)
  })

  it("defaults to expiring after 2 minutes", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    const image: LocalImage = {
      path: imagePath,
      width: 10,
      height: 10,
    }
    storeLocalImage(image, imageKey)
    const imageJSON = await AsyncStorage.getItem(imageKey)
    const parsedImage = JSON.parse(imageJSON!)

    const in2mins = DateTime.fromMillis(Date.now()).plus({ minutes: 2 }).toISO()
    // tslint:disable-next-line:no-string-literal
    expect(parsedImage["expirationDate"]).toEqual(in2mins)
  })

  it("does not return expired images", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    const image: LocalImage = {
      path: imagePath,
      width: 10,
      height: 10,
    }
    storeLocalImage(image, imageKey)
    const in3mins = DateTime.fromMillis(Date.now()).plus({ minutes: 3 }).toMillis()
    const retrievedImage = await retrieveLocalImage(imageKey, in3mins)
    expect(retrievedImage).toBe(null)
  })
})

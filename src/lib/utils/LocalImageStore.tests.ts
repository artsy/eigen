import AsyncStorage from "@react-native-async-storage/async-storage"
import { DateTime } from "luxon"
import { LocalImage, retrieveLocalImages, storeLocalImages } from "./LocalImageStore"

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
    storeLocalImages([image], imageKey)
    const retrievedImage = await retrieveLocalImages(imageKey)
    expect(retrievedImage?.[0].path).toEqual(imagePath)
    expect(retrievedImage?.[0].width).toEqual(10)
    expect(retrievedImage?.[0].height).toEqual(11)
  })

  it("stores multiple images with a key", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    const image: LocalImage = {
      path: imagePath,
      width: 10,
      height: 11,
    }
    const imagePath2 = "some-other-local-image"
    const image2: LocalImage = {
      path: imagePath2,
      width: 13,
      height: 14,
    }
    storeLocalImages([image, image2], imageKey)
    const retrievedImages = await retrieveLocalImages(imageKey)
    expect(retrievedImages?.[0].path).toEqual(imagePath)
    expect(retrievedImages?.[0].width).toEqual(10)
    expect(retrievedImages?.[0].height).toEqual(11)
    expect(retrievedImages?.[1].path).toEqual(imagePath2)
    expect(retrievedImages?.[1].width).toEqual(13)
    expect(retrievedImages?.[1].height).toEqual(14)
  })

  it("defaults to expiring after 2 minutes", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    const image: LocalImage = {
      path: imagePath,
      width: 10,
      height: 10,
    }
    storeLocalImages([image], imageKey)
    const imagesJSON = await AsyncStorage.getItem(imageKey)

    console.log("Got images json", imagesJSON)
    const parsedImages = JSON.parse(imagesJSON!)

    const in2mins = DateTime.fromMillis(Date.now()).plus({ minutes: 2 }).toISO()
    // tslint:disable-next-line:no-string-literal
    expect(parsedImages[0]["expirationDate"]).toEqual(in2mins)
  })

  it("does not return expired images", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    const image: LocalImage = {
      path: imagePath,
      width: 10,
      height: 10,
    }
    storeLocalImages([image], imageKey)
    const in3mins = DateTime.fromMillis(Date.now()).plus({ minutes: 3 }).toMillis()
    const retrievedImages = await retrieveLocalImages(imageKey, in3mins)
    expect(retrievedImages).toBe(null)
  })
})

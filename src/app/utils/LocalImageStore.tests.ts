import AsyncStorage from "@react-native-async-storage/async-storage"
import { DateTime } from "luxon"
import { getLocalImage, LocalImage, storeLocalImage } from "./LocalImageStore"

describe("LocalImageStore", () => {
  const dateNow = Date.now
  // Thursday, May 10, 2018 8:22:32.000 PM UTC in milliseconds
  const mockNow = 1525983752000

  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
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
    storeLocalImage(imageKey, image)
    const retrievedImage = await getLocalImage(imageKey)
    expect(retrievedImage).toMatchInlineSnapshot()
  })

  it("stores multiple images with a key", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    const image: LocalImage = {
      path: imagePath,
      width: 10,
      height: 11,
    }
    storeLocalImage(imageKey, image)
    const retrievedImage = await getLocalImage(imageKey)
    expect(retrievedImage).toMatchInlineSnapshot()
  })

  it("defaults to expiring after 5 minutes", async () => {
    const imageKey = "some-key"
    const imagePath = "some-local-image"
    const image: LocalImage = {
      path: imagePath,
      width: 10,
      height: 10,
    }
    storeLocalImage(imageKey, image)
    const imagesJSON = await AsyncStorage.getItem(imageKey)

    console.log("Got images json", imagesJSON)
    const parsedImages = JSON.parse(imagesJSON!)

    const in2mins = DateTime.fromMillis(Date.now()).plus({ minutes: 5 }).toISO()

    expect(parsedImages[0]["expirationDate"]).toEqual(in2mins)
  })
})

import AsyncStorage from "@react-native-async-storage/async-storage"
import { act, waitFor } from "@testing-library/react-native"
import { ItineraryChanges, saveItineraryChanges } from "app/Scenes/CityGuide/utils/itinerarySave"
import {
  hasPendingItinerarySave,
  markItineraryDeleted,
} from "app/Scenes/CityGuide/utils/itinerarySaveQueue"
import { getLocalImage, storeLocalImage } from "app/utils/LocalImageStore"
import * as imageUtils from "app/utils/getConvertedImageUrlFromS3"
import { commitLocalUpdate, OperationDescriptor } from "relay-runtime"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

type Env = ReturnType<typeof createMockEnvironment>

const firstPhoto = { path: "localCoverPath", width: 1200, height: 800 }
const secondPhoto = { path: "secondCoverPath", width: 600, height: 900 }

const oldHeroImage = {
  'url(version:"large")': "https://example.com/current-cover.jpg",
  'url(version:"small")': "https://example.com/current-cover-small.jpg",
  blurhash: "old-blurhash",
}

const localHeroImage = {
  'url(version:"large")': "localCoverPath",
  'url(version:"small")': "localCoverPath",
  width: 1200,
  height: 800,
  aspectRatio: 1.5,
  blurhash: null,
}

const secondHeroImage = {
  'url(version:"large")': "secondCoverPath",
  width: 600,
  height: 900,
}

describe("saveItineraryChanges", () => {
  const showToast = jest.fn()

  // Saves are tracked per itinerary at module level, so each test gets an itinerary of its own.
  let itineraryCount = 0
  let itinerary: { id: string; internalID: string }
  let env: Env

  const seedStore = () =>
    commitLocalUpdate(env, (store) => {
      const record = store.create(itinerary.id, "Itinerary")
      record.setValue("London Oct 2026", "title")
      record.setValue("If time, check out Borough Market", "description")

      const heroImage = store.create("current-cover", "Image")
      Object.entries(oldHeroImage).forEach(([key, value]) => heroImage.setValue(value, key))
      record.setLinkedRecord(heroImage, "heroImage")
    })

  const save = (changes: Partial<ItineraryChanges>) =>
    saveItineraryChanges(
      env,
      itinerary,
      {
        title: "London Oct 2026",
        description: "If time, check out Borough Market",
        cover: undefined,
        ...changes,
      },
      showToast
    )

  const record = () => env.getStore().getSource().get(itinerary.id)

  const heroImageInStore = () => {
    const source = env.getStore().getSource()
    const ref = record()?.heroImage as { __ref: string } | null | undefined

    return ref ? source.get(ref.__ref) : ref
  }

  const coverKey = () => `itinerary-cover-${itinerary.internalID}`

  // Only pending operations: a resolved one drops out of the list.
  const operationsNamed = (name: string) =>
    env.mock
      .getAllOperations()
      .filter((operation) => operation.request.node.operation.name === name)

  const textMutations = () => operationsNamed("itinerarySaveUpdateMutation")
  const coverMutations = () => operationsNamed("itinerarySaveUpdateCoverMutation")

  const succeed = (operation: OperationDescriptor) => {
    const { title, description } = operation.request.variables.input

    act(() =>
      env.mock.resolve(
        operation,
        MockPayloadGenerator.generate(operation, {
          updateItineraryPayload: () => ({
            responseOrError: {
              __typename: "ItineraryMutationSuccess",
              itinerary: { id: itinerary.id, title, description },
            },
          }),
        })
      )
    )
  }

  /** Gravity refusing the change: a normal response whose data is a failure, not a GraphQL error. */
  const failWithData = (operation: OperationDescriptor) =>
    act(() =>
      env.mock.resolve(
        operation,
        MockPayloadGenerator.generate(operation, {
          updateItineraryPayload: () => ({
            responseOrError: {
              __typename: "ItineraryMutationFailure",
              mutationError: { message: "Title is invalid" },
            },
          }),
        })
      )
    )

  const reject = (operation: OperationDescriptor) =>
    act(() => env.mock.reject(operation, new Error("Gravity down")))

  /** Each call to the upload returns a promise the test settles itself. */
  const controlUploads = () => {
    const uploads: { resolve: (url: string) => void; reject: (error: Error) => void }[] = []
    const spy = jest.spyOn(imageUtils, "getConvertedImageUrlFromS3").mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          uploads.push({ resolve, reject })
        })
    )

    return { uploads, spy }
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    await AsyncStorage.clear()
    itinerary = { id: "itinerary-id-1", internalID: `save-itinerary-${++itineraryCount}` }
    env = createMockEnvironment()
    seedStore()
  })

  describe("title and notes", () => {
    it("shows the new text at once and sends it", () => {
      save({ title: "London November" })

      expect(record()?.title).toEqual("London November")
      expect(textMutations()).toHaveLength(1)
      expect(textMutations()[0].request.variables.input).toEqual({
        id: itinerary.internalID,
        title: "London November",
        description: "If time, check out Borough Market",
      })
    })

    it("puts the old text back and tells the user when the request fails", () => {
      save({ title: "London November" })
      reject(textMutations()[0])

      expect(record()?.title).toEqual("London Oct 2026")
      expect(showToast).toHaveBeenCalledWith("Could not save your changes")
    })

    it("treats an ItineraryMutationFailure response as a failure", () => {
      save({ title: "London November" })
      failWithData(textMutations()[0])

      expect(record()?.title).toEqual("London Oct 2026")
      expect(showToast).toHaveBeenCalledWith("Could not save your changes")
    })

    it("sends nothing when the title and notes are unchanged", () => {
      save({ cover: null })

      expect(textMutations()).toHaveLength(0)
      expect(showToast).not.toHaveBeenCalled()
    })

    it("treats empty notes as unchanged when the itinerary has none", () => {
      commitLocalUpdate(env, (store) => store.get(itinerary.id)?.setValue(null, "description"))

      save({ description: "" })

      expect(textMutations()).toHaveLength(0)
    })

    it("keeps a later save when an earlier one fails after it succeeded", () => {
      save({ title: "A" })
      save({ title: "B" })

      const [first, second] = textMutations()
      succeed(second)
      reject(first)

      expect(record()?.title).toEqual("B")
      expect(showToast).not.toHaveBeenCalled()
    })

    it("goes back to the text before both saves when the later fails and the earlier then fails too", () => {
      save({ title: "A" })
      save({ title: "B" })

      const [first, second] = textMutations()
      reject(second)

      expect(record()?.title).toEqual("London Oct 2026")
      expect(showToast).toHaveBeenCalledTimes(1)

      reject(first)

      expect(record()?.title).toEqual("London Oct 2026")
      expect(showToast).toHaveBeenCalledTimes(1)
    })

    it("goes back to the earlier save's text when it succeeded and the later one fails", () => {
      save({ title: "A" })
      save({ title: "B" })

      const [first, second] = textMutations()
      succeed(first)
      reject(second)

      expect(record()?.title).toEqual("A")
      expect(showToast).toHaveBeenCalledWith("Could not save your changes")
    })
  })

  describe("cover", () => {
    it("sends the uploaded URL in a mutation of its own once the upload finishes", async () => {
      const { uploads, spy } = controlUploads()

      save({ title: "London November", cover: firstPhoto })

      expect(textMutations()).toHaveLength(1)
      await waitFor(() => expect(heroImageInStore()).toMatchObject(localHeroImage))
      await waitFor(() => expect(spy).toHaveBeenCalledWith("localCoverPath"))
      expect(coverMutations()).toHaveLength(0)
      expect(await getLocalImage(coverKey())).toMatchObject(firstPhoto)

      uploads[0].resolve("https://s3.example.com/new-cover.jpg")

      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      expect(coverMutations()[0].request.variables.input).toEqual({
        id: itinerary.internalID,
        imageURL: "https://s3.example.com/new-cover.jpg",
      })
    })

    // Gravity builds the new cover's versions in the background, so nothing in the responses
    // should replace the local photo.
    it("keeps the local photo once both mutations succeed", async () => {
      jest
        .spyOn(imageUtils, "getConvertedImageUrlFromS3")
        .mockResolvedValue("https://s3.example.com/new-cover.jpg")

      save({ title: "London November", cover: firstPhoto })

      succeed(textMutations()[0])
      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      succeed(coverMutations()[0])

      expect(heroImageInStore()).toMatchObject(localHeroImage)
      expect(showToast).not.toHaveBeenCalled()
    })

    it("puts the old cover back and tells the user when the upload fails", async () => {
      const { uploads, spy } = controlUploads()
      jest.spyOn(console, "error").mockImplementation(() => {})

      save({ cover: firstPhoto })

      await waitFor(() => expect(heroImageInStore()).toMatchObject(localHeroImage))
      await waitFor(() => expect(spy).toHaveBeenCalled())
      uploads[0].reject(new Error("S3 down"))

      await waitFor(() => expect(showToast).toHaveBeenCalledWith("Could not upload your photo"))
      expect(heroImageInStore()).toMatchObject(oldHeroImage)
      expect(await getLocalImage(coverKey())).toBeNull()
      expect(coverMutations()).toHaveLength(0)
    })

    it.each([
      ["the request fails", reject],
      ["Gravity answers with an ItineraryMutationFailure", failWithData],
    ])("puts the old cover back and tells the user when %s", async (_, fail) => {
      jest
        .spyOn(imageUtils, "getConvertedImageUrlFromS3")
        .mockResolvedValue("https://s3.example.com/new-cover.jpg")

      save({ cover: firstPhoto })

      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      expect(heroImageInStore()).toMatchObject(localHeroImage)
      fail(coverMutations()[0])

      await waitFor(() => expect(showToast).toHaveBeenCalledWith("Could not save your changes"))
      expect(heroImageInStore()).toMatchObject(oldHeroImage)
      expect(await getLocalImage(coverKey())).toBeNull()
    })

    it("doesn't bring back older notes when a slow cover save lands after a text-only save", async () => {
      const { uploads, spy } = controlUploads()

      save({ cover: firstPhoto })
      await waitFor(() => expect(spy).toHaveBeenCalled())

      save({ description: "Newer notes" })
      succeed(textMutations()[0])

      uploads[0].resolve("https://s3.example.com/new-cover.jpg")

      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      expect(coverMutations()[0].request.variables.input).toEqual({
        id: itinerary.internalID,
        imageURL: "https://s3.example.com/new-cover.jpg",
      })
      succeed(coverMutations()[0])

      expect(record()?.description).toEqual("Newer notes")
      expect(heroImageInStore()).toMatchObject(localHeroImage)
    })

    it("sends two cover saves in order, so the second photo wins", async () => {
      const { uploads, spy } = controlUploads()

      save({ cover: firstPhoto })
      save({ cover: secondPhoto })

      await waitFor(() => expect(heroImageInStore()).toMatchObject(secondHeroImage))
      await waitFor(() => expect(spy).toHaveBeenCalledTimes(1))

      uploads[0].resolve("https://s3.example.com/first.jpg")
      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      succeed(coverMutations()[0])

      await waitFor(() => expect(spy).toHaveBeenCalledTimes(2))
      expect(spy).toHaveBeenLastCalledWith("secondCoverPath")
      expect(heroImageInStore()).toMatchObject(secondHeroImage)

      uploads[1].resolve("https://s3.example.com/second.jpg")
      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      expect(coverMutations()[0].request.variables.input).toEqual({
        id: itinerary.internalID,
        imageURL: "https://s3.example.com/second.jpg",
      })
      succeed(coverMutations()[0])

      expect(heroImageInStore()).toMatchObject(secondHeroImage)
      expect(await getLocalImage(coverKey())).toMatchObject({ path: "secondCoverPath" })
    })

    it("doesn't roll back a later cover when an earlier one fails", async () => {
      const { uploads, spy } = controlUploads()
      jest.spyOn(console, "error").mockImplementation(() => {})

      save({ cover: firstPhoto })
      save({ cover: secondPhoto })
      await waitFor(() => expect(heroImageInStore()).toMatchObject(secondHeroImage))
      await waitFor(() => expect(spy).toHaveBeenCalledTimes(1))

      uploads[0].reject(new Error("S3 down"))
      await waitFor(() => expect(spy).toHaveBeenCalledTimes(2))

      expect(showToast).not.toHaveBeenCalled()
      expect(heroImageInStore()).toMatchObject(secondHeroImage)
      expect(await getLocalImage(coverKey())).toMatchObject({ path: "secondCoverPath" })

      uploads[1].resolve("https://s3.example.com/second.jpg")
      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      succeed(coverMutations()[0])

      expect(heroImageInStore()).toMatchObject(secondHeroImage)
    })

    it("restores the earlier photo when it succeeded and a later cover save fails", async () => {
      const { uploads, spy } = controlUploads()

      save({ cover: firstPhoto })
      save({ cover: secondPhoto })
      await waitFor(() => expect(spy).toHaveBeenCalledTimes(1))

      uploads[0].resolve("https://s3.example.com/first.jpg")
      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      succeed(coverMutations()[0])

      await waitFor(() => expect(spy).toHaveBeenCalledTimes(2))
      uploads[1].resolve("https://s3.example.com/second.jpg")
      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      reject(coverMutations()[0])

      await waitFor(() => expect(showToast).toHaveBeenCalledWith("Could not save your changes"))
      expect(heroImageInStore()).toMatchObject(localHeroImage)
      expect(await getLocalImage(coverKey())).toMatchObject(firstPhoto)
    })

    it("drops a cover save for an itinerary deleted during the upload, without a toast", async () => {
      const { uploads, spy } = controlUploads()

      save({ cover: firstPhoto })
      await waitFor(() => expect(spy).toHaveBeenCalled())

      markItineraryDeleted(itinerary.internalID)
      uploads[0].resolve("https://s3.example.com/new-cover.jpg")

      await waitFor(() => expect(hasPendingItinerarySave(itinerary.internalID)).toBe(false))
      expect(coverMutations()).toHaveLength(0)
      expect(showToast).not.toHaveBeenCalled()
    })

    it("sends a null imageURL and clears the cover when it is removed", async () => {
      save({ cover: null })

      await waitFor(() => expect(coverMutations()).toHaveLength(1))
      expect(coverMutations()[0].request.variables.input).toEqual({
        id: itinerary.internalID,
        imageURL: null,
      })
      expect(heroImageInStore()).toBeNull()
    })

    it("clears a photo saved moments ago when the cover is removed, so it can't reappear", async () => {
      await storeLocalImage(coverKey(), { path: "earlierCoverPath" })

      save({ cover: null })

      await waitFor(async () => expect(await getLocalImage(coverKey())).toBeNull())
    })
  })
})

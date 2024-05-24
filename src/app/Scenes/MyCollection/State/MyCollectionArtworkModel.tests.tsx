import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { Image } from "react-native-image-crop-picker"

describe("MyCollectionArtworkModel", () => {
  const fakePhoto = (path: string) => {
    const photo: Image = {
      path,
      size: 10,
      data: "photodata",
      height: 10,
      width: 10,
      mime: "jpeg",
      exif: null,
      cropRect: null,
      filename: "somefile",
      creationDate: "somedate",
      modificationDate: "somedate",
    }
    return photo
  }

  it("resets form values to initial values", () => {
    __globalStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              artist: "some-artist",
              customArtist: { name: "some-custom-artist" },
              artistIds: ["some-artist-id-0", "some-artist-id-1"],
              artistSearchResult: null,
              category: "some-category",
              confidentialNotes: "some-notes",
              pricePaidDollars: "100",
              pricePaidCurrency: "USD",
              date: "some-date",
              depth: "some-depth",
              isEdition: true,
              editionSize: "some-edition-size",
              editionNumber: "some-edition-number",
              height: "some-height",
              medium: "some-medium",
              metric: "in",
              photos: [fakePhoto("somepath")],
              provenance: "some-provenance",
              title: "some-title",
              width: "some-width",
            },
          },
        },
      },
    })

    const artworkActions = GlobalStore.actions.myCollection.artwork
    artworkActions.resetForm()
    const artworkState = __globalStoreTestUtils__?.getCurrentState().myCollection.artwork
    const expectedInitialFormValues = {
      artist: "",
      artistDisplayName: undefined,
      artistIds: [],
      artistSearchResult: null,
      attributionClass: undefined,
      collectorLocation: null,
      category: "",
      confidentialNotes: undefined,
      customArtist: null,
      date: undefined,
      depth: undefined,
      editionNumber: undefined,
      editionSize: undefined,
      height: undefined,
      isEdition: null,
      medium: undefined,
      metric: null,
      photos: [],
      pricePaidCurrency: "",
      pricePaidDollars: "",
      provenance: undefined,
      title: "",
      width: undefined,
    }
    expect(artworkState?.sessionState.formValues).toEqual(expectedInitialFormValues)
  })

  it("adds photos", () => {
    const somePhoto = fakePhoto("somepath")
    const someOtherPhoto = fakePhoto("someOtherPath")

    __globalStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              photos: [somePhoto],
            },
          },
        },
      },
    })

    const artworkActions = GlobalStore.actions.myCollection.artwork
    artworkActions.addPhotos([someOtherPhoto])
    const artworkState = __globalStoreTestUtils__?.getCurrentState().myCollection.artwork
    expect(artworkState?.sessionState.formValues.photos).toEqual([somePhoto, someOtherPhoto])
  })

  it("doesn't add duplicate photos", () => {
    const somePhoto = fakePhoto("somePath")
    __globalStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              photos: [somePhoto],
            },
          },
        },
      },
    })

    const artworkActions = GlobalStore.actions.myCollection.artwork
    artworkActions.addPhotos([somePhoto])
    const artworkState = __globalStoreTestUtils__?.getCurrentState().myCollection.artwork
    expect(artworkState?.sessionState.formValues.photos).toEqual([somePhoto])
  })

  it("removes photos", () => {
    const somePhoto = fakePhoto("somePath")
    const someOtherPhoto = fakePhoto("someOtherPath")
    __globalStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              photos: [somePhoto, someOtherPhoto],
            },
          },
        },
      },
    })
    const artworkActions = GlobalStore.actions.myCollection.artwork
    artworkActions.removePhoto(someOtherPhoto)
    const artworkState = __globalStoreTestUtils__?.getCurrentState().myCollection.artwork
    expect(artworkState?.sessionState.formValues.photos).toEqual([somePhoto])
  })
})

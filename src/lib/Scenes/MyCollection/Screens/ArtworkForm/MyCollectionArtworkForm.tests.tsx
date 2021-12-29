import { NavigationContainer } from "@react-navigation/native"
import { MyCollectionArtworkFormMain } from "lib/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkFormMain"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Image } from "react-native-image-crop-picker"
import { MyCollectionArtworkForm, MyCollectionArtworkFormProps, updateArtwork } from "./MyCollectionArtworkForm"
import { MyCollectionAddPhotos } from "./Screens/MyCollectionArtworkFormAddPhotos"

jest.mock("lib/Scenes/Consignments/Submission/geminiUploadToS3", () => ({
  getConvectionGeminiKey: jest.fn(),
  getGeminiCredentialsForEnvironment: jest.fn(),
  uploadFileToS3: jest.fn(),
}))

import { myCollectionAddArtworkMutationResponse } from "__generated__/myCollectionAddArtworkMutation.graphql"
import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "lib/Scenes/Consignments/Submission/geminiUploadToS3"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import * as artworkMutations from "../../mutations/myCollectionAddArtwork"
import { ArtworkFormValues } from "../../State/MyCollectionArtworkModel"
import * as photoUtil from "./MyCollectionImageUtil"

const getConvectionGeminiKeyMock = getConvectionGeminiKey as jest.Mock<any>
const getGeminiCredentialsForEnvironmentMock = getGeminiCredentialsForEnvironment as jest.Mock<any>
const uploadFileToS3Mock = uploadFileToS3 as jest.Mock<any>

describe("MyCollectionArtworkForm", () => {
  it("creates a navigation stack containing expected components", () => {
    const wrapper = renderWithWrappers(<MyCollectionArtworkForm mode="add" onSuccess={jest.fn()} />)
    expect(wrapper.root.findAllByType(NavigationContainer)).toBeDefined()
    expect(wrapper.root.findAllByType(MyCollectionArtworkFormMain)).toBeDefined()
    expect(wrapper.root.findAllByType(MyCollectionAddPhotos)).toBeDefined()
  })

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

  describe("uploading images", () => {
    it("uploads photos to s3", async (done) => {
      const somePhoto = fakePhoto("some-path")
      const someOtherPhoto = fakePhoto("some-other-path")
      getConvectionGeminiKeyMock.mockReturnValueOnce(Promise.resolve("some-key"))

      const assetCredentials = {
        signature: "some-signature",
        credentials: "some-credentials",
        policyEncoded: "some-policy-encoded",
        policyDocument: {
          expiration: "some-expiration",
          conditions: {
            acl: "some-acl",
            bucket: "some-bucket",
            geminiKey: "some-gemini-key",
            successActionStatus: "some-success-action-status",
          },
        },
      }
      getGeminiCredentialsForEnvironmentMock.mockReturnValue(Promise.resolve(assetCredentials))

      uploadFileToS3Mock.mockReturnValue(Promise.resolve("some-s3-url"))

      photoUtil.uploadPhotos([somePhoto, someOtherPhoto]).then(() => {
        expect(uploadFileToS3).toHaveBeenCalledTimes(2)
        expect(uploadFileToS3).toHaveBeenNthCalledWith(1, "some-path", "private", assetCredentials)
        expect(uploadFileToS3).toHaveBeenNthCalledWith(2, "some-other-path", "private", assetCredentials)
        done()
      })
    })
  })

  describe("updating artworks", () => {
    it("stores uploaded photos locally on artwork add", async () => {
      const fakePhotos = [fakePhoto("some-path"), fakePhoto("some-other-path"), fakePhoto("yet-another-path")]

      const formValues: ArtworkFormValues = {
        artist: "some-artist",
        artistIds: ["some-artist-id"],
        artistSearchResult: {
          imageUrl: null,
          href: null,
          displayLabel: null,
          __typename: "some-type",
          internalID: "some-internal-id",
        },
        category: "oil on oil",
        medium: "photography",
        pricePaidDollars: "$100",
        pricePaidCurrency: "USD",
        date: "some-date",
        editionSize: "10",
        editionNumber: "10",
        isEdition: true,
        height: "10",
        width: "10",
        depth: "10",
        metric: "cm",
        provenance: "fake",
        title: "some-art-piece",
        photos: fakePhotos,
        artworkLocation: "some-location",
        attributionClass: "some-attribution-class",
      }
      const formCheckValues = formValues
      const props: MyCollectionArtworkFormProps = {
        onSuccess: jest.fn(),
        mode: "add",
      }
      const uploadPhotosMock = jest.spyOn(photoUtil, "uploadPhotos")
      uploadPhotosMock.mockImplementation(() => Promise.resolve(["image-url0", "image-url1", "image-url2"]))

      const artworkSlug = "some-slug"
      const artworkResponse: myCollectionAddArtworkMutationResponse = {
        myCollectionCreateArtwork: {
          artworkOrError: {
            artworkEdge: {
              __id: "some-id",
              node: {
                internalID: "some-internal-id",
                id: "some-id",
                slug: artworkSlug,
                artist: {
                  internalID: "some-internal-id",
                },
                artistNames: "some-artist-name",
                category: null,
                pricePaid: null,
                date: null,
                depth: null,
                editionSize: null,
                editionNumber: null,
                height: null,
                medium: null,
                images: null,
                isEdition: null,
                metric: null,
                provenance: null,
                width: null,
                title: null,
                attributionClass: null,
              },
            },
          },
        },
      }

      const addArtworkMock = jest.spyOn(artworkMutations, "myCollectionAddArtwork")
      addArtworkMock.mockImplementation(() => Promise.resolve(artworkResponse))

      const storeLocalPhotosMock = jest.spyOn(photoUtil, "storeLocalPhotos")

      await updateArtwork(formValues, formCheckValues, props)

      expect(uploadPhotosMock).toBeCalledWith(fakePhotos)
      expect(addArtworkMock).toBeCalled()
      expect(storeLocalPhotosMock).toBeCalledWith(expect.anything(), fakePhotos)
    })
  })
})

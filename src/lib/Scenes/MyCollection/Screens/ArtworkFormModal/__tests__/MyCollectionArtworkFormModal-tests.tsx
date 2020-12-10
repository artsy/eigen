import { NavigationContainer } from "@react-navigation/native"
import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { MyCollectionArtworkFormMain } from "lib/Scenes/MyCollection/Screens/ArtworkFormModal/Screens/MyCollectionArtworkFormMain"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Image } from "react-native-image-crop-picker"
import { MyCollectionArtworkFormModal, uploadPhotos } from "../MyCollectionArtworkFormModal"
import { MyCollectionAdditionalDetailsForm } from "../Screens/MyCollectionArtworkFormAdditionalDetails"
import { MyCollectionAddPhotos } from "../Screens/MyCollectionArtworkFormAddPhotos"

jest.mock("lib/Scenes/Consignments/Submission/geminiUploadToS3", () => ({
  getConvectionGeminiKey: jest.fn(),
  getGeminiCredentialsForEnvironment: jest.fn(),
  uploadFileToS3: jest.fn(),
}))

import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "lib/Scenes/Consignments/Submission/geminiUploadToS3"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"

const getConvectionGeminiKeyMock = getConvectionGeminiKey as jest.Mock<any>
const getGeminiCredentialsForEnvironmentMock = getGeminiCredentialsForEnvironment as jest.Mock<any>
const uploadFileToS3Mock = uploadFileToS3 as jest.Mock<any>

describe("MyCollectionArtworkFormModal", () => {
  it("creates a navigation stack containing expected components", () => {
    const wrapper = renderWithWrappers(
      <MyCollectionArtworkFormModal visible={true} mode="add" onSuccess={jest.fn()} onDismiss={jest.fn()} />
    )
    expect(wrapper.root.findAllByType(NavigationContainer)).toBeDefined()
    expect(wrapper.root.findAllByType(MyCollectionArtworkFormMain)).toBeDefined()
    expect(wrapper.root.findAllByType(MyCollectionAdditionalDetailsForm)).toBeDefined()
    expect(wrapper.root.findAllByType(MyCollectionAddPhotos)).toBeDefined()
  })

  it("calls dismiss on background click", () => {
    const mockDismiss = jest.fn()
    const wrapper = renderWithWrappers(
      <MyCollectionArtworkFormModal visible={true} mode="add" onSuccess={jest.fn()} onDismiss={mockDismiss} />
    )
    wrapper.root.findByType(FancyModal).props.onBackgroundPressed()
    expect(mockDismiss).toHaveBeenCalled()
  })

  describe("uploading images", () => {
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

      uploadPhotos([somePhoto, someOtherPhoto]).then(() => {
        expect(uploadFileToS3).toHaveBeenCalledTimes(2)
        expect(uploadFileToS3).toHaveBeenNthCalledWith(1, "some-path", "private", assetCredentials)
        expect(uploadFileToS3).toHaveBeenNthCalledWith(2, "some-other-path", "private", assetCredentials)
        done()
      })
    })

    it("saves the last uploaded photo on upload", async (done) => {
      const somePhoto = fakePhoto("some-path")
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
      getGeminiCredentialsForEnvironmentMock.mockReturnValueOnce(Promise.resolve(assetCredentials))

      uploadFileToS3Mock.mockReturnValue(Promise.resolve("some-s3-url"))

      uploadPhotos([somePhoto]).then(() => {
        const artworkState = __globalStoreTestUtils__?.getCurrentState().myCollection.artwork
        expect(artworkState?.sessionState.lastUploadedPhoto).toEqual(somePhoto)
        done()
      })
    })
  })
})

import { fireEvent } from "@testing-library/react-native"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import { myCollectionCreateArtworkMutation } from "__generated__/myCollectionCreateArtworkMutation.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/uploadFileToS3"
import { __globalStoreTestUtils__, GlobalStore } from "app/store/GlobalStore"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { Image } from "react-native-image-crop-picker"
import { RelayEnvironmentProvider } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import * as artworkMutations from "../../mutations/myCollectionCreateArtwork"
import { ArtworkFormValues } from "../../State/MyCollectionArtworkModel"
import {
  MyCollectionArtworkForm,
  MyCollectionArtworkFormProps,
  updateArtwork,
} from "./MyCollectionArtworkForm"
import * as photoUtil from "./MyCollectionImageUtil"

jest.mock("app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/uploadFileToS3", () => ({
  getConvectionGeminiKey: jest.fn(),
  getGeminiCredentialsForEnvironment: jest.fn(),
  uploadFileToS3: jest.fn(),
}))

jest.unmock("react-relay")

const getConvectionGeminiKeyMock = getConvectionGeminiKey as jest.Mock<any>
const getGeminiCredentialsForEnvironmentMock = getGeminiCredentialsForEnvironment as jest.Mock<any>
const uploadFileToS3Mock = uploadFileToS3 as jest.Mock<any>
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("MyCollectionArtworkForm", () => {
  describe("Editing an artwork", () => {
    it("renders the main form", async () => {
      const { getByText, getByTestId } = renderWithWrappersTL(
        <MyCollectionArtworkForm
          artwork={mockArtwork as any}
          mode="edit"
          onSuccess={jest.fn()}
          onDelete={jest.fn()}
        />
      )

      act(() => GlobalStore.actions.myCollection.artwork.startEditingArtwork(mockArtwork as any))

      expect(getByTestId("TitleInput").props.value).toBe("Morons")
      expect(getByTestId("DateInput").props.value).toBe("2007")
      expect(getByTestId("MaterialsInput").props.value).toBe("Screen print")
      expect(getByTestId("WidthInput").props.value).toBe("30")
      expect(getByTestId("HeightInput").props.value).toBe("20")
      expect(getByTestId("DepthInput").props.value).toBe("40")
      expect(getByText("1 photo added")).toBeTruthy()
    })
  })

  describe("Adding a new artwork", () => {
    afterEach(() => {
      mockEnvironment.mockClear()
      jest.clearAllMocks()
    })

    describe("when selecting an already existing artwork", () => {
      it("populates the form with the data from the artwork", async () => {
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

        const { getByText, getByTestId, getByPlaceholderText } = renderWithWrappersTL(
          <MyCollectionArtworkForm mode="add" onSuccess={jest.fn()} source={Tab.collection} />
        )

        // Select Artist Screen

        expect(getByText("Select an Artist")).toBeTruthy()

        act(() =>
          fireEvent.changeText(getByPlaceholderText("Search for artists on Artsy"), "banksy")
        )
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtistSearchResult,
          })
        )
        act(() => fireEvent.press(getByTestId("autosuggest-search-result-Banksy")))

        await flushPromiseQueue()

        // Select Artwork Screen

        expect(getByText("Select an Artwork")).toBeTruthy()

        act(() => fireEvent.changeText(getByPlaceholderText("Search artworks"), "banksy"))
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtworkSearchResult,
          })
        )
        act(() => fireEvent.press(getByTestId("artworkGridItem-Morons")))

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({ errors: [], data: mockArtworkResult })
        )

        await flushPromiseQueue()

        // Edit Details Screen

        expect(getByText("Add Details")).toBeTruthy()

        expect(getByTestId("TitleInput").props.value).toBe("Morons")
        expect(getByTestId("DateInput").props.value).toBe("2007")
        expect(getByTestId("MaterialsInput").props.value).toBe("Screen print")
        expect(getByTestId("WidthInput").props.value).toBe(30)
        expect(getByTestId("HeightInput").props.value).toBe(20)
        expect(getByTestId("DepthInput").props.value).toBe(40)
        expect(getByText("1 photo added")).toBeTruthy()

        // Complete Form

        act(() => fireEvent.press(getByTestId("CompleteButton")))

        await flushPromiseQueue()

        const mockOperations = mockEnvironment.mock.getAllOperations()

        const updatePreferencesOperation = mockOperations[0]
        expect(updatePreferencesOperation.request.variables).toMatchInlineSnapshot(`
          Object {
            "input": Object {
              "currencyPreference": "USD",
              "lengthUnitPreference": "IN",
            },
          }
        `)

        const createArtworkOperation = mockOperations[1]
        expect(createArtworkOperation.request.variables).toMatchInlineSnapshot(`
          Object {
            "input": Object {
              "artistIds": Array [
                "internal-id",
              ],
              "artists": undefined,
              "category": "Screen print",
              "date": "2007",
              "depth": 40,
              "externalImageUrls": Array [
                "https://some-bucket.s3.amazonaws.com/undefined",
              ],
              "height": 20,
              "importSource": "MY_COLLECTION",
              "isEdition": true,
              "medium": "Print",
              "metric": "in",
              "pricePaidCents": undefined,
              "pricePaidCurrency": "USD",
              "title": "Morons",
              "width": 30,
            },
          }
        `)
      })
    })

    describe("when skipping the artwork selection", () => {
      it("leaves the form empty", async () => {
        const { getByText, getByTestId, getByPlaceholderText } = renderWithWrappersTL(
          <RelayEnvironmentProvider environment={mockEnvironment}>
            <MyCollectionArtworkForm mode="add" onSuccess={jest.fn()} source={Tab.collection} />
          </RelayEnvironmentProvider>
        )

        // Select Artist Screen

        expect(getByText("Select an Artist")).toBeTruthy()

        act(() =>
          fireEvent.changeText(getByPlaceholderText("Search for artists on Artsy"), "banksy")
        )
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtistSearchResult,
          })
        )
        act(() => fireEvent.press(getByTestId("autosuggest-search-result-Banksy")))

        await flushPromiseQueue()
        // Select Artwork Screen

        expect(getByText("Select an Artwork")).toBeTruthy()

        act(() => fireEvent.press(getByTestId("my-collection-artwork-form-artwork-skip-button")))

        await flushPromiseQueue()
        // Edit Details Screen

        expect(getByText("Add Details")).toBeTruthy()

        expect(getByTestId("TitleInput").props.value).toBe("")
        expect(getByTestId("DateInput").props.value).toBe("")
        expect(getByTestId("MaterialsInput").props.value).toBe("")
        expect(getByTestId("WidthInput").props.value).toBe("")
        expect(getByTestId("HeightInput").props.value).toBe("")
        expect(getByTestId("DepthInput").props.value).toBe("")
      })
    })

    describe("when skipping the artist selection", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({
          AREnableArtworksFromNonArtsyArtists: true,
        })
      })

      it("displays the artist display name input", async () => {
        const { getByText, getByTestId } = renderWithWrappersTL(
          <RelayEnvironmentProvider environment={mockEnvironment}>
            <MyCollectionArtworkForm mode="add" onSuccess={jest.fn()} source={Tab.collection} />
          </RelayEnvironmentProvider>
        )

        // Select Artist Screen

        expect(getByText("Select an Artist")).toBeTruthy()

        act(() => fireEvent.press(getByTestId("my-collection-artwork-form-artist-skip-button")))

        await flushPromiseQueue()

        // Edit Details Screen

        expect(getByText("Add Details")).toBeTruthy()

        expect(getByTestId("ArtistDisplayNameInput").props.value).toBe(undefined)
        expect(getByTestId("TitleInput").props.value).toBe("")
        expect(getByTestId("DateInput").props.value).toBe("")
        expect(getByTestId("MaterialsInput").props.value).toBe("")
        expect(getByTestId("WidthInput").props.value).toBe("")
        expect(getByTestId("HeightInput").props.value).toBe("")
        expect(getByTestId("DepthInput").props.value).toBe("")
      })
    })
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

  describe("images", () => {
    describe("uploading images", () => {
      it("uploads photos to s3", async () => {
        uploadFileToS3Mock.mockReset()
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

        await photoUtil.uploadPhotos([somePhoto, someOtherPhoto])

        expect(uploadFileToS3).toHaveBeenCalledTimes(2)
        expect(uploadFileToS3).toHaveBeenNthCalledWith(1, {
          filePath: "some-path",
          acl: "private",
          assetCredentials,
        })
        expect(uploadFileToS3).toHaveBeenNthCalledWith(2, {
          filePath: "some-other-path",
          acl: "private",
          assetCredentials,
        })
      })
    })

    describe("updating artworks", () => {
      it("stores uploaded photos locally on artwork add", async () => {
        const fakePhotos = [
          fakePhoto("some-path"),
          fakePhoto("some-other-path"),
          fakePhoto("yet-another-path"),
        ]

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
          source: Tab.collection,
        }
        const uploadPhotosMock = jest.spyOn(photoUtil, "uploadPhotos")
        uploadPhotosMock.mockImplementation(() =>
          Promise.resolve(["image-url0", "image-url1", "image-url2"])
        )

        const artworkSlug = "some-slug"
        const artworkResponse: myCollectionCreateArtworkMutation["response"] = {
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
                    formattedNationalityAndBirthday: "British",
                    targetSupply: {
                      isP1: false,
                    },
                  },
                  dimensions: {
                    in: "23",
                    cm: "26",
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
                  artworkLocation: null,
                  provenance: null,
                  width: null,
                  title: null,
                  attributionClass: null,
                  consignmentSubmission: null,
                  hasMarketPriceInsights: null,
                },
              },
            },
          },
        }

        const addArtworkMock = jest.spyOn(artworkMutations, "myCollectionCreateArtwork")
        addArtworkMock.mockImplementation(() => Promise.resolve(artworkResponse))

        const storeLocalPhotosMock = jest.spyOn(photoUtil, "storeLocalPhotos")

        await updateArtwork(formValues, formCheckValues, props)

        expect(uploadPhotosMock).toBeCalledWith(fakePhotos)
        expect(addArtworkMock).toBeCalled()
        expect(storeLocalPhotosMock).toBeCalledWith(expect.anything(), fakePhotos)
      })
    })
  })

  describe("loading screens", () => {
    afterEach(() => {
      mockEnvironment.mockClear()
      jest.clearAllMocks()
    })

    describe("when AREnableMyCollectionInsights is enabled", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionInsights: true })
      })

      it("displays the new saving artwork loading screen", async () => {
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

        const { getByTestId, getByPlaceholderText } = renderWithWrappersTL(
          <MyCollectionArtworkForm mode="add" onSuccess={jest.fn()} source={Tab.collection} />
        )

        // Select Artist Screen
        act(() =>
          fireEvent.changeText(getByPlaceholderText("Search for artists on Artsy"), "banksy")
        )
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtistSearchResult,
          })
        )
        await flushPromiseQueue()

        act(() => fireEvent.press(getByTestId("autosuggest-search-result-Banksy")))

        await flushPromiseQueue()

        // Select Artwork Screen
        act(() => fireEvent.changeText(getByPlaceholderText("Search artworks"), "banksy"))
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtworkSearchResult,
          })
        )
        act(() => fireEvent.press(getByTestId("artworkGridItem-Morons")))

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({ errors: [], data: mockArtworkResult })
        )

        await flushPromiseQueue()

        // Complete Form
        act(() => fireEvent.press(getByTestId("CompleteButton")))

        await flushPromiseQueue()

        expect(getByTestId("saving-artwork-modal").props.visible).toBe(true)
      })
    })

    describe("when AREnableMyCollectionInsights is disabled", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableMyCollectionInsights: false })
      })

      it("displays normal loading screen", async () => {
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

        const { getByTestId, getByPlaceholderText } = renderWithWrappersTL(
          <MyCollectionArtworkForm mode="add" onSuccess={jest.fn()} source={Tab.collection} />
        )

        // Select Artist Screen
        act(() =>
          fireEvent.changeText(getByPlaceholderText("Search for artists on Artsy"), "banksy")
        )
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtistSearchResult,
          })
        )
        await flushPromiseQueue()

        act(() => fireEvent.press(getByTestId("autosuggest-search-result-Banksy")))

        await flushPromiseQueue()

        // Select Artwork Screen
        act(() => fireEvent.changeText(getByPlaceholderText("Search artworks"), "banksy"))
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtworkSearchResult,
          })
        )
        act(() => fireEvent.press(getByTestId("artworkGridItem-Morons")))

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({ errors: [], data: mockArtworkResult })
        )

        await flushPromiseQueue()

        // Complete Form
        act(() => fireEvent.press(getByTestId("CompleteButton")))

        await flushPromiseQueue()

        expect(getByTestId("loading-modal").props.visible).toBe(true)
      })
    })
  })
})

const mockArtworkSearchResult = {
  viewer: {
    artworks: {
      edges: [
        {
          cursor: "page-1",
          node: {
            id: "QXJ0d29yazo2MTg5N2MxMWFlMmUzMzAwMGRjOTUwODg=",
            __typename: "Artwork",
            slug: "banksy-morons-unsigned-16",
            image: {
              aspectRatio: 1.4,
              url: "https://d32dm0rphc51dk.cloudfront.net/CwzH4uRDHZbb04u9eC3uhg/large.jpg",
            },
            title: "Morons",
            date: "2007",
            saleMessage: "Contact For Price",
            internalID: "61897c11ae2e33000dc95088",
            artistNames: "Banksy",
            href: "/artwork/banksy-morons-unsigned-16",
            sale: null,
            saleArtwork: null,
            partner: null,
          },
        },
      ],
      pageInfo: {
        startCursor: "page-1",
        endCursor: "page-2",
        hasNextPage: true,
      },
    },
  },
}

const mockArtistSearchResult: AutosuggestResultsQuery["rawResponse"] = {
  results: {
    edges: [
      {
        cursor: "page-1",
        node: {
          __isNode: "SearchableItem",
          __typename: "SearchableItem",
          internalID: "internal-id",
          displayLabel: "Banksy",
          displayType: "Artist",
          href: "banksy-href",
          id: "banksy",
          imageUrl: "",
          slug: "banksy",
        },
      },
    ],
    pageInfo: {
      endCursor: "page-2",
      hasNextPage: true,
    },
  },
}

const mockArtworkResult = {
  artwork: {
    artist: {
      internalID: "4dd1584de0091e000100207c",
      formattedNationalityAndBirthday: "British",
    },
    artistNames: "Banksy",
    category: "Screen print",
    pricePaid: null,
    date: "2007",
    depth: 40,
    editionSize: null,
    editionNumber: null,
    height: 20,
    id: "QXJ0d29yazo2MWMwOTk4ZWU0YjZjMzAwMGI3NmJmYjE=",
    images: [
      {
        isDefault: true,
        imageURL: "https://d32dm0rphc51dk.cloudfront.net/h2pjCdc8kASLMsyjhHkXpw/:version.jpg",
        width: 640,
        height: 473,
        internalID: "61c0998ec9663e000b368462",
      },
    ],
    internalID: "61c0998ee4b6c3000b76bfb1",
    isEdition: true,
    medium: "Print",
    metric: "in",
    provenance: null,
    slug: "61c0998ee4b6c3000b76bfb1",
    title: "Morons",
    width: 30,
  },
}

const mockArtwork = {
  artist: {
    internalID: "4dd1584de0091e000100207c",
    formattedNationalityAndBirthday: "British",
  },
  artistNames: "Banksy",
  category: "Screen print",
  pricePaid: null,
  date: "2007",
  depth: "40",
  editionSize: null,
  editionNumber: null,
  height: "20",
  id: "QXJ0d29yazo2MWMwOTk4ZWU0YjZjMzAwMGI3NmJmYjE=",
  images: [
    {
      isDefault: true,
      imageURL: "https://d32dm0rphc51dk.cloudfront.net/h2pjCdc8kASLMsyjhHkXpw/:version.jpg",
      width: 640,
      height: 473,
      internalID: "61c0998ec9663e000b368462",
    },
  ],
  internalID: "61c0998ee4b6c3000b76bfb1",
  isEdition: true,
  medium: "Print",
  metric: "in",
  provenance: null,
  slug: "61c0998ee4b6c3000b76bfb1",
  title: "Morons",
  width: "30",
}

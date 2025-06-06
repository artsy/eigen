import { act, fireEvent, screen } from "@testing-library/react-native"
import { AutosuggestResultsQuery } from "__generated__/AutosuggestResultsQuery.graphql"
import { myCollectionCreateArtworkMutation } from "__generated__/myCollectionCreateArtworkMutation.graphql"
import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "app/Components/PhotoRow/utils/uploadFileToS3"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import {
  MyCollectionArtworkFormProps,
  MyCollectionArtworkFormScreen,
} from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import * as photoUtil from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionImageUtil"
import { saveOrUpdateArtwork } from "app/Scenes/MyCollection/Screens/ArtworkForm/methods/uploadArtwork"
import { ArtworkFormValues } from "app/Scenes/MyCollection/State/MyCollectionArtworkModel"
import * as artworkMutations from "app/Scenes/MyCollection/mutations/myCollectionCreateArtwork"
import { GlobalStore } from "app/store/GlobalStore"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import * as LocalImageStore from "app/utils/LocalImageStore"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { Image } from "react-native-image-crop-picker"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Components/PhotoRow/utils/uploadFileToS3", () => ({
  getConvectionGeminiKey: jest.fn(),
  getGeminiCredentialsForEnvironment: jest.fn(),
  uploadFileToS3: jest.fn(),
}))

const getConvectionGeminiKeyMock = getConvectionGeminiKey as jest.Mock<any>
const getGeminiCredentialsForEnvironmentMock = getGeminiCredentialsForEnvironment as jest.Mock<any>
const uploadFileToS3Mock = uploadFileToS3 as jest.Mock<any>

describe("MyCollectionArtworkForm", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = getMockRelayEnvironment()
  })

  describe("Editing an artwork", () => {
    it("renders the main form", async () => {
      renderWithHookWrappersTL(
        <MyCollectionArtworkFormScreen artwork={mockArtwork as any} mode="edit" />,
        mockEnvironment
      )

      GlobalStore.actions.myCollection.artwork.startEditingArtwork(mockArtwork as any)

      await flushPromiseQueue()

      expect(screen.getByTestId("TitleInput").props.value).toBe("Morons")
      expect(screen.getByTestId("DateInput").props.value).toBe("2007")
      expect(screen.getByTestId("MaterialsInput").props.value).toBe("Screen print")
      expect(screen.getByTestId("WidthInput").props.value).toBe("30")
      expect(screen.getByTestId("HeightInput").props.value).toBe("20")
      expect(screen.getByTestId("autocomplete-location-input")).toBeTruthy()
      expect(screen.getByTestId("DepthInput").props.value).toBe("40")
      expect(screen.getByText("1 photo added")).toBeTruthy()
    })
  })

  describe("Adding a new artwork", () => {
    afterEach(() => {
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

        renderWithHookWrappersTL(
          <MyCollectionArtworkFormScreen mode="add" source={Tab.collection} />,
          mockEnvironment
        )

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockCollectedArtistsResult,
          })
        )

        await flushPromiseQueue()

        // Select Artist Screen

        expect(screen.getByText("Select an Artist")).toBeTruthy()

        fireEvent.changeText(screen.getByPlaceholderText("Search for artists on Artsy"), "banksy")
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtistSearchResult,
          })
        )

        await flushPromiseQueue()

        fireEvent.press(screen.getByTestId("autosuggest-search-result-Banksy"))

        await flushPromiseQueue()

        // Select Artwork Screen

        expect(screen.getByText("Select an Artwork")).toBeTruthy()

        fireEvent.changeText(screen.getByPlaceholderText("Search artworks"), "banksy")
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtworkSearchResult,
          })
        )
        fireEvent.press(screen.getByTestId("artworkGridItem-Morons"))

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({ errors: [], data: mockArtworkResult })
        )

        await flushPromiseQueue()

        // Edit Details Screen

        expect(screen.getByText("Add Details")).toBeTruthy()

        expect(screen.getByTestId("TitleInput").props.value).toBe("Morons")
        expect(screen.getByTestId("DateInput").props.value).toBe("2007")
        expect(screen.getByTestId("MaterialsInput").props.value).toBe("Screen print")
        expect(screen.getByTestId("WidthInput").props.value).toBe(30)
        expect(screen.getByTestId("HeightInput").props.value).toBe(20)
        expect(screen.getByTestId("DepthInput").props.value).toBe(40)
        expect(screen.getByTestId("NotesInput").props.value).toBe(undefined)
        expect(screen.getByText("1 photo added")).toBeTruthy()

        // Complete Form

        fireEvent.press(screen.getByTestId("CompleteButton"))

        await flushPromiseQueue()

        const mockOperations = mockEnvironment.mock.getAllOperations()

        // debugger

        const myCollectionArtworkFormDeleteArtworkModalQuery = mockOperations[0]
        expect(myCollectionArtworkFormDeleteArtworkModalQuery.request.variables)
          .toMatchInlineSnapshot(`
          {
            "artistID": "internal-id",
          }
        `)

        const updatePreferencesOperation = mockOperations[1]
        expect(updatePreferencesOperation.request.variables).toMatchInlineSnapshot(`
          {
            "input": {
              "currencyPreference": "USD",
              "lengthUnitPreference": "IN",
            },
          }
        `)

        const createArtworkOperation = mockOperations[2]
        expect(createArtworkOperation.request.variables).toMatchInlineSnapshot(`
          {
            "input": {
              "artistIds": [
                "internal-id",
              ],
              "artists": undefined,
              "attributionClass": undefined,
              "category": "Print",
              "collectorLocation": {
                "city": null,
                "country": null,
                "countryCode": null,
                "state": null,
              },
              "confidentialNotes": undefined,
              "date": "2007",
              "depth": 40,
              "editionNumber": "",
              "editionSize": "",
              "externalImageUrls": [
                "https://some-bucket.s3.amazonaws.com/undefined",
              ],
              "height": 20,
              "importSource": "MY_COLLECTION",
              "isEdition": true,
              "medium": "Screen print",
              "metric": "in",
              "pricePaidCents": undefined,
              "pricePaidCurrency": "USD",
              "provenance": undefined,
              "title": "Morons",
              "width": 30,
            },
          }
        `)
      })
    })

    describe("when skipping the artwork selection", () => {
      it("leaves the form empty", async () => {
        renderWithHookWrappersTL(
          <MyCollectionArtworkFormScreen mode="add" source={Tab.collection} />,
          mockEnvironment
        )

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockCollectedArtistsResult,
          })
        )

        await flushPromiseQueue()

        // Select Artist Screen

        expect(screen.getByText("Select an Artist")).toBeTruthy()

        fireEvent.changeText(screen.getByPlaceholderText("Search for artists on Artsy"), "banksy")

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtistSearchResult,
          })
        )

        await flushPromiseQueue()

        fireEvent.press(screen.getByTestId("autosuggest-search-result-Banksy"))

        await flushPromiseQueue()

        // Select Artwork Screen

        expect(screen.getByText("Select an Artwork")).toBeTruthy()

        fireEvent.changeText(screen.getByPlaceholderText("Search artworks"), "Test Artwork Title")

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtworkSearchResult,
          })
        )

        await flushPromiseQueue()

        fireEvent.press(screen.getByTestId("my-collection-artwork-form-artwork-skip-button"))

        await flushPromiseQueue()

        // Edit Details Screen

        expect(screen.getByText("Add Details")).toBeTruthy()

        expect(screen.getByTestId("TitleInput").props.value).toBe("Test Artwork Title")
        expect(screen.getByTestId("DateInput").props.value).toBe(undefined)
        expect(screen.getByTestId("MaterialsInput").props.value).toBe(undefined)
        expect(screen.getByTestId("WidthInput").props.value).toBe(undefined)
        expect(screen.getByTestId("HeightInput").props.value).toBe(undefined)
        expect(screen.getByTestId("DepthInput").props.value).toBe(undefined)
        expect(screen.getByTestId("NotesInput").props.value).toBe(undefined)
      })
    })

    describe("when skipping the artist selection", () => {
      it("initializes the artist name input field", async () => {
        renderWithHookWrappersTL(
          <MyCollectionArtworkFormScreen mode="add" source={Tab.collection} />,
          mockEnvironment
        )

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockCollectedArtistsResult,
          })
        )

        await flushPromiseQueue()

        // Select Artist Screen

        expect(screen.getByText("Select an Artist")).toBeTruthy()

        fireEvent.changeText(screen.getByPlaceholderText("Search for artists on Artsy"), "foo bar")

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtistSearchResult,
          })
        )

        fireEvent.press(screen.getByTestId("my-collection-artwork-form-artist-skip-button"))

        await flushPromiseQueue()

        // Add Artist Screen
        fireEvent.changeText(screen.getByTestId("artist-input"), "My Artist")
        fireEvent.changeText(screen.getByTestId("nationality-input"), "bar foo")

        await flushPromiseQueue()

        fireEvent.press(screen.getByTestId("submit-add-artist-button"))

        await flushPromiseQueue()

        // Edit Details Screen

        expect(screen.getByText("Add Details")).toBeTruthy()

        expect(screen.getByTestId("TitleInput").props.value).toBe("")
        expect(screen.getByTestId("DateInput").props.value).toBe(undefined)
        expect(screen.getByTestId("MaterialsInput").props.value).toBe(undefined)
        expect(screen.getByTestId("WidthInput").props.value).toBe(undefined)
        expect(screen.getByTestId("HeightInput").props.value).toBe(undefined)
        expect(screen.getByTestId("DepthInput").props.value).toBe(undefined)
        expect(screen.getByTestId("NotesInput").props.value).toBe(undefined)
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
          customArtist: null,
          artistIds: ["some-artist-id"],
          artistSearchResult: {
            imageUrl: null,
            href: null,
            displayLabel: null,
            __typename: "some-type",
            internalID: "some-internal-id",
          },
          category: "oil on oil",
          collectorLocation: {
            city: "some-city",
          },
          confidentialNotes: "some-notes",
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
          attributionClass: "LIMITED_EDITION",
        }
        const formCheckValues = formValues
        const props: MyCollectionArtworkFormProps = {
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
                      isTargetSupply: false,
                    },
                  },
                  collectorLocation: {
                    city: "some-city",
                    state: "some-state",
                    country: "some-country",
                    countryCode: "some-country-code",
                  },
                  confidentialNotes: "some-notes",
                  dimensions: {
                    in: "23",
                    cm: "26",
                  },
                  images: [
                    {
                      internalID: "some-internal-id",
                      height: 100,
                      width: 100,
                      imageURL: "some-image-url",
                      isDefault: true,
                    },
                  ],
                  artistNames: "some-artist-name",
                  category: null,
                  pricePaid: null,
                  date: null,
                  depth: null,
                  editionSize: null,
                  editionNumber: null,
                  height: null,
                  medium: null,
                  isEdition: null,
                  metric: null,
                  provenance: null,
                  width: null,
                  title: null,
                  attributionClass: null,
                  hasMarketPriceInsights: null,
                },
              },
            },
          },
        }

        const addArtworkMock = jest.spyOn(artworkMutations, "myCollectionCreateArtwork")
        addArtworkMock.mockImplementation(() => Promise.resolve(artworkResponse))

        const storeLocalImageMock = jest.spyOn(LocalImageStore, "storeLocalImage")

        await saveOrUpdateArtwork(formValues, formCheckValues, props)

        expect(uploadPhotosMock).toBeCalledWith(fakePhotos)
        expect(addArtworkMock).toBeCalled()
        expect(storeLocalImageMock).toBeCalledWith("some-internal-id", {
          height: 10,
          path: "some-path",
          width: 10,
        })
      })
    })

    describe("loading screens", () => {
      afterEach(() => {
        jest.clearAllMocks()
      })

      it("displays saving artwork loading modal", async () => {
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

        renderWithHookWrappersTL(
          <MyCollectionArtworkFormScreen mode="add" source={Tab.collection} />,
          mockEnvironment
        )

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockCollectedArtistsResult,
          })
        )

        await flushPromiseQueue()

        // Select Artist Screen

        fireEvent.changeText(screen.getByPlaceholderText("Search for artists on Artsy"), "banksy")
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtistSearchResult,
          })
        )
        await flushPromiseQueue()

        fireEvent.press(screen.getByTestId("autosuggest-search-result-Banksy"))

        await flushPromiseQueue()

        // Select Artwork Screen

        fireEvent.changeText(screen.getByPlaceholderText("Search artworks"), "banksy")
        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({
            errors: [],
            data: mockArtworkSearchResult,
          })
        )
        fireEvent.press(screen.getByTestId("artworkGridItem-Morons"))

        act(() =>
          mockEnvironment.mock.resolveMostRecentOperation({ errors: [], data: mockArtworkResult })
        )

        await flushPromiseQueue()

        // Complete Form
        fireEvent.press(screen.getByTestId("CompleteButton"))

        await flushPromiseQueue()

        expect(screen.getByTestId("saving-artwork-modal")).toBeDefined()
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
            saleMessage: "Price on request",
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

const mockCollectedArtistsResult = {
  me: {
    userInterestsConnection: {
      edges: [
        {
          node: {
            __typename: "Artist",
            displayLabel: "My Artist",
            formattedNationalityAndBirthday: "British, b. 1974",
            initials: "MA",
            internalID: "my-artist-id",
            slug: "My Artist",
          },
        },
      ],
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
    category: "Print",
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
    medium: "Screen print",
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
  category: "Print",
  confidentialNotes: "some-notes",
  collectorLocation: {
    city: "Busytown",
    country: "USA",
    postalCode: "12345",
    state: "CA",
    stateCode: "CA",
  },
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
  medium: "Screen print",
  metric: "in",
  provenance: null,
  slug: "61c0998ee4b6c3000b76bfb1",
  title: "Morons",
  width: "30",
}

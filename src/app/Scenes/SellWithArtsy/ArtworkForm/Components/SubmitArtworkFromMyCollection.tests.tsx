import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { SubmitArtworkFromMyCollection } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFromMyCollection"
import { FetchArtworkInformationResult } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/fetchArtworkInformation"
import { setupWithSubmitArtworkTestWrappers } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"

const mockNavigateToNextStep = jest.fn()

jest.mock("app/Scenes/SellWithArtsy/ArtworkForm/Utils/useSubmissionContext", () => ({
  useSubmissionContext: () => {
    return {
      navigateToNextStep: mockNavigateToNextStep,
    }
  },
}))

jest.mock("app/Scenes/SellWithArtsy/ArtworkForm/Utils/fetchArtworkInformation", () => ({
  fetchArtworkInformation: jest.fn().mockResolvedValue({ artwork: mockedFetchedArtwork }),
}))

describe("SubmitArtworkFromMyCollection", () => {
  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("render the list of my collection artworks", async () => {
    const { renderWithRelay } = setupWithSubmitArtworkTestWrappers({
      Component: <SubmitArtworkFromMyCollection />,
    })

    renderWithRelay({
      Me: () => ({
        myCollectionConnection: {
          edges: [
            {
              node: {
                id: "my-artwork-id",
                slug: "my-artwork-slug",
                title: "My artwork",
                submissionId: null,
                artistNames: "Artist Name",
                image: {
                  url: "https://my-artwork.jpg",
                },
              },
            },
          ],
        },
      }),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId("placeholder"))

    expect(screen.getByText("My artwork")).toBeOnTheScreen()
  })
})

const mockedFetchedArtwork: NonNullable<FetchArtworkInformationResult> = {
  internalID: "my-artwork-id",
  artist: {
    displayLabel: "Artist Name",
    imageUrl: "https://artist.jpg",
    href: "artist-href",
    internalID: "artist-id",
  },
  attributionClass: {
    name: "Unique",
  },
  category: "PHOTOGRAPHY",
  depth: "12",
  metric: "in",
  isEdition: true,
  editionNumber: "22",
  editionSize: "43",
  height: "23",
  location: {
    city: "Berlin",
    state: "Berlin",
    country: "Germany",
    postalCode: "12345",
  },
  medium: "a valid medium",
  provenance: "From the artist",
  signature: "signed by the artist",
  width: "",
  title: "",
  date: "213",

  // Photos
  images: [],
}

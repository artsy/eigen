import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkSelectArtist } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkSelectArtist"
import { setupWithSubmitArtworkTestWrappers } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"

const mockNavigateToNextStep = jest.fn()
jest.mock("app/Scenes/SellWithArtsy/ArtworkForm/Utils/navigationHelpers", () => ({
  useSubmissionContext: () => {
    return {
      navigateToNextStep: mockNavigateToNextStep,
    }
  },
}))

jest.mock(
  "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission",
  () => ({
    createOrUpdateSubmission: jest.fn(),
  })
)

// TODO: Fix this post-release
describe.skip("SubmitArtworkSelectArtist", () => {
  it("Navigates to the next step after tapping an artwork", async () => {
    const { renderWithRelay } = setupWithSubmitArtworkTestWrappers({
      Component: <SubmitArtworkSelectArtist />,
    })

    renderWithRelay({
      Me: () => ({
        userInterestsConnection: userInterestsConnectionFixtures,
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByText("Add artist name")).toBeOnTheScreen()

    const input = screen.getByPlaceholderText("Search for artists on Artsy")

    fireEvent(input, "onChangeText", "Andy")

    await flushPromiseQueue()

    renderWithRelay({
      Me: () => ({
        userInterestsConnection: userInterestsConnectionFixtures,
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()

    fireEvent.press(screen.getByText("Andy Warhol"), "onPress")

    await flushPromiseQueue()

    expect(mockNavigateToNextStep).toBeCalled()
  })

  it("Shows only P1 artists", async () => {
    const { renderWithRelay } = setupWithSubmitArtworkTestWrappers({
      Component: <SubmitArtworkSelectArtist />,
    })

    renderWithRelay({
      Me: () => ({
        userInterestsConnection: userInterestsConnectionFixtures,
      }),
    })

    await flushPromiseQueue()

    renderWithRelay({
      Me: () => ({
        userInterestsConnection: userInterestsConnectionFixtures,
      }),
    })

    expect(screen.getByText("Andy Warhol")).toBeOnTheScreen()
    expect(screen.getByText("Banksy")).toBeOnTheScreen()
    expect(screen.queryByText("Unknwon Artist")).not.toBeOnTheScreen()
  })
})

const userInterestsConnectionFixtures = {
  edges: [
    {
      internalID: "random-id-1",
      node: {
        __isNode: "Artist",
        __typename: "Artist",
        internalID: "andy-internal-id",
        displayLabel: "Andy Warhol",
        displayType: "Artist",
        href: "andy-warhol-href",
        id: "andy-warhol",
        imageUrl: "",
        slug: "",
        targetSupply: {
          isTargetSupply: true,
        },
      },
    },
    {
      internalID: "random-id",
      node: {
        __isNode: "Artist",
        __typename: "Artist",
        internalID: "banksy-internal-id",
        displayLabel: "Banksy",
        displayType: "Artist",
        href: "banksy-warhol-href",
        id: "banksy",
        imageUrl: "",
        slug: "",
        targetSupply: {
          isTargetSupply: true,
        },
      },
    },

    {
      internalID: "random-id",
      node: {
        __isNode: "Artist",
        __typename: "Artist",
        internalID: "unknown-artist-internal-id",
        displayLabel: "Unknown Artist",
        displayType: "Artist",
        href: "unknown-artist-href",
        id: "unknown-artist",
        imageUrl: "",
        slug: "",
        targetSupply: {
          isTargetSupply: false,
        },
      },
    },
  ],
}

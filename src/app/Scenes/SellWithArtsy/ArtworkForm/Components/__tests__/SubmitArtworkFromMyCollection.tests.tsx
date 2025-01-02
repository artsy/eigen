import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { SubmitArtworkFromMyCollection } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFromMyCollection"
import { setupWithSubmitArtworkTestWrappers } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"

describe("SubmitArtworkFromMyCollection", () => {
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

import { MyCollectionCollectedArtistsRail } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistsRail"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

let mockRelay: any

describe("MyCollectionCollectedArtistsRail", () => {
  beforeEach(() => {
    mockRelay = {
      refetch: jest.fn(),
    }
  })

  it("renders collected artist", async () => {
    const { queryByText } = renderWithWrappers(
      <MyCollectionCollectedArtistsRail
        myCollectionInfo={mockCollectedArtist as any}
        relay={mockRelay as any}
      />
    )

    expect(queryByText("Rhombie Sandoval")).toBeTruthy()
  })
})

const mockCollectedArtist = {
  collectedArtistsConnection: {
    edges: [
      {
        node: {
          internalID: "5f112c5876efda000e68f3a9",
          name: "Rhombie Sandoval",
          initials: "RS",
          image: {
            url: "https://d32dm0rphc51dk.cloudfront.net/9fBwpcL2aMa2YyBEzol8Yg/square.jpg",
          },
        },
      },
    ],
  },
}

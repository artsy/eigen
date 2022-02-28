import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import React from "react"
import { RecommendedArtistsRail } from "./RecommendedArtistsRail"

jest.unmock("react-relay")
let fakeRelay: any

describe("RecommendedArtistsRail", () => {
  beforeEach(() => {
    fakeRelay = {
      refetch: jest.fn(),
    }
  })

  it("Renders list of recommended artists without throwing an error", async () => {
    const { queryByText } = renderWithWrappersTL(
      <RecommendedArtistsRail
        scrollRef={null}
        title="Recommended Artists"
        relay={fakeRelay as any}
        me={mockMe as any}
      />
    )

    expect(queryByText("Rhombie Sandoval")).toBeTruthy()
    expect(queryByText("Mexican-American, b. 1991")).toBeTruthy()
  })

  it("returns null if there are no artists", async () => {
    const { toJSON } = renderWithWrappersTL(
      <RecommendedArtistsRail
        scrollRef={null}
        title="Recommended Artists"
        relay={fakeRelay as any}
        me={emptyMe as any}
      />
    )

    expect(toJSON()).toBeNull()
  })
})

const emptyMe = {
  artistRecommendations: {
    edges: [],
  },
}
const mockMe = {
  artistRecommendations: {
    edges: [
      {
        node: {
          name: "Rhombie Sandoval",
          id: "QXJ0aXN0OjVmMTEyYzU4NzZlZmRhMDAwZTY4ZjNhOQ==",
          slug: "rhombie-sandoval",
          internalID: "5f112c5876efda000e68f3a9",
          href: "/artist/rhombie-sandoval",
          formattedNationalityAndBirthday: "Mexican-American, b. 1991",
          image: { url: "https://d32dm0rphc51dk.cloudfront.net/9fBwpcL2aMa2YyBEzol8Yg/square.jpg" },
          basedOn: null,
          isFollowed: false,
        },
      },
    ],
  },
}

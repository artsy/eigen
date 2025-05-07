import { fireEvent, screen } from "@testing-library/react-native"
import { navigate } from "app/system/navigation/navigate"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { ItemArtworkFragmentContainer } from "./ItemArtwork"

describe("ItemArtworkFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: (props: any) => <ItemArtworkFragmentContainer {...props} />,
    query: graphql`
      query ItemArtwork_Test_Query @relay_test_operation {
        artwork(id: "test-artwork") {
          ...ItemArtwork_artwork
        }
      }
    `,
  })

  it("render", () => {
    renderWithRelay({
      Artwork: () => ({
        title: "Test Artwork",
        date: "December, 2021",
        artistNames: "Test Artists",
        partner: {
          name: "Test Partner",
        },
        image: {
          thumbnailUrl: "https://testthumbnail",
        },
        saleMessage: "Price on request",
      }),
    })

    expect(screen.getByText("Artwork")).toBeDefined()
    expect(screen.getByText("Test Artwork, December, 2021")).toBeDefined()
    expect(screen.getByText("Test Artists")).toBeDefined()
    expect(screen.getByText("Test Partner")).toBeDefined()
    expect(screen.getByText("Price on request")).toBeDefined()
    expect(screen.getByTestId("artworkImage")).toBeDefined()
  })

  it("navigates when clicked", () => {
    renderWithRelay({
      Artwork: () => ({
        href: "https://testhref",
      }),
    })

    fireEvent.press(screen.getByTestId("artworkImage"))

    expect(navigate).toHaveBeenCalledWith("https://testhref")
  })
})

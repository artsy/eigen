import { fireEvent } from "@testing-library/react-native"
import * as navigation from "app/system/navigation/navigate"
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
    const { getByText, getByTestId } = renderWithRelay({
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
        saleMessage: "Contact for price",
      }),
    })

    expect(getByText("Artwork")).toBeDefined()
    expect(getByText("Test Artwork, December, 2021")).toBeDefined()
    expect(getByText("Test Artists")).toBeDefined()
    expect(getByText("Test Partner")).toBeDefined()
    expect(getByText("Price on request")).toBeDefined()
    expect(getByTestId("artworkImage")).toBeDefined()
  })

  it("navigates when clicked", () => {
    const navigateSpy = jest.spyOn(navigation, "navigate")
    const { getByTestId } = renderWithRelay({
      Artwork: () => ({
        href: "https://testhref",
      }),
    })

    fireEvent.press(getByTestId("artworkImage"))

    expect(navigateSpy).toHaveBeenCalledTimes(1)
    expect(navigateSpy).toHaveBeenCalledWith("https://testhref")
  })
})

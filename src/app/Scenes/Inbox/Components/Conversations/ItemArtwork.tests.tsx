import { fireEvent } from "@testing-library/react-native"
import * as navigation from "app/navigation/navigate"
import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import React from "react"
import { graphql } from "react-relay"
import { ItemArtworkFragmentContainer } from "./ItemArtwork"

jest.unmock("react-relay")

describe("ItemArtworkFragmentContainer", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: (props: any) => (
      <Theme>
        <ItemArtworkFragmentContainer {...props} />
      </Theme>
    ),
    query: graphql`
      query ItemArtwork_Test_Query {
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
        saleMessage: "Contact For Price",
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

import { screen, within } from "@testing-library/react-native"
import { HomeViewSectionSalesItemTestsQuery } from "__generated__/HomeViewSectionSalesItemTestsQuery.graphql"
import { HomeViewSectionSalesItem } from "app/Scenes/HomeView/Sections/HomeViewSectionSalesItem"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@d11/react-native-fast-image", () => {
  const React = require("react")
  const { View } = require("react-native")
  const FastImage = (props: any) => React.createElement(View, { testID: "fast-image", ...props })
  FastImage.priority = { low: "low", normal: "normal", high: "high" }
  FastImage.resizeMode = {
    contain: "contain",
    cover: "cover",
    stretch: "stretch",
    center: "center",
  }
  return FastImage
})

describe("HomeViewSectionSalesItem", () => {
  const { renderWithRelay } = setupTestWrapper<HomeViewSectionSalesItemTestsQuery>({
    Component: ({ sale }) => <HomeViewSectionSalesItem sale={sale!} />,
    query: graphql`
      query HomeViewSectionSalesItemTestsQuery @relay_test_operation {
        sale(id: "sale-id") {
          ...HomeViewSectionSalesItem_sale
        }
      }
    `,
  })

  it("renders the sale meta", async () => {
    await renderWithRelay({ Sale: () => mockSale })

    expect(screen.getByText("Phillips Editions")).toBeOnTheScreen()
  })

  it("renders an image for each representative artwork", async () => {
    await renderWithRelay({ Sale: () => mockSale })

    // ImageWithFallback resizes via Gemini, which embeds the source URL as an encoded `src` param.
    const uriFor = (testID: string) =>
      within(screen.getByTestId(testID)).getByTestId("fast-image").props.source.uri
    expect(uriFor("image-1")).toContain(encodeURIComponent("https://example.com/image-1.jpg"))
    expect(uriFor("image-2")).toContain(encodeURIComponent("https://example.com/image-2.jpg"))
    expect(uriFor("image-3")).toContain(encodeURIComponent("https://example.com/image-3.jpg"))
  })

  it("renders fallbacks when there are no representative artworks", async () => {
    await renderWithRelay({ Sale: () => ({ ...mockSale, representativeArtworks: [] }) })

    expect(screen.queryByTestId("image-1")).not.toBeOnTheScreen()
    expect(screen.getByTestId("fallback-image")).toBeOnTheScreen()
  })
})

const representativeArtworks = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    image: { url: `https://example.com/image-${i + 1}.jpg` },
  }))

const mockSale = {
  href: "/auction/phillips-editions",
  name: "Phillips Editions",
  liveURLIfOpen: null,
  formattedStartDateTime: "Ends Jan 1",
  representativeArtworks: representativeArtworks(3),
}

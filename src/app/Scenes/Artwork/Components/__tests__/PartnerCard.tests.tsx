import { screen } from "@testing-library/react-native"
import { PartnerCardTestsQuery } from "__generated__/PartnerCardTestsQuery.graphql"
import { PartnerCard_artwork$data } from "__generated__/PartnerCard_artwork.graphql"
import { PartnerCardFragmentContainer } from "app/Scenes/Artwork/Components/PartnerCard"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("PartnerCard", () => {
  const { renderWithRelay } = setupTestWrapper<PartnerCardTestsQuery>({
    Component: ({ artwork, me }) => {
      return <PartnerCardFragmentContainer artwork={artwork} me={me} />
    },
    query: graphql`
      query PartnerCardTestsQuery @relay_test_operation @raw_response_type {
        artwork(id: "artworkID") @required(action: NONE) {
          ...PartnerCard_artwork
        }
        me @required(action: NONE) {
          ...useSendInquiry_me
          ...MyProfileEditModal_me
        }
      }
    `,
  })

  it("renders partner name correctly", () => {
    renderWithRelay({
      Artwork: () => PartnerCardArtwork,
    })

    expect(screen.getByText("Test Gallery")).toBeTruthy()
  })

  it("renders partner image", () => {
    renderWithRelay({
      Artwork: () => PartnerCardArtwork,
    })

    expect(screen.getByLabelText("AvatarImage")).toBeOnTheScreen()
    expect(screen.queryByLabelText("Avatar")).not.toBeOnTheScreen()
  })

  it("renders partner type", () => {
    renderWithRelay({
      Artwork: () => PartnerCardArtwork,
    })

    expect(screen.getByText("Gallery")).toBeTruthy()
  })

  it("renders partner type correctly for institutional sellers", () => {
    const PartnerCardArtworkInstitutionalSeller = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Institutional Seller",
      },
    }

    renderWithRelay({
      Artwork: () => PartnerCardArtworkInstitutionalSeller,
    })

    expect(screen.getByText("Institution")).toBeTruthy()
  })

  it("doesn't render partner type for partners that aren't institutions or galleries", () => {
    const PartnerCardArtworkOtherType = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Some Other Partner Type",
      },
    }
    renderWithRelay({
      Artwork: () => PartnerCardArtworkOtherType,
    })

    expect(screen.queryByText("At institution")).toBeFalsy()
    expect(screen.queryByText("At gallery")).toBeFalsy()
  })

  it("renders partner initials when no image is present", () => {
    const PartnerCardArtworkWithoutImage = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        profile: null,
      },
    }
    renderWithRelay({
      Artwork: () => PartnerCardArtworkWithoutImage,
    })

    expect(screen.getByText("TG")).toBeTruthy()
    expect(screen.queryByLabelText("AvatarImage")).not.toBeOnTheScreen()
    expect(screen.getByLabelText("Avatar")).toBeOnTheScreen()
  })

  it("truncates partner locations correctly", () => {
    renderWithRelay({
      Artwork: () => PartnerCardArtwork,
    })

    expect(screen.getByText("Miami, New York, +3 more")).toBeTruthy()
  })

  it("does not render when the partner is an auction house", () => {
    const PartnerCardArtworkAuctionHouse: PartnerCard_artwork$data = {
      ...PartnerCardArtwork,
      partner: {
        ...PartnerCardArtwork.partner!,
        type: "Auction House",
      },
    }
    const { toJSON } = renderWithRelay({
      Artwork: () => PartnerCardArtworkAuctionHouse,
    })

    expect(toJSON()).toBeNull()
  })

  it("does not render when the artwork is in a benefit or gallery auction", () => {
    const PartnerCardArtworkAuction = {
      ...PartnerCardArtwork,
      sale: {
        isBenefit: true,
        isGalleryAuction: true,
      },
    }
    const { toJSON } = renderWithRelay({
      Artwork: () => PartnerCardArtworkAuction,
    })

    expect(toJSON()).toBeNull()
  })
})

const PartnerCardArtwork: PartnerCard_artwork$data = {
  sale: {
    isBenefit: false,
    isGalleryAuction: false,
  },
  partner: {
    isDefaultProfilePublic: true,
    type: "Gallery",
    name: "Test Gallery",
    slug: "12345",
    id: "12345",
    href: "12345",
    initials: "TG",
    profile: {
      id: "12345",
      internalID: "56789",
      icon: {
        url: "https://d32dm0rphc51dk.cloudfront.net/YciR5levjrhp2JnFYlPxpw/square140.webp",
      },
    },
    cities: ["Miami", "New York", "Hong Kong", "London", "Boston"],
  },
  " $fragmentType": "PartnerCard_artwork",
  " $fragmentSpreads": null as any,
}

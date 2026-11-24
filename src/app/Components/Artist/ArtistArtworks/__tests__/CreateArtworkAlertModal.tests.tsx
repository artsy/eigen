import { screen } from "@testing-library/react-native"
import { CreateArtworkAlertModal_artwork$data } from "__generated__/CreateArtworkAlertModal_artwork.graphql"
import {
  CreateArtworkAlertModal,
  computeArtworkAlertProps,
} from "app/Components/Artist/ArtistArtworks/CreateArtworkAlertModal"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("app/Scenes/SavedSearchAlert/CreateSavedSearchModal", () => {
  const { Text } = require("react-native")
  return {
    CreateSavedSearchModal: (props: { currentArtworkID?: string }) => (
      <Text testID="create-saved-search-modal">
        {`CreateSavedSearchModal:${props.currentArtworkID}`}
      </Text>
    ),
  }
})

describe("CreateArtworkAlertModal", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: CreateArtworkAlertModal,
    query: graphql`
      query CreateArtworkAlertModal_Test_Query {
        artwork(id: "foo") {
          ...CreateArtworkAlertModal_artwork
        }
      }
    `,
  })

  it("returns null if artwork is ineligible", async () => {
    await renderWithRelay({
      Artwork: () => ({
        isEligibleToCreateAlert: false,
      }),
    })

    expect(screen.queryByTestId("create-saved-search-modal")).not.toBeOnTheScreen()
  })

  it("returns renders modal", async () => {
    await renderWithRelay()
    expect(screen.getByTestId("create-saved-search-modal")).toBeOnTheScreen()
  })

  it("passes current artwork id to modal", async () => {
    await renderWithRelay({
      Artwork: () => ({
        internalID: "set-alert-from-me",
      }),
    })
    expect(screen.getByText("CreateSavedSearchModal:set-alert-from-me")).toBeOnTheScreen()
  })
})

describe("computeArtworkAlertProps", () => {
  const artwork = {
    artists: [{ name: "foo", internalID: "bar" }],
    isEligibleToCreateAlert: true,
    attributionClass: {
      internalID: "1",
    },
    title: "Test Artwork",
    internalID: "2",
    slug: "test-artwork",
    mediumType: {
      filterGene: {
        name: "Test Gene",
        slug: "test-gene",
      },
    },
  } as unknown as CreateArtworkAlertModal_artwork$data

  it("should return default props when artwork is ineligible for alert", () => {
    const result = computeArtworkAlertProps({ ...artwork, isEligibleToCreateAlert: false })

    expect(result).toEqual({
      entity: null,
      attributes: null,
      aggregations: null,
    })
  })

  it("should return correct props when artwork is eligible for alert", () => {
    const result = computeArtworkAlertProps(artwork)

    expect(result).toEqual({
      aggregations: [
        {
          slice: "MEDIUM",
          counts: [{ name: "Test Gene", value: "test-gene", count: 0 }],
        },
      ],
      attributes: {
        artistIDs: ["bar"],
        attributionClass: ["1"],
        additionalGeneIDs: ["test-gene"],
      },
      entity: {
        artists: [{ id: "bar", name: "foo" }],
        owner: { type: "artwork", id: "2", slug: "test-artwork" },
      },
    })
  })

  it("should omit a medium if filterGene isnt provided", () => {
    const result = computeArtworkAlertProps({ ...artwork, mediumType: { filterGene: null } })

    expect(result).toEqual({
      aggregations: [],
      attributes: {
        artistIDs: ["bar"],
        attributionClass: ["1"],
        additionalGeneIDs: [],
      },
      entity: {
        artists: [{ id: "bar", name: "foo" }],
        owner: { type: "artwork", id: "2", slug: "test-artwork" },
      },
    })
  })
})

import { FaqAndSpecialistSectionTestsQuery } from "__generated__/FaqAndSpecialistSectionTestsQuery.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { FaqAndSpecialistSectionFragmentContainer as FaqAndSpecialistSection } from "./FaqAndSpecialistSection"

describe("FAQ and specialist BNMO links", () => {
  const { renderWithRelay } = setupTestWrapper<FaqAndSpecialistSectionTestsQuery>({
    Component: (props) => {
      if (props?.artwork) {
        return <FaqAndSpecialistSection artwork={props.artwork} />
      }

      return null
    },
    query: graphql`
      query FaqAndSpecialistSectionTestsQuery @relay_test_operation {
        artwork(id: "artworkID") {
          ...FaqAndSpecialistSection_artwork
        }
      }
    `,
  })

  it("does not render FAQ or ask a specialist links when isInquireable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: false,
      isInquireable: true,
      isForSale: true,
      artists: [
        {
          name: "Santa",
          isConsignable: true,
        },
      ],
    }

    const { queryByText } = renderWithRelay({
      Artwork: () => artwork,
    })

    expect(queryByText("Read our FAQ")).toBeNull()
    expect(queryByText("ask a specialist")).toBeNull()
  })

  it("renders ask a specialist link when isAcquireable", () => {
    const artwork = {
      ...ArtworkFixture,
      isAcquireable: true,
      isForSale: true,
      isInquireable: true,
      artists: [
        {
          name: "Santa",
          isConsignable: true,
        },
      ],
    }

    const { queryByText } = renderWithRelay({
      Artwork: () => artwork,
    })

    expect(queryByText("Read our FAQ")).toBeTruthy()
    expect(queryByText("ask a specialist")).toBeTruthy()
  })

  it("renders ask a specialist link when isOfferable", () => {
    const artwork = {
      ...ArtworkFixture,
      isOfferable: true,
      isForSale: true,
      isInquireable: true,
      artists: [{ name: "Santa", isConsignable: true }],
    }

    const { queryByText } = renderWithRelay({
      Artwork: () => artwork,
    })

    expect(queryByText("Read our FAQ")).toBeTruthy()
    expect(queryByText("ask a specialist")).toBeTruthy()
  })
})

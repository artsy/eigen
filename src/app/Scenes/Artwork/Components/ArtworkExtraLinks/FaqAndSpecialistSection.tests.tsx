import { FaqAndSpecialistSectionTestsQuery } from "__generated__/FaqAndSpecialistSectionTestsQuery.graphql"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { FaqAndSpecialistSectionFragmentContainer as FaqAndSpecialistSection } from "./FaqAndSpecialistSection"

jest.unmock("react-relay")

describe("FAQ and specialist BNMO links", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<FaqAndSpecialistSectionTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query FaqAndSpecialistSectionTestsQuery @relay_test_operation {
          artwork(id: "artworkID") {
            ...FaqAndSpecialistSection_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <FaqAndSpecialistSection artwork={props.artwork} />
        }

        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
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

    const { queryByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
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

    const { queryByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
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

    const { queryByText } = renderWithWrappers(<TestRenderer />)

    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => artwork,
    })

    expect(queryByText("Read our FAQ")).toBeTruthy()
    expect(queryByText("ask a specialist")).toBeTruthy()
  })
})

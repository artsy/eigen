import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { CollapsibleArtworkDetailsTestsQuery } from "__generated__/CollapsibleArtworkDetailsTestsQuery.graphql"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"

describe("CollapsibleArtworkDetails", () => {
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("displays basic artwork details when collapsed", () => {
    renderWithWrappers(<TestRenderer />)

    resolveData({
      Artwork: () => ({
        title: "Artwork Title",
        date: "Artwork Date",
        artistNames: "Artist Names",
      }),
    })

    expect(screen.getByLabelText("Image of Artwork Title")).toBeVisible()
    expect(screen.getByText("Artist Names")).toBeVisible()
    expect(screen.getByText("Artwork Title, Artwork Date")).toBeVisible()
  })

  it("displays additonal artwork details when expanded", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveData({
      Artwork: () => ({
        title: "Artwork Title",
        date: "Artwork Date",
        artistNames: "Artist Names",
        saleMessage: "Artwork Sale Message",
        mediumType: {
          name: "Artwork Medium Type Name",
        },
        manufacturer: "Artwork Manufacturer",
        publisher: "Artwork Publisher",
        medium: "Artwork Medium",
        attributionClass: {
          name: "Artwork Attribution Class Name",
        },
        dimensions: {
          in: "Artwork Dimensions Inches",
          cm: "Artwork Dimensions Centimeters",
        },
        signatureInfo: {
          details: "Artwork Signature Info Details",
        },
        isFramed: true,
        certificateOfAuthenticity: {
          details: "Artwork Certificate Of Authenticity Details",
        },
        conditionDescription: {
          details: "Artwork Condition Description Details",
        },
      }),
    })

    fireEvent.press(screen.getByLabelText("Show artwork details"))

    await waitFor(() => {
      expect(screen.getByLabelText("Hide artwork details")).toBeVisible()
    })

    expect(screen.getByLabelText("Image of Artwork Title")).toBeVisible()
    expect(screen.getByText("Artist Names")).toBeVisible()
    expect(screen.getByText("Artwork Title, Artwork Date")).toBeVisible()
    expect(screen.getByText("Artwork Sale Message")).toBeVisible()
    expect(screen.getByText("Artwork Medium Type Name")).toBeVisible()
    expect(screen.getByText("Artwork Manufacturer")).toBeVisible()
    expect(screen.getByText("Artwork Publisher")).toBeVisible()
    expect(screen.getByText("Artwork Medium")).toBeVisible()
    expect(screen.getByText("Artwork Attribution Class Name")).toBeVisible()
    expect(
      screen.getByText("Artwork Dimensions Inches\nArtwork Dimensions Centimeters")
    ).toBeVisible()
    expect(screen.getByText("Artwork Signature Info Details")).toBeVisible()
    expect(screen.getByText("Included")).toBeVisible()
    expect(screen.getByText("Artwork Certificate Of Authenticity Details")).toBeVisible()
    expect(screen.getByText("Artwork Condition Description Details")).toBeVisible()
  })

  it("doesn't display missing artwork details when expanded", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveData({
      Artwork: () => ({
        saleMessage: "Artwork Sale Message",
        manufacturer: null,
        publisher: null,
        medium: "Artwork Medium",
      }),
    })

    fireEvent.press(screen.getByLabelText("Show artwork details"))

    await waitFor(() => {
      expect(screen.getByLabelText("Hide artwork details")).toBeVisible()
    })

    expect(screen.getByText("Price")).toBeVisible()
    expect(screen.queryByText("Manufacturer")).toBeNull()
    expect(screen.queryByText("Publisher")).toBeNull()
    expect(screen.getByText("Materials")).toBeVisible()
  })

  it("diplays 'not included' when the artwork is not framed", async () => {
    renderWithWrappers(<TestRenderer />)

    resolveData({
      Artwork: () => ({
        isFramed: false,
      }),
    })

    fireEvent.press(screen.getByLabelText("Show artwork details"))

    await waitFor(() => {
      expect(screen.getByLabelText("Hide artwork details")).toBeVisible()
    })

    expect(screen.getByText("Frame")).toBeVisible()
    expect(screen.getByText("Not included")).toBeVisible()
  })
})

let mockEnvironment: ReturnType<typeof createMockEnvironment>

const TestRenderer = () => (
  <QueryRenderer<CollapsibleArtworkDetailsTestsQuery>
    environment={mockEnvironment}
    query={graphql`
      query CollapsibleArtworkDetailsTestsQuery @relay_test_operation {
        artwork(id: "some-slug") {
          ...CollapsibleArtworkDetails_artwork
        }
      }
    `}
    variables={{}}
    render={({ props }) => {
      if (props?.artwork) {
        return <CollapsibleArtworkDetailsFragmentContainer artwork={props.artwork} />
      }
      return null
    }}
  />
)

const resolveData = (passedProps = {}) => {
  mockEnvironment.mock.resolveMostRecentOperation((operation) =>
    MockPayloadGenerator.generate(operation, passedProps)
  )
}

import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { ArtworkActions } from "./ArtworkActions"
import { ArtworkHeader, VisibilityLevels } from "./ArtworkHeader"
import { ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarousel } from "./ImageCarousel/ImageCarousel"
import { UnlistedArtworksBanner } from "./UnlistedArtworksBanner"

jest.mock("react-native-view-shot", () => ({}))

const TestRenderer: React.FC = () => {
  return <ArtworkHeader artwork={ArtworkFixture} />
}

describe("ArtworkHeader", () => {
  it("renders tombstone component", () => {
    const { container } = renderWithWrappers(<TestRenderer />)
    expect(container.findAllByType(ArtworkTombstone).length).toEqual(1)
  })

  it("renders artwork actions component", () => {
    const { container } = renderWithWrappers(<TestRenderer />)
    expect(container.findAllByType(ArtworkActions).length).toEqual(1)
  })

  it("renders image carousel component", () => {
    const { container } = renderWithWrappers(<TestRenderer />)
    expect(container.findAllByType(ImageCarousel).length).toEqual(1)
  })

  describe("when artwork is unlisted", () => {
    it("renders private listing banner component", () => {
      const artwork = {
        ...ArtworkFixture,
        visibilityLevel: VisibilityLevels.UNLISTED,
      }
      const { container } = renderWithWrappers(<ArtworkHeader artwork={artwork} />)
      expect(container.findAllByType(UnlistedArtworksBanner).length).toEqual(1)
    })

    describe("when artwork is listed", () => {
      it("does not render private listing banner component", () => {
        const artwork = {
          ...ArtworkFixture,
          visibilityLevel: VisibilityLevels.LISTED,
        }
        const { container } = renderWithWrappers(<ArtworkHeader artwork={artwork} />)
        expect(container.findAllByType(UnlistedArtworksBanner)).toHaveLength(0)
      })
    })

    describe("when artwork visibility is null", () => {
      it("does not render private listing banner component", () => {
        const artwork = {
          ...ArtworkFixture,
          visibilityLevel: null,
        }
        const { container } = renderWithWrappers(<ArtworkHeader artwork={artwork} />)
        expect(container.findAllByType(UnlistedArtworksBanner)).toHaveLength(0)
      })
    })
  })
})

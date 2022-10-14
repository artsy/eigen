import { screen } from "@testing-library/react-native"
import { ArtworkFixture } from "app/__fixtures__/ArtworkFixture"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { ArtworkHeader } from "./ArtworkHeader"
import { ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarousel } from "./ImageCarousel/ImageCarousel"

jest.mock("react-native-view-shot", () => ({}))

const TestRenderer: React.FC = () => {
  return <ArtworkHeader artwork={ArtworkFixture} />
}

describe("ArtworkHeader", () => {
  it("renders correctly", () => {
    renderWithRelayWrappers(<TestRenderer />)

    // tombstone
    expect(screen.UNSAFE_queryAllByType(ArtworkTombstone)).toHaveLength(1)

    // actions component
    expect(screen.UNSAFE_queryAllByType(ArtworkTombstone)).toHaveLength(1)

    // image carousel component
    expect(screen.UNSAFE_queryAllByType(ImageCarousel)).toHaveLength(1)
  })
})

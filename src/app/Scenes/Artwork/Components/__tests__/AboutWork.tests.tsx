import { AboutWork_artwork$data } from "__generated__/AboutWork_artwork.graphql"
import { AboutWork } from "app/Scenes/Artwork/Components/AboutWork"
import { truncatedTextLimit } from "app/utils/hardware"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("app/utils/hardware", () => ({
  truncatedTextLimit: jest.fn(),
}))

describe("AboutWork", () => {
  beforeEach(() => {
    ;(truncatedTextLimit as jest.Mock).mockReset()
  })

  it("renders the AboutWork correctly if all info is present", () => {
    const { queryByText } = renderWithWrappers(<AboutWork artwork={aboutWorkArtwork} />)
    expect(queryByText("About the work")).toBeTruthy()
    expect(queryByText("From Artsy Specialist:")).toBeTruthy()
  })

  it("renders the AboutWork correctly if only additional information is present", () => {
    const artworkNoDescription = { ...aboutWorkArtwork, description: null }

    const { queryByText } = renderWithWrappers(<AboutWork artwork={artworkNoDescription} />)
    expect(queryByText("About the work")).toBeTruthy()
    expect(queryByText("From Artsy Specialist:")).toBeFalsy()
  })

  it("renders the AboutWork correctly if only description is present", () => {
    const artworkNoAdditionalInfo = { ...aboutWorkArtwork, additionalInformation: null }

    const { queryByText } = renderWithWrappers(<AboutWork artwork={artworkNoAdditionalInfo} />)
    expect(queryByText("About the work")).toBeTruthy()
    expect(queryByText("From Artsy Specialist:")).toBeTruthy()
  })

  it("renders nothing if no information is present", () => {
    const artworkNoInfo = { ...aboutWorkArtwork, additionalInformation: null, description: null }

    const { queryByText } = renderWithWrappers(<AboutWork artwork={artworkNoInfo} />)
    expect(queryByText("About the work")).toBeFalsy()
    expect(queryByText("From Artsy Specialist:")).toBeFalsy()
  })

  it("hides 'From Artsy Specialist:' for auction works", () => {
    const artworkInAuction = { ...aboutWorkArtwork, isInAuction: true }

    const { queryByText } = renderWithWrappers(<AboutWork artwork={artworkInAuction} />)
    expect(queryByText("From Artsy Specialist:")).toBeFalsy()
  })
})

const aboutWorkArtwork: AboutWork_artwork$data = {
  additionalInformation:
    "This is some information about the artwork by the gallery. It has to be at least 320 characters in order to test that the read more component truncates possibly. So here is soem lorem ipsum: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  description: "This is some information about the artwork by Artsy.",
  isInAuction: false,
  " $fragmentType": "AboutWork_artwork",
}

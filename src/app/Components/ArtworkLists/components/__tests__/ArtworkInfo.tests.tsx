import { ArtworkInfo } from "app/Components/ArtworkLists/components/ArtworkInfo"
import { ArtworkEntity } from "app/Components/ArtworkLists/types"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"

describe("ArtworkInfo", () => {
  it("should render artist names, artwork title and year", () => {
    const { getByText } = renderWithHookWrappersTL(<ArtworkInfo artwork={artworkEntity} />)

    expect(getByText(/Banksy/)).toBeTruthy()
    expect(getByText(/Artwork Title/)).toBeTruthy()
    expect(getByText(/2023/)).toBeTruthy()
  })

  it("should render artist names and artwork title", () => {
    const { queryByText } = renderWithHookWrappersTL(
      <ArtworkInfo artwork={{ ...artworkEntity, year: null }} />
    )

    // Not displayed
    expect(queryByText(/2023/)).toBeFalsy()

    expect(queryByText(/Banksy/)).toBeTruthy()
    expect(queryByText(/Artwork Title/)).toBeTruthy()
  })

  it("should render artwork title and year", () => {
    const { queryByText } = renderWithHookWrappersTL(
      <ArtworkInfo artwork={{ ...artworkEntity, artistNames: null }} />
    )

    // Not displayed
    expect(queryByText(/Banksy/)).toBeFalsy()

    expect(queryByText(/Artwork Title/)).toBeTruthy()
    expect(queryByText(/2023/)).toBeTruthy()
  })

  it("should render artwork title and year", () => {
    const { queryByText } = renderWithHookWrappersTL(
      <ArtworkInfo artwork={{ ...artworkEntity, artistNames: null }} />
    )

    // Not displayed
    expect(queryByText(/Banksy/)).toBeFalsy()

    expect(queryByText(/Artwork Title/)).toBeTruthy()
    expect(queryByText(/2023/)).toBeTruthy()
  })

  it("should render only artwork title", () => {
    const { queryByText } = renderWithHookWrappersTL(
      <ArtworkInfo artwork={{ ...artworkEntity, artistNames: null, year: null }} />
    )

    // Not displayed
    expect(queryByText(/Banksy/)).toBeFalsy()
    expect(queryByText(/2023/)).toBeFalsy()

    expect(queryByText(/Artwork Title/)).toBeTruthy()
  })
})

const artworkEntity: ArtworkEntity = {
  artistNames: "Banksy",
  id: "artwork-id",
  imageURL: null,
  internalID: "artwork-internal-id",
  isInAuction: false,
  title: "Artwork Title",
  year: "2023",
}

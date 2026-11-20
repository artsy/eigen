import { screen } from "@testing-library/react-native"
import { ArtworkInfo } from "app/Components/ArtworkLists/components/ArtworkInfo"
import { ArtworkEntity } from "app/Components/ArtworkLists/types"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"

describe("ArtworkInfo", () => {
  it("should render artist names, artwork title and year", async () => {
    await renderWithHookWrappersTL(<ArtworkInfo artwork={artworkEntity} />)

    expect(screen.getByText(/Banksy/)).toBeTruthy()
    expect(screen.getByText(/Artwork Title/)).toBeTruthy()
    expect(screen.getByText(/2023/)).toBeTruthy()
  })

  it("should render artist names and artwork title", async () => {
    await renderWithHookWrappersTL(<ArtworkInfo artwork={{ ...artworkEntity, year: null }} />)

    // Not displayed
    expect(screen.queryByText(/2023/)).toBeFalsy()

    expect(screen.getByText(/Banksy/)).toBeTruthy()
    expect(screen.getByText(/Artwork Title/)).toBeTruthy()
  })

  it("should render artwork title and year", async () => {
    await renderWithHookWrappersTL(
      <ArtworkInfo artwork={{ ...artworkEntity, artistNames: null }} />
    )

    // Not displayed
    expect(screen.queryByText(/Banksy/)).toBeFalsy()

    expect(screen.getByText(/Artwork Title/)).toBeTruthy()
    expect(screen.getByText(/2023/)).toBeTruthy()
  })

  it("should render artwork title and year", async () => {
    await renderWithHookWrappersTL(
      <ArtworkInfo artwork={{ ...artworkEntity, artistNames: null }} />
    )

    // Not displayed
    expect(screen.queryByText(/Banksy/)).toBeFalsy()

    expect(screen.getByText(/Artwork Title/)).toBeTruthy()
    expect(screen.getByText(/2023/)).toBeTruthy()
  })

  it("should render only artwork title", async () => {
    await renderWithHookWrappersTL(
      <ArtworkInfo artwork={{ ...artworkEntity, artistNames: null, year: null }} />
    )

    // Not displayed
    expect(screen.queryByText(/Banksy/)).toBeFalsy()
    expect(screen.queryByText(/2023/)).toBeFalsy()

    expect(screen.getByText(/Artwork Title/)).toBeTruthy()
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

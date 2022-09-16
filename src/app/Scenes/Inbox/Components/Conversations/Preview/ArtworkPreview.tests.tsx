import { fireEvent, screen } from "@testing-library/react-native"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { Touchable } from "palette"
import ArtworkPreview from "./ArtworkPreview"

describe("concerning selection handling", () => {
  const onSelected = jest.fn()
  afterEach(() => {
    onSelected.mockReset()
  })

  it("passes a onPress handler to the touchable component if an onSelected handler is given", () => {
    renderWithRelayWrappers(<ArtworkPreview artwork={artwork as any} onSelected={onSelected} />)

    expect(screen.queryByText("Karl and Anna Face Off (Diptych) / 2016")).toBeTruthy()
    expect(screen.UNSAFE_getByType(Touchable)).toBeTruthy()
    fireEvent.press(screen.UNSAFE_getByType(Touchable))

    expect(onSelected).toHaveBeenCalledTimes(1)
  })

  it("does not pass a onPress handler to the touchable component if no onSelected handler is given", () => {
    renderWithRelayWrappers(<ArtworkPreview artwork={artwork as any} />)

    fireEvent.press(screen.UNSAFE_getByType(Touchable))

    expect(onSelected).not.toHaveBeenCalled()
  })
})

const artwork = {
  id: "bradley-theodore-karl-and-anna-face-off-diptych",
  internalID: "mongoID",
  href: "/artwork/bradley-theodore-karl-and-anna-face-off-diptych",
  title: "Karl and Anna Face Off (Diptych)",
  date: "2016",
  artist_names: "Bradley Theodore",
  image: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
  },
}

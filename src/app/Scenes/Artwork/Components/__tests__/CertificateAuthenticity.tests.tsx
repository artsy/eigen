import { fireEvent, screen } from "@testing-library/react-native"
import { CertificateOfAuthenticity } from "app/Scenes/Artwork/Components/CertificateAuthenticity"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("CertificateAuthenticity", () => {
  it("renders", async () => {
    await renderWithWrappers(<CertificateOfAuthenticity />)

    expect(screen.getByText("A certificate of authenticity (COA)", { exact: false })).toBeDefined()
    expect(
      screen.getByText("COAs typically include the name of the artist,", { exact: false })
    ).toBeDefined()
    expect(
      screen.getByText("Read more about artwork authenticity in our", { exact: false })
    ).toBeDefined()
    expect(screen.getByText("Help Center")).toBeDefined()
  })

  it("navigates to support page", async () => {
    await renderWithWrappers(<CertificateOfAuthenticity />)

    await fireEvent.press(screen.getByText("Help Center"))
    expect(navigate).toHaveBeenCalledWith(
      "https://support.artsy.net/s/article/What-Counts-as-an-Artworks-Proof-of-Authenticity"
    )
  })
})

import { fireEvent } from "@testing-library/react-native"
import { navigate } from "app/navigation/navigate"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { Banner } from "./Banner"

describe("MyCollectionInsights banner", () => {
  const TestRenderer = () => <Banner />

  beforeEach(() => {
    jest.resetModules()
  })

  it("renders", () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)

    expect(getByText("Activate More Market Insights")).toBeTruthy()
  })

  it("navigates to MyCollectionArtworkForm when Upload Another Artwork is pressed", () => {
    const { getAllByText } = renderWithWrappersTL(<TestRenderer />)

    fireEvent.press(getAllByText("Update Another Artwork")[0])

    expect(navigate).toHaveBeenCalledWith(
      "my-collection/artworks/new",
      expect.objectContaining({ passProps: { mode: "add", onSuccess: expect.anything() } })
    )
  })
})

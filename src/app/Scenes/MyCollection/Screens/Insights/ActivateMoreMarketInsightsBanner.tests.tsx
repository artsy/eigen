import { fireEvent } from "@testing-library/react-native"
import { navigate } from "app/navigation/navigate"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { ActivateMoreMarketInsightsBanner } from "./ActivateMoreMarketInsightsBanner"

describe("MyCollectionInsights banner", () => {
  const TestRenderer = () => {
    return <ActivateMoreMarketInsightsBanner />
  }

  it("renders", async () => {
    const { findByText } = renderWithWrappersTL(<TestRenderer />)

    expect(await findByText("Activate More Market Insights")).toBeTruthy()
  })

  it("navigates to MyCollectionArtworkForm when Upload Another Artwork is pressed", () => {
    const { getAllByText } = renderWithWrappersTL(<TestRenderer />)

    fireEvent.press(getAllByText("Upload Another Artwork")[0])

    expect(navigate).toHaveBeenCalledWith(
      "my-collection/artworks/new",
      expect.objectContaining({ passProps: { mode: "add", onSuccess: expect.anything() } })
    )
  })
})

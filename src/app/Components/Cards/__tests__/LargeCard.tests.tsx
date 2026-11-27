import { screen } from "@testing-library/react-native"
import { LargeCard } from "app/Components/Cards/LargeCard"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("LargeCard", () => {
  it("keeps the title and subtitle white, since they sit on the image", async () => {
    await renderWithWrappers(
      <LargeCard
        image="https://example.com/image.jpg"
        title="Jeff Koons: Porcelain Series"
        subtitle="Pinto Gallery"
      />
    )

    expect(screen.getByText("Jeff Koons: Porcelain Series")).toHaveStyle({ color: "white" })
    expect(screen.getByText("Pinto Gallery")).toHaveStyle({ color: "white" })
  })
})

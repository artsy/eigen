import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"
import About from "./About"

it("renders without throwing a error", () => {
  const tag = {
    description: `Handmade Paper is very nice`,
  }

  renderWithWrappersLEGACY(
    <StickyTabPage
      tabs={[
        {
          title: "test",
          content: <About tag={tag as any} />,
        },
      ]}
    />
  )
})

import "react-native"

import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { StickyTabPage } from "../StickyTabPage/StickyTabPage"
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

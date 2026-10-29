import { screen } from "@testing-library/react-native"
import { FeatureMarkdown } from "app/Scenes/Feature/components/FeatureMarkdown"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"

describe(FeatureMarkdown, () => {
  describe("when AREnableEnrichedMarkdown is disabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableEnrichedMarkdown: false })
    })

    it("renders markdown", () => {
      const view = renderWithWrappersLEGACY(
        <FeatureMarkdown content="this is _some_ **markdown**" />
      )
      expect(extractText(view.root)).toContain("this is some markdown")
    })
  })

  describe("when AREnableEnrichedMarkdown is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableEnrichedMarkdown: true })
    })

    it("renders the content with the native markdown renderer", () => {
      renderWithWrappers(<FeatureMarkdown content="this is _some_ **markdown**" />)

      expect(screen.getByText("this is _some_ **markdown**")).toBeOnTheScreen()
    })
  })
})

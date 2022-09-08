import { OwnerType } from "@artsy/cohesion"
import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import {
  SearchImageHeaderButton,
  SearchImageHeaderButtonOwner,
  SearchImageHeaderButtonProps,
} from "./SearchImageHeaderButton"

describe("SearchImageHeaderButton", () => {
  const TestRenderer = (props: Partial<SearchImageHeaderButtonProps>) => (
    <SearchImageHeaderButton {...defaultProps} {...props} />
  )

  describe("with AREnableImageSearch feature flag disabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImageSearch: false })
    })

    it("should not be rendered", () => {
      const { queryByLabelText } = renderWithWrappers(<TestRenderer />)
      expect(queryByLabelText("Search by image")).toBeNull()
    })
  })

  describe("with AREnableImageSearch feature flag enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableImageSearch: true })
    })

    it("should not be rendered when isImageSearchButtonVisible is false", () => {
      const { queryByLabelText } = renderWithWrappers(
        <TestRenderer isImageSearchButtonVisible={false} />
      )

      expect(queryByLabelText("Search by image")).toBeNull()
    })

    it("should correctly track analytics when button is tapped", () => {
      const { getByLabelText } = renderWithWrappers(<TestRenderer />)

      fireEvent.press(getByLabelText("Search by image"))

      expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "tappedReverseImageSearch",
            "context_screen_owner_type": "reverseImageSearch",
            "owner_id": "owner-id",
            "owner_slug": "owner-slug",
            "owner_type": "fair",
          },
        ]
      `)
    })
  })
})

const defaultOwner: SearchImageHeaderButtonOwner = {
  type: OwnerType.fair,
  id: "owner-id",
  slug: "owner-slug",
}

const defaultProps: SearchImageHeaderButtonProps = {
  isImageSearchButtonVisible: true,
  owner: defaultOwner,
}

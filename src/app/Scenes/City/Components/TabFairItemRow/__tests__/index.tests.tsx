import { TabFairItemRow } from "app/Scenes/City/Components/TabFairItemRow/index"
import { Fair } from "app/Scenes/Map/types"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

// @TODO: We are already stubbing Fair data for tests in src/app/Scenes/Fair/__fixtures__/index.ts; can we modularize this test by importing that fixture?
// @TODO: Can we expand on this test by mocking the navigation function https://artsyproduct.atlassian.net/browse/LD-549

const fairData = {
  counts: {
    partners: 3,
  },
  id: "RmFpcjp0ZWZhZi1uZXcteW9yay1zcHJpbmctMjAxOQ==",
  gravityID: "tefaf-new-york-spring-2019",
  image: {
    aspect_ratio: 1,
    url: "https://d32dm0rphc51dk.cloudfront.net/uSlVwLet3RIOno8LxJGn2g/wide.jpg",
  },
  end_at: "2019-05-07T12:00:00+00:00",
  start_at: "2019-05-03T12:00:00+00:00",
  name: "TEFAF New York Spring 2019",
} as any as Fair

describe("TabFairItemRow", () => {
  it("renders Fair properly", () => {
    const { queryByText } = renderWithWrappers(<TabFairItemRow item={fairData} />)

    expect(queryByText("TEFAF New York Spring 2019")).toBeTruthy()
  })
})

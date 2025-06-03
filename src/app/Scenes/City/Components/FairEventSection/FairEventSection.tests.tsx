import { FairEventSection } from "app/Scenes/City/Components/FairEventSection/index"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
<<<<<<<< HEAD:src/app/Scenes/City/Components/FairEventSection/__tests__/index.tests.tsx
========
import { FairEventSection } from "./FairEventSection"
>>>>>>>> fcccc5ef80 (chore: address review comments):src/app/Scenes/City/Components/FairEventSection/FairEventSection.tests.tsx

const data = [
  {
    name: "TEFAF New York Fall 2019",
    id: "RmFpcjp0ZWZhZi1uZXcteW9yay1mYWxsLTIwMTk=",
    gravityID: "tefaf-new-york-fall-2019",
    image: {
      aspect_ratio: 1,
      url: "https://d32dm0rphc51dk.cloudfront.net/3cn9Ln3DfEnHxJcjvfBNKA/wide.jpg",
    },
    end_at: "2001-12-15T12:00:00+00:00",
    start_at: "2001-11-12T12:00:00+00:00",
  },
] as any[]

describe("FairEventSection", () => {
  it("renders properly", () => {
    const { queryByText } = renderWithWrappers(
      <FairEventSection data={data} citySlug="tefaf-new-york-fall-2019" />
    )

    expect(queryByText("TEFAF New York Fall 2019")).toBeTruthy()
  })
})

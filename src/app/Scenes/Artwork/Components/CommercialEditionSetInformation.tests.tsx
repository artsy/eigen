import { fireEvent } from "@testing-library/react-native"
import { CommercialEditionSetInformation_artwork$data } from "__generated__/CommercialEditionSetInformation_artwork.graphql"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"
import { CommercialEditionSetInformation } from "./CommercialEditionSetInformation"

const artwork: CommercialEditionSetInformation_artwork$data = {
  " $fragmentType": "CommercialEditionSetInformation_artwork",
  " $fragmentSpreads": null as any,
  editionSets: [
    {
      id: "RWRpdGlvblNldDo1YmJiOTc3N2NlMmZjMzAwMmMxNzkwMTM=",
      internalID: "5bbb9777ce2fc3002c179013",
      saleMessage: "$1",
      editionOf: "",
      dimensions: {
        in: "2 × 2 in",
        cm: "5.1 × 5.1 cm",
      },
    },
    {
      id: "RWRpdGlvblNldDo1YmMwZWMwMDdlNjQzMDBhMzliMjNkYTQ=",
      internalID: "5bc0ec007e64300a39b23da4",
      saleMessage: "$2",
      editionOf: "",
      dimensions: {
        in: "1 × 1 in",
        cm: "2.5 × 2.5 cm",
      },
    },
  ],
}

describe("CommercialEditionSetInformation", () => {
  it("changes displays first edition price", () => {
    const { queryByText } = renderWithRelayWrappers(
      <CommercialEditionSetInformation setEditionSetId={() => null} artwork={artwork} />
    )

    expect(queryByText("$1")).toBeTruthy()
  })

  it("changes display price to selected edition set", () => {
    const { getByText, queryByText } = renderWithRelayWrappers(
      <CommercialEditionSetInformation setEditionSetId={() => null} artwork={artwork} />
    )

    expect(queryByText("$1")).toBeTruthy()
    expect(queryByText("$2")).toBeNull()

    fireEvent.press(getByText("1 × 1 in"))

    expect(queryByText("$1")).toBeNull()
    expect(queryByText("$2")).toBeTruthy()
  })
})

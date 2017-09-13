import { ConsignmentSetup } from "../../index"
import { consignmentSetupToMutationInput } from "../consignmentSetupToSubmission"

describe("consignment metadata -> submission", () => {
  it("works with an empty object, and always has a mutation ID", () => {
    const setup: ConsignmentSetup = {}
    const result = `{ clientMutationId: "ID" }`
    expect(consignmentSetupToMutationInput(setup)).toEqual(result)
  })

  it("Handles a subset of the setup", () => {
    const setup: ConsignmentSetup = {
      artist: {
        id: "danger",
        name: "Danger McShane",
      },
      metadata: {
        title: "My Work",
        year: "1983",
        category: "DESIGN_DECORATIVE_ART",
        medium: "Wood",
        width: "100",
        height: "100",
        depth: null,
        unit: "CM",
        displayString: "5/5",
      },
    }
    const result =
      '{ clientMutationId: "ID", artist_id: "danger", category: DESIGN_DECORATIVE_ART, dimensions_metric: CM, height: "100", medium: "Wood", title: "My Work", width: "100", year: "1983" }'
    expect(consignmentSetupToMutationInput(setup)).toEqual(result)
  })
})

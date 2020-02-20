import { ConsignmentSetup } from "../../index"
import { consignmentSetupToMutationInput } from "../consignmentSetupToSubmission"

describe("consignment metadata -> submission", () => {
  it("works with an empty object, and always has a mutation ID", () => {
    const setup: ConsignmentSetup = {}
    const result = { clientMutationId: "ID", edition: false, artistID: "" }
    expect(consignmentSetupToMutationInput(setup)).toEqual(result)
  })

  it("Handles a subset of the setup", () => {
    const setup: ConsignmentSetup = {
      artist: {
        internalID: "danger",
        name: "Danger McShane",
      },
      metadata: {
        title: "My Work",
        year: "1983",
        category: "DESIGN_DECORATIVE_ART",
        categoryName: "Design",
        medium: "Wood",
        width: "100",
        height: "100",
        depth: null,
        unit: "CM",
        displayString: "5/5",
      },
      editionScreenViewed: true,
    }
    expect(consignmentSetupToMutationInput(setup)).toMatchInlineSnapshot(`
      Object {
        "artistID": "danger",
        "category": "DESIGN_DECORATIVE_ART",
        "clientMutationId": "ID",
        "dimensionsMetric": "CM",
        "edition": false,
        "height": "100",
        "medium": "Wood",
        "title": "My Work",
        "width": "100",
        "year": "1983",
      }
    `)
  })

  it("handles a missing edition size", () => {
    const setup: ConsignmentSetup = {
      artist: {
        internalID: "danger",
        name: "Danger McShane",
      },
      editionInfo: {
        size: undefined, // This is important, parseInt(undefined) returns NaN
        number: "1",
      },
      metadata: {
        title: "My Work",
        year: "1983",
        category: "DESIGN_DECORATIVE_ART",
        categoryName: "Design",
        medium: "Wood",
        width: "100",
        height: "100",
        depth: null,
        unit: "CM",
        displayString: "5/5",
      },
      editionScreenViewed: true,
    }
    const result = consignmentSetupToMutationInput(setup)
    expect(result.editionSize).not.toBeNaN()
  })
})

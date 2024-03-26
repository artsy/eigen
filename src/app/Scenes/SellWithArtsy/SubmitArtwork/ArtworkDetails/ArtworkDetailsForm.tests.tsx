import { fireEvent, screen } from "@testing-library/react-native"
import { artworkRarityClassifications } from "app/utils/artworkRarityClassifications"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useFormikContext } from "formik"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"
import { mockFormValues } from "./utils/testUtils"

jest.mock("formik")

const useFormikContextMock = useFormikContext as jest.Mock

describe("ArtworkDetailsForm", () => {
  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      handleChange: jest.fn(),
      setFieldValue: jest.fn(),
      errors: {},
      values: mockFormValues,
    }))
  })

  it("correctly displays formik values in form", async () => {
    renderWithWrappers(<ArtworkDetailsForm />)

    expect(screen.getByLabelText(/Title/i)).toHaveProp("value", mockFormValues.title)
    expect(screen.getByLabelText(/Artist/i)).toHaveProp("value", mockFormValues.artist)
    expect(screen.getByLabelText(/Year/i)).toHaveProp("value", mockFormValues.year)
    expect(screen.getByLabelText(/Materials/i)).toHaveProp("value", mockFormValues.medium)
    expect(screen.getByTestId("autocomplete-location-input")).toHaveProp(
      "value",
      "London, England, UK"
    )
    expect(screen.getByTestId("Submission_ProvenanceInput")).toHaveProp(
      "value",
      mockFormValues.provenance
    )
  })

  it("when rarity is limited edition, renders additional inputs for edition number and size", () => {
    renderWithWrappers(<ArtworkDetailsForm />)

    const inputs = {
      editionNumber: screen.getByTestId("Submission_EditionNumberInput"),
      editionSize: screen.getByTestId("Submission_EditionSizeInput"),
    }

    expect(inputs.editionNumber).toBeOnTheScreen()
    expect(inputs.editionSize).toBeOnTheScreen()
  })

  it("opens up rarity modal, when rarity select tooltip pressed", async () => {
    renderWithWrappers(<ArtworkDetailsForm />)

    const raritySelectTooltip = screen.getAllByText("What's this?")[0]
    expect(raritySelectTooltip).toBeOnTheScreen()

    fireEvent.press(raritySelectTooltip)

    await flushPromiseQueue()

    artworkRarityClassifications.map((classification) => {
      expect(screen.getByText(classification.description)).toBeOnTheScreen()
    })
  })

  it("opens up provenance modal, when provenance tooltip pressed", async () => {
    renderWithWrappers(<ArtworkDetailsForm />)

    const provenanceTooltip = screen.getAllByText("What's this?")[1]
    expect(provenanceTooltip).toBeOnTheScreen()

    fireEvent.press(provenanceTooltip)

    await flushPromiseQueue()

    expect(screen.getByText("Invoices from previous owners")).toBeOnTheScreen()
    expect(screen.getByText("Certificates of authenticity")).toBeOnTheScreen()
    expect(screen.getByText("Gallery exhibition catalogues")).toBeOnTheScreen()
  })
})

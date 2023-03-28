import { fireEvent } from "@testing-library/react-native"
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

  it("correctly displays formik values in form", () => {
    const { findByText } = renderWithWrappers(<ArtworkDetailsForm />)
    expect(findByText("hello")).toBeTruthy()
    expect(findByText("Caspar David Friedrich")).toBeTruthy()
    expect(findByText("oil on canvas")).toBeTruthy()
    expect(findByText("found")).toBeTruthy()
    expect(findByText("London")).toBeTruthy()
    expect(findByText("71202")).toBeTruthy()
  })

  it("when rarity is limited edition, renders additional inputs for edition number and size", () => {
    const { getByTestId } = renderWithWrappers(<ArtworkDetailsForm />)

    const inputs = {
      editionNumber: getByTestId("Submission_EditionNumberInput"),
      editionSize: getByTestId("Submission_EditionSizeInput"),
    }

    expect(inputs.editionNumber).toBeTruthy()
    expect(inputs.editionSize).toBeTruthy()
  })

  it("opens up rarity modal, when rarity select tooltip pressed", async () => {
    const { getAllByText } = renderWithWrappers(<ArtworkDetailsForm />)

    const raritySelectTooltip = getAllByText("What is this?")[0]
    expect(raritySelectTooltip).toBeTruthy()

    fireEvent.press(raritySelectTooltip)

    await flushPromiseQueue()

    artworkRarityClassifications.map((classification) => {
      expect(getAllByText(classification.label)).toBeTruthy()
      expect(getAllByText(classification.description)).toBeTruthy()
    })
  })

  it("opens up provenance modal, when provenance tooltip pressed", async () => {
    const { getByText, getAllByText } = renderWithWrappers(<ArtworkDetailsForm />)

    const provenanceTooltip = getAllByText("What is this?")[1]
    expect(provenanceTooltip).toBeTruthy()

    fireEvent.press(provenanceTooltip)

    await flushPromiseQueue()

    expect(getByText("Invoices from previous owners")).toBeTruthy()
    expect(getByText("Certificates of authenticity")).toBeTruthy()
    expect(getByText("Gallery exhibition catalogues")).toBeTruthy()
  })
})

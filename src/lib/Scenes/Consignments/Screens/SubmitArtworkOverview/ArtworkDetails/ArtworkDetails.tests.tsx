import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { RelayEnvironmentProvider } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { createConsignSubmission, updateConsignSubmission } from "../Mutations"
import { ArtworkDetails } from "./ArtworkDetails"
import { createOrUpdateSubmission } from "./utils/createOrUpdateSubmission"
import { mockFormValues } from "./utils/testUtils"

jest.mock(
  "lib/Scenes/Consignments/Screens/SubmitArtworkOverview/Mutations/createConsignSubmissionMutation",
  () => ({
    createConsignSubmission: jest.fn().mockResolvedValue("12345"),
  })
)

jest.mock(
  "lib/Scenes/Consignments/Screens/SubmitArtworkOverview/Mutations/updateConsignSubmissionMutation",
  () => ({
    updateConsignSubmission: jest.fn().mockResolvedValue("54321"),
  })
)

jest.unmock("react-relay")

const createConsignSubmissionMock = createConsignSubmission as jest.Mock
const updateConsignSubmissionMock = updateConsignSubmission as jest.Mock
const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>

describe("ArtworkDetails", () => {
  const TestRenderer = () => (
    <RelayEnvironmentProvider environment={mockEnvironment}>
      <ArtworkDetails handlePress={jest.fn()} />
    </RelayEnvironmentProvider>
  )

  beforeEach(() => {
    ;(createConsignSubmissionMock as jest.Mock).mockClear()
    ;(updateConsignSubmissionMock as jest.Mock).mockClear()
  })

  afterEach(() => jest.clearAllMocks())

  describe("ArtworkDetails", () => {
    it("renders correct explanation for form fields", () => {
      const { getByText } = renderWithWrappersTL(<TestRenderer />)
      expect(getByText("All fields are required to submit an artwork.")).toBeTruthy()
    })

    it("creates new submission", async () => {
      await createOrUpdateSubmission(mockFormValues, "")
      expect(createConsignSubmissionMock).toHaveBeenCalled()
    })

    it("updates existing submission when ID passed", async () => {
      await createOrUpdateSubmission(mockFormValues, "12345")
      expect(updateConsignSubmissionMock).toHaveBeenCalled()
    })
  })
})

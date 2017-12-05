jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { metaphysics } from "../../../../metaphysics"
const mockphysics = metaphysics as jest.Mock<any>

jest.mock("../geminiUploadToS3", () => ({
  createGeminiAssetWithS3Credentials: jest.fn(),
  getGeminiCredentialsForEnvironment: jest.fn(),
  uploadFileToS3: jest.fn(),
}))

import {
  createGeminiAssetWithS3Credentials,
  GeminiCredsResponse,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "../geminiUploadToS3"

import { addAssetToConsignment, uploadImageAndPassToGemini } from "../uploadPhotoToGemini"

beforeEach(jest.resetAllMocks)

it("addAssetToConsignment makes a graphQL request to metaphysics", async () => {
  mockphysics.mockImplementationOnce(() => Promise.resolve())

  const response = await addAssetToConsignment({
    asset_type: "asset",
    gemini_token: "g-token",
    submission_id: "123",
  })
  const query = mockphysics.mock.calls[0][0].query

  expect(query).toContain("123")
  expect(query).toContain("g-token")
})

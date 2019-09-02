jest.mock("../../../../metaphysics", () => ({ metaphysics: jest.fn() }))
import { metaphysics } from "../../../../metaphysics"
const mockphysics = metaphysics as jest.Mock<any>

import { createGeminiAssetWithS3Credentials } from "../geminiUploadToS3"

beforeEach(mockphysics.mockReset)

it("createGeminiAssetWithS3Credentials makes a graphQL request to metaphysics", async () => {
  mockphysics.mockImplementationOnce(() => Promise.resolve())

  await createGeminiAssetWithS3Credentials({
    source_key: "source",
    template_key: "template",
    source_bucket: "bucket",
    metadata: { a: "submission_metadata" },
  })
  const query = mockphysics.mock.calls[0][0].query

  expect(query).toContain("submission_metadata")
  expect(query).toContain("source")
})

import {
  getConvectionGeminiKey,
  getGeminiCredentialsForEnvironment,
  uploadFileToS3,
} from "app/Components/PhotoRow/utils/uploadFileToS3"
import { uploadImageToS3 } from "app/utils/uploadImageToS3"

jest.mock("app/Components/PhotoRow/utils/uploadFileToS3", () => ({
  getConvectionGeminiKey: jest.fn(),
  getGeminiCredentialsForEnvironment: jest.fn(),
  uploadFileToS3: jest.fn(),
}))

const getConvectionGeminiKeyMock = getConvectionGeminiKey as jest.Mock
const getGeminiCredentialsForEnvironmentMock = getGeminiCredentialsForEnvironment as jest.Mock
const uploadFileToS3Mock = uploadFileToS3 as jest.Mock

describe("uploadImageToS3", () => {
  beforeEach(() => {
    getConvectionGeminiKeyMock.mockResolvedValue("convection-key")
    getGeminiCredentialsForEnvironmentMock.mockResolvedValue({
      policyDocument: { conditions: { bucket: "test-bucket" } },
    })
    uploadFileToS3Mock.mockResolvedValue({ key: "test-key" })
  })

  it("uploads the image and returns the s3 key and bucket", async () => {
    const result = await uploadImageToS3("file:///tmp/my-photo.jpg")

    expect(uploadFileToS3Mock).toHaveBeenCalledWith(
      expect.objectContaining({
        filePath: "file:///tmp/my-photo.jpg",
        acl: "private",
        // derived from the path so the key doesn't end in `/undefined`
        filename: "my-photo.jpg",
      })
    )
    expect(result).toEqual({ key: "test-key", bucket: "test-bucket" })
  })

  it("falls back to a default filename when the path has none", async () => {
    await uploadImageToS3("")

    expect(uploadFileToS3Mock).toHaveBeenCalledWith(
      expect.objectContaining({ filename: "photo.jpg" })
    )
  })
})

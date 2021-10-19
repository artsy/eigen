import * as danger from "danger"
import { useWebPs } from "../dangerfile"
const dm = danger as any

describe("validatePRChangelog", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("warns the author when they added some non WebPs to the project", () => {
    useWebPs(["image1.jpg", "text.txt", "image2.webp", "jsx.tsx"])
    expect(dm.warn).toHaveBeenCalledWith(
      "❌ **It seems like you added some non WebP images to Eigen, please convert them to WebPs using `source images/script.sh` script **"
    )
  })

  it("does not the author when they add WebPs", () => {
    useWebPs(["image1.webp", "image2.webp", "image3.webp"])
    expect(dm.warn).not.toHaveBeenCalled()
  })

  it("does not the author when they add nothing", () => {
    useWebPs([])
    expect(dm.warn).not.toHaveBeenCalled()
  })
})

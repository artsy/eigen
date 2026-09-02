import { discardTempPhotos } from "app/Scenes/Lens/utils/discardTempPhotos"
import { File } from "expo-file-system"

// Overrides setupJest's always-missing default so deletion is observable here.
jest.mock("expo-file-system", () => ({
  File: jest.fn(),
}))

const mockFile = File as unknown as jest.Mock

describe("discardTempPhotos", () => {
  const deleted: string[] = []

  const stubFiles = ({ exists = true, failFor }: { exists?: boolean; failFor?: string } = {}) => {
    mockFile.mockImplementation((uri: string) => ({
      exists,
      delete: () => {
        if (failFor && uri.includes(failFor)) {
          throw new Error("EPERM")
        }
        deleted.push(uri)
      },
    }))
  }

  beforeEach(() => {
    jest.clearAllMocks()
    deleted.length = 0
    stubFiles()
  })

  it("deletes every file it is given", () => {
    discardTempPhotos(["file:///tmp/capture.jpg", "file:///tmp/cropped.jpg"])

    expect(deleted).toEqual(["file:///tmp/capture.jpg", "file:///tmp/cropped.jpg"])
  })

  it("leaves a file that is already gone alone", () => {
    stubFiles({ exists: false })

    discardTempPhotos(["file:///tmp/capture.jpg"])

    expect(deleted).toEqual([])
  })

  // A temp file that won't delete is a stale file the OS clears on its own, not a broken search.
  // This runs while the user is mid-navigation, so it must not throw into the caller.
  it("keeps going, without throwing, when one file cannot be deleted", () => {
    // The util warns in dev; the spy keeps setupJest from failing the test over it.
    jest.spyOn(console, "warn").mockImplementation(() => {})
    stubFiles({ failFor: "locked" })

    expect(() =>
      discardTempPhotos(["file:///tmp/locked.jpg", "file:///tmp/cropped.jpg"])
    ).not.toThrow()

    expect(deleted).toEqual(["file:///tmp/cropped.jpg"])
  })
})

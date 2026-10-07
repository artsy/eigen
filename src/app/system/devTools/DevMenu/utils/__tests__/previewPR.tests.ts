import {
  fetchPreviewPR,
  isRunningPreviewBundle,
  parsePreviewChannel,
} from "app/system/devTools/DevMenu/utils/previewPR"

const mockUpdates: {
  channel: string | null
  isEmbeddedLaunch: boolean
  isEmergencyLaunch: boolean
} = { channel: null, isEmbeddedLaunch: false, isEmergencyLaunch: false }

jest.mock("expo-updates", () => ({
  get channel() {
    return mockUpdates.channel
  },
  get isEmbeddedLaunch() {
    return mockUpdates.isEmbeddedLaunch
  },
  get isEmergencyLaunch() {
    return mockUpdates.isEmergencyLaunch
  },
}))

const mockResponse = (status: number, body: object = {}) =>
  Promise.resolve({ status, ok: status >= 200 && status < 300, json: () => Promise.resolve(body) })

const openLabeledPR = {
  state: "open",
  title: "feat: add thing",
  labels: [{ name: "preview" }],
  head: { sha: "abcdef1234567", ref: "feat/add-thing" },
}

describe("fetchPreviewPR", () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as unknown as typeof global.fetch
  })

  it("returns the payload for an open PR with the preview label", async () => {
    fetchMock.mockReturnValue(mockResponse(200, openLabeledPR))

    await expect(fetchPreviewPR(123)).resolves.toEqual({
      channel: "review-app-123",
      prNumber: 123,
      title: "feat: add thing",
      sha: "abcdef1234567",
    })
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.github.com/repos/artsy/eigen/pulls/123")
  })

  it("rejects a closed PR", async () => {
    fetchMock.mockReturnValue(mockResponse(200, { ...openLabeledPR, state: "closed" }))

    await expect(fetchPreviewPR(123)).rejects.toThrow("PR #123 is not open")
  })

  it("returns the payload for an open PR from a review-app-* branch without the label", async () => {
    fetchMock.mockReturnValue(
      mockResponse(200, {
        ...openLabeledPR,
        labels: [],
        head: { sha: "abcdef1234567", ref: "review-app-add-thing" },
      })
    )

    await expect(fetchPreviewPR(123)).resolves.toEqual({
      channel: "review-app-123",
      prNumber: 123,
      title: "feat: add thing",
      sha: "abcdef1234567",
    })
  })

  it("rejects a PR without the preview label or a review-app-* branch", async () => {
    fetchMock.mockReturnValue(mockResponse(200, { ...openLabeledPR, labels: [{ name: "bug" }] }))

    await expect(fetchPreviewPR(123)).rejects.toThrow(
      `PR #123 doesn't have the "preview" label and isn't on a review-app-* branch`
    )
  })

  it("rejects a PR that does not exist", async () => {
    fetchMock.mockReturnValue(mockResponse(404))

    await expect(fetchPreviewPR(123)).rejects.toThrow("PR #123 not found")
  })

  it("rejects when GitHub rate limits the request", async () => {
    fetchMock.mockReturnValue(mockResponse(403))

    await expect(fetchPreviewPR(123)).rejects.toThrow("GitHub request failed (403)")
  })
})

describe("parsePreviewChannel", () => {
  it("extracts the PR number from a review app channel", () => {
    expect(parsePreviewChannel("review-app-123")).toBe(123)
  })

  it("returns null for other channels", () => {
    expect(parsePreviewChannel("staging")).toBeNull()
    expect(parsePreviewChannel("review-app-")).toBeNull()
    expect(parsePreviewChannel(null)).toBeNull()
  })
})

describe("isRunningPreviewBundle", () => {
  beforeEach(() => {
    mockUpdates.channel = "review-app-123"
    mockUpdates.isEmbeddedLaunch = false
    mockUpdates.isEmergencyLaunch = false
  })

  it("is true when an update from a review app channel is running", () => {
    expect(isRunningPreviewBundle()).toBe(true)
  })

  it("is false on other channels", () => {
    mockUpdates.channel = "staging"
    expect(isRunningPreviewBundle()).toBe(false)

    mockUpdates.channel = null
    expect(isRunningPreviewBundle()).toBe(false)
  })

  it("is false when the embedded bundle is running", () => {
    mockUpdates.isEmbeddedLaunch = true
    expect(isRunningPreviewBundle()).toBe(false)
  })

  it("is false on an emergency launch", () => {
    mockUpdates.isEmergencyLaunch = true
    expect(isRunningPreviewBundle()).toBe(false)
  })
})

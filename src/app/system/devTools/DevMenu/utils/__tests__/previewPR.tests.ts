import { fetchPreviewPR, parsePreviewChannel } from "app/system/devTools/DevMenu/utils/previewPR"

const mockResponse = (status: number, body: object = {}) =>
  Promise.resolve({ status, ok: status >= 200 && status < 300, json: () => Promise.resolve(body) })

const openLabeledPR = {
  state: "open",
  title: "feat: add thing",
  labels: [{ name: "preview" }],
  head: { sha: "abcdef1234567" },
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

  it("rejects a PR without the preview label", async () => {
    fetchMock.mockReturnValue(mockResponse(200, { ...openLabeledPR, labels: [{ name: "bug" }] }))

    await expect(fetchPreviewPR(123)).rejects.toThrow(`PR #123 doesn't have the "preview" label`)
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

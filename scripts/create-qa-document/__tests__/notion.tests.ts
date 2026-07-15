import { extractPageId, notion } from "../notion"

describe("extractPageId", () => {
  it("extracts the id from a full Notion URL whose slug is full of hex-like letters", () => {
    // The "QA"/"App"/"cab" letters in the slug are valid hex chars; anchoring to
    // the END of the path is what keeps them from shifting the match.
    expect(
      extractPageId(
        "https://www.notion.so/artsy/2026-MM-DD-Mobile-App-QA-version-A-B-C-392cab0764a080a293abc71acfc2a54b"
      )
    ).toEqual("392cab07-64a0-80a2-93ab-c71acfc2a54b")
  })

  it("strips a query string and hash", () => {
    expect(
      extractPageId("https://www.notion.so/artsy/Page-392cab0764a080a293abc71acfc2a54b?pvs=4")
    ).toEqual("392cab07-64a0-80a2-93ab-c71acfc2a54b")
    expect(
      extractPageId("https://www.notion.so/Page-392cab0764a080a293abc71acfc2a54b#heading")
    ).toEqual("392cab07-64a0-80a2-93ab-c71acfc2a54b")
  })

  it("tolerates a trailing slash", () => {
    expect(extractPageId("https://www.notion.so/Page-392cab0764a080a293abc71acfc2a54b/")).toEqual(
      "392cab07-64a0-80a2-93ab-c71acfc2a54b"
    )
  })

  it("accepts a raw 32-char id and canonicalises it into UUID form", () => {
    expect(extractPageId("392cab0764a080a293abc71acfc2a54b")).toEqual(
      "392cab07-64a0-80a2-93ab-c71acfc2a54b"
    )
  })

  it("accepts an already-hyphenated UUID and returns it unchanged", () => {
    expect(extractPageId("decba0c3-a57a-4508-b726-f3a8624ceca3")).toEqual(
      "decba0c3-a57a-4508-b726-f3a8624ceca3"
    )
  })

  it("throws when no id can be found", () => {
    expect(() => extractPageId("https://www.notion.so/artsy/no-id-here")).toThrow(/Could not find/)
    expect(() => extractPageId("")).toThrow(/Could not find/)
  })
})

describe("notion (retry/backoff)", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {})
    process.env.NOTION_RELEASE_LOOKOUT_TOKEN = "test-token"
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
    delete process.env.NOTION_RELEASE_LOOKOUT_TOKEN
  })

  const notOk = (status: number, retryAfter?: string) => ({
    ok: false,
    status,
    headers: { get: (h: string) => (h === "Retry-After" ? retryAfter ?? null : null) },
    text: async () => `body for ${status}`,
  })

  it("returns parsed JSON on a 2xx", async () => {
    ;(global as any).fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ id: "1" }) })
    await expect(notion("/pages/x")).resolves.toEqual({ id: "1" })
  })

  it("throws immediately (no retry) on a non-retryable 4xx, including the body", async () => {
    const fetchMock = jest.fn().mockResolvedValue(notOk(400))
    ;(global as any).fetch = fetchMock

    await expect(notion("/pages/x")).rejects.toThrow(/Notion API error 400: body for 400/)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("retries a 5xx with backoff, then resolves on success", async () => {
    jest.useFakeTimers()
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(notOk(500))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })
    ;(global as any).fetch = fetchMock

    const p = notion("/pages/x")
    await jest.advanceTimersByTimeAsync(500) // 2**0 * 500ms
    await expect(p).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("honours the Retry-After header for the delay", async () => {
    jest.useFakeTimers()
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(notOk(429, "2"))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })
    ;(global as any).fetch = fetchMock

    const p = notion("/pages/x")
    await jest.advanceTimersByTimeAsync(1999)
    expect(fetchMock).toHaveBeenCalledTimes(1) // still waiting on the 2s Retry-After
    await jest.advanceTimersByTimeAsync(1)
    await expect(p).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("retries a thrown network error / timeout, then resolves on success", async () => {
    jest.useFakeTimers()
    const fetchMock = jest
      .fn()
      .mockRejectedValueOnce(new Error("The operation was aborted due to timeout"))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })
    ;(global as any).fetch = fetchMock

    const p = notion("/pages/x")
    await jest.advanceTimersByTimeAsync(500)
    await expect(p).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("gives up after MAX_RETRIES and throws", async () => {
    jest.useFakeTimers()
    const fetchMock = jest.fn().mockResolvedValue(notOk(503))
    ;(global as any).fetch = fetchMock

    const p = notion("/pages/x")
    const assertion = expect(p).rejects.toThrow(/Notion API error 503/)
    await jest.runAllTimersAsync()
    await assertion
    // initial attempt + 4 retries = 5 total
    expect(fetchMock).toHaveBeenCalledTimes(5)
  })
})

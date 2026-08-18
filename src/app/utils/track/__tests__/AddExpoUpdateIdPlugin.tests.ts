jest.mock("expo-updates", () => ({
  get isEmbeddedLaunch() {
    return mockUpdates.isEmbeddedLaunch
  },
  get updateId() {
    return mockUpdates.updateId
  },
}))

import { AddExpoUpdateIdPlugin } from "app/utils/track/AddExpoUpdateIdPlugin"

describe("AddExpoUpdateIdPlugin", () => {
  beforeEach(() => {
    mockUpdates.isEmbeddedLaunch = false
    mockUpdates.updateId = "aaaa-bbbb-cccc"
  })

  const plugin = new AddExpoUpdateIdPlugin()

  it("adds the expo update id to context.app when an OTA update is running", async () => {
    const event = { context: {} }

    const result = await plugin.execute(event as any)

    expect(result?.context?.app).toEqual({ expoUpdateId: "aaaa-bbbb-cccc" })
  })

  it("does not add an update id when running the embedded bundle", async () => {
    mockUpdates.isEmbeddedLaunch = true
    const event = { context: {} }

    const result = await plugin.execute(event as any)

    expect(result?.context?.app).toBeUndefined()
  })

  it("preserves existing context.app keys", async () => {
    const event = { context: { app: { name: "eigen", version: "9.16.0" } } }

    const result = await plugin.execute(event as any)

    expect(result?.context?.app).toEqual({
      name: "eigen",
      version: "9.16.0",
      expoUpdateId: "aaaa-bbbb-cccc",
    })
  })

  it("does not throw when the event has no context", async () => {
    const event = {}

    const result = await plugin.execute(event as any)

    expect(result?.context?.app).toEqual({ expoUpdateId: "aaaa-bbbb-cccc" })
  })
})

const mockUpdates: any = {
  isEmbeddedLaunch: false,
  updateId: "aaaa-bbbb-cccc",
}

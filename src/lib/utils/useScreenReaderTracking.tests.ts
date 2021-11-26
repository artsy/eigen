import { renderHook } from "@testing-library/react-hooks"
import { postEventToProviders } from "./track/providers"
import { useScreenReaderTracking } from "./useScreenReaderTracking"

describe("useScreenReaderTracking", () => {
  it("Should track the status of the screen reader of a user", () => {
    renderHook(() => useScreenReaderTracking())

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect((postEventToProviders as jest.Mock).mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "screen_reader_enabled",
          "screen_reader_enabled": false,
        },
      ]
    `)
  })
})

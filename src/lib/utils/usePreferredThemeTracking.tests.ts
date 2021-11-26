import { renderHook } from "@testing-library/react-hooks"
import { postEventToProviders } from "./track/providers"
import { usePreferredThemeTracking } from "./usePreferredThemeTracking"

describe("usePreferredThemeTracking", () => {
  it("Should track the preferred theme of the user", () => {
    renderHook(() => usePreferredThemeTracking())

    expect(postEventToProviders).toHaveBeenCalledTimes(1)
    expect((postEventToProviders as jest.Mock).mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "user_preferred_theme",
          "user_interface_style": "light",
        },
      ]
    `)
  })
})

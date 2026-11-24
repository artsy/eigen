import { MAX_SELECTED_WORKS } from "app/Scenes/Sell/constants"
import { toggleWorkSelection } from "app/Scenes/Sell/utils/toggleWorkSelection"

const fullSelection = Array.from({ length: MAX_SELECTED_WORKS }, (_, index) => `id-${index}`)

describe("toggleWorkSelection", () => {
  it("adds and removes a work", () => {
    expect(toggleWorkSelection(["id-a"], "id-b")).toEqual(["id-a", "id-b"])
    expect(toggleWorkSelection(["id-a", "id-b"], "id-a")).toEqual(["id-b"])
  })

  it("refuses a work past the limit", () => {
    expect(toggleWorkSelection(fullSelection, "id-extra")).toBeNull()
  })

  it("still removes a work at the limit", () => {
    expect(toggleWorkSelection(fullSelection, "id-0")).toHaveLength(MAX_SELECTED_WORKS - 1)
  })
})

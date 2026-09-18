import { toCityEventListItems } from "app/Scenes/CityGuide/Screens/CityEventList/utils/cityEventListItems"

const sections = [
  { id: "farringdon", title: "Farringdon", items: [{ id: "a" }, { id: "b" }] },
  { id: "central", title: "Central London", items: [{ id: "c" }] },
]

describe("toCityEventListItems", () => {
  it("emits a header followed by that section's rows", () => {
    const items = toCityEventListItems(sections, new Set())
    const totalRows = sections.reduce((sum, s) => sum + s.items.length, 0)

    expect(items).toHaveLength(sections.length + totalRows)
    expect(items.map((i) => i.kind)).toEqual(["header", "row", "row", "header", "row"])
  })

  it("keeps a collapsed section's header and drops its rows", () => {
    const items = toCityEventListItems(sections, new Set(["farringdon"]))

    expect(items.map((i) => i.kind)).toEqual(["header", "header", "row"])
    expect(items.filter((i) => i.sectionId === "farringdon")).toHaveLength(1)
  })

  it("marks each header with its own expanded state", () => {
    const items = toCityEventListItems(sections, new Set(["central"]))
    const headers = items.filter((i) => i.kind === "header")

    expect(headers.map((h) => h.kind === "header" && h.isExpanded)).toEqual([true, false])
  })

  it("returns nothing for no sections", () => {
    expect(toCityEventListItems([], new Set())).toEqual([])
  })

  it("stamps every row with its section id", () => {
    const items = toCityEventListItems(sections, new Set())
    const rows = items.filter((i) => i.kind === "row")

    expect(rows.map((r) => r.sectionId)).toEqual(["farringdon", "farringdon", "central"])
  })
})

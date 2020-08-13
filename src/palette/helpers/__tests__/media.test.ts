import { media } from "../media"

describe("media", () => {
  it("returns the mediaQuery", () => {
    expect(media.xs``.join("")).toContain("@media (max-width:767px)")
    expect(media.sm``.join("")).toContain("@media (max-width:768px)")
    expect(media.md``.join("")).toContain("@media (max-width:900px)")
    expect(media.lg``.join("")).toContain("@media (max-width:1024px)")
    expect(media.xl``.join("")).toContain("@media (max-width:1192px)")
  })
})

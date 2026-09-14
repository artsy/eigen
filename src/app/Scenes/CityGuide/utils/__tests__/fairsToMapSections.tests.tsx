import { CityEventFairSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"
import { fairsToMapSections } from "app/Scenes/CityGuide/utils/fairsToMapSections"
import { Fair } from "app/Scenes/CityGuide/utils/types"
import { isValidElement } from "react"

const makeFair = (overrides: Partial<Fair> = {}): Fair =>
  ({
    id: "fair-1",
    slug: "frieze-london",
    name: "Frieze London",
    exhibition_period: "Oct 9 – Oct 12, 2026",
    location: { postalCode: "NW1 4NR", coordinates: { lat: 51.53, lng: -0.15 } },
    profile: { id: "profile-1", internalID: "profile-internal-1", isFollowed: false },
    ...overrides,
  }) as unknown as Fair

const makeSection = (items: Fair[]): CityEventSection<Fair>[] => [
  { id: "regents-park", title: "Regent's Park", items },
]

describe("fairsToMapSections", () => {
  it("carries the section id and title over unchanged", () => {
    const sections = fairsToMapSections(makeSection([makeFair()]))

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("regents-park")
    expect(sections[0].title).toEqual("Regent's Park")
  })

  it("maps a fair's id, title, coordinates, and builds an href from the slug", () => {
    const sections = fairsToMapSections(makeSection([makeFair()]))

    expect(sections[0].places[0]).toMatchObject({
      id: "fair-1",
      title: "Frieze London",
      coordinates: { lat: 51.53, lng: -0.15 },
      href: "/fair/frieze-london",
    })
  })

  it("drops fairs with invalid coordinates rather than trusting them", () => {
    const valid = makeFair({ id: "valid" })
    const invalid = makeFair({
      id: "invalid",
      location: { postalCode: "NW1 4NR", coordinates: { lat: null, lng: null } },
    })

    const sections = fairsToMapSections(makeSection([valid, invalid]))

    expect(sections[0].places.map((p) => p.id)).toEqual(["valid"])
  })

  it("leaves a section with no valid places rather than dropping it", () => {
    const invalid = makeFair({
      location: { postalCode: "NW1 4NR", coordinates: { lat: undefined, lng: undefined } },
    })

    const sections = fairsToMapSections(makeSection([invalid]))

    expect(sections).toHaveLength(1)
    expect(sections[0].places).toEqual([])
  })

  it("always uses the fair pin icon", () => {
    const sections = fairsToMapSections(makeSection([makeFair()]))

    expect(sections[0].places[0].icon).toEqual("pin-fair")
  })

  it("injects a save control keyed on the fair's profile ids, not the fair's own", () => {
    const sections = fairsToMapSections(makeSection([makeFair()]))
    const saveControl = sections[0].places[0].saveControl as React.ReactElement

    expect(isValidElement(saveControl)).toBe(true)
    expect(saveControl.type).toBe(CityEventFairSaveControl)
    expect(saveControl.props).toMatchObject({ id: "profile-1", internalID: "profile-internal-1" })
  })

  it("omits the save control when the fair has no profile", () => {
    const sections = fairsToMapSections(makeSection([makeFair({ profile: null })]))

    expect(sections[0].places[0].saveControl).toBeUndefined()
  })
})

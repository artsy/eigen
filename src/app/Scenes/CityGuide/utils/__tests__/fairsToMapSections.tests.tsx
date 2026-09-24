import { OwnerType } from "@artsy/cohesion"
import { CityEventRowContext } from "app/Scenes/CityGuide/Components/CityEventRows"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"
import { fairsToMapSections } from "app/Scenes/CityGuide/utils/fairsToMapSections"
import { Fair } from "app/Scenes/CityGuide/utils/types"
import { isValidElement } from "react"

const TEST_CONTEXT: CityEventRowContext = {
  contextScreenOwnerType: OwnerType.cityGuideEventList,
  contextScreenOwnerSlug: "london-united-kingdom",
}

const makeFair = (overrides: Partial<Fair> = {}): Fair =>
  ({
    id: "fair-1",
    internalID: "fair-internal-1",
    slug: "frieze-london",
    name: "Frieze London",
    exhibition_period: "Oct 9 – Oct 12, 2026",
    location: {
      address: "The Regent's Park, London NW1 4NR",
      coordinates: { lat: 51.53, lng: -0.15 },
    },
    profile: { id: "profile-1", internalID: "profile-internal-1", isFollowed: false },
    ...overrides,
  }) as unknown as Fair

const makeSection = (items: Fair[]): CityEventSection<Fair>[] => [
  { id: "regents-park", title: "Regent's Park", items },
]

describe("fairsToMapSections", () => {
  it("carries the section id and title over unchanged", () => {
    const sections = fairsToMapSections(makeSection([makeFair()]), TEST_CONTEXT)

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("regents-park")
    expect(sections[0].title).toEqual("Regent's Park")
  })

  it("maps a fair's id, title, coordinates, and builds an href from the slug", () => {
    const sections = fairsToMapSections(makeSection([makeFair()]), TEST_CONTEXT)

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
      location: {
        address: "The Regent's Park, London NW1 4NR",
        cityGuideNeighborhood: null,
        coordinates: { lat: null, lng: null },
      },
    })

    const sections = fairsToMapSections(makeSection([valid, invalid]), TEST_CONTEXT)

    expect(sections[0].places.map((p) => p.id)).toEqual(["valid"])
  })

  it("leaves a section with no valid places rather than dropping it", () => {
    const invalid = makeFair({
      location: {
        address: "The Regent's Park, London NW1 4NR",
        cityGuideNeighborhood: null,
        coordinates: { lat: undefined, lng: undefined },
      },
    })

    const sections = fairsToMapSections(makeSection([invalid]), TEST_CONTEXT)

    expect(sections).toHaveLength(1)
    expect(sections[0].places).toEqual([])
  })

  it("always uses the fair pin icon", () => {
    const sections = fairsToMapSections(makeSection([makeFair()]), TEST_CONTEXT)

    expect(sections[0].places[0].icon).toEqual("pin-fair")
  })

  // Keyed on the fair itself, not its profile: a stop stores the fair, and following — which
  // is what needed the profile — is gone.
  it("injects a save control keyed on the fair's own id", () => {
    const sections = fairsToMapSections(makeSection([makeFair()]), TEST_CONTEXT)
    const saveControl = sections[0].places[0].saveControl as React.ReactElement

    expect(isValidElement(saveControl)).toBe(true)
    expect(saveControl.type).toBe(CityEventSaveControl)
    expect(saveControl.props).toMatchObject({
      itemType: "FAIR",
      itemID: "fair-internal-1",
      itemSlug: "frieze-london",
      contextScreenOwnerType: OwnerType.cityGuideEventList,
      contextScreenOwnerSlug: "london-united-kingdom",
    })
  })

  it("still offers the control for a fair with no profile", () => {
    const sections = fairsToMapSections(makeSection([makeFair({ profile: null })]), TEST_CONTEXT)

    expect(sections[0].places[0].saveControl).toBeTruthy()
  })

  // A stop needs a place to go, same rule the Fair page header's own plus follows.
  it("offers no control for a fair with no address", () => {
    const sections = fairsToMapSections(
      makeSection([
        makeFair({
          location: {
            address: null,
            cityGuideNeighborhood: null,
            coordinates: { lat: 51.53, lng: -0.15 },
          },
        }),
      ]),
      TEST_CONTEXT
    )

    expect(sections[0].places[0].saveControl).toBeFalsy()
  })
})

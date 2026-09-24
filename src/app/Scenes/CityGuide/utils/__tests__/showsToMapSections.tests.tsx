import { OwnerType } from "@artsy/cohesion"
import { CityEventRowContext } from "app/Scenes/CityGuide/Components/CityEventRows"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"
import { showsToMapSections } from "app/Scenes/CityGuide/utils/showsToMapSections"
import { Show } from "app/Scenes/CityGuide/utils/types"
import { isValidElement } from "react"

const TEST_CONTEXT: CityEventRowContext = {
  contextScreenOwnerType: OwnerType.cityGuideEventList,
  contextScreenOwnerSlug: "london-united-kingdom",
}

const makeShow = (overrides: Partial<Show> = {}): Show =>
  ({
    id: "show-1",
    internalID: "internal-1",
    name: "Frida Kahlo",
    href: "/show/frida-kahlo",
    is_followed: false,
    exhibition_period: "Aug 24 – Sep 28, 2026",
    location: { coordinates: { lat: 51.5, lng: -0.1 } },
    ...overrides,
  }) as unknown as Show

const makeSection = (items: Show[]): CityEventSection<Show>[] => [
  { id: "clerkenwell", title: "Clerkenwell", items },
]

describe("showsToMapSections", () => {
  it("carries the section id and title over unchanged", () => {
    const sections = showsToMapSections(makeSection([makeShow()]), TEST_CONTEXT)

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("clerkenwell")
    expect(sections[0].title).toEqual("Clerkenwell")
  })

  it("maps a show's id, title, coordinates and href", () => {
    const sections = showsToMapSections(makeSection([makeShow()]), TEST_CONTEXT)

    expect(sections[0].places[0]).toMatchObject({
      id: "show-1",
      title: "Frida Kahlo",
      coordinates: { lat: 51.5, lng: -0.1 },
      href: "/show/frida-kahlo",
    })
  })

  it("drops shows with invalid coordinates rather than trusting them", () => {
    const valid = makeShow({ id: "valid" })
    const invalid = makeShow({
      id: "invalid",
      location: { cityGuideNeighborhood: null, coordinates: { lat: null, lng: null } },
    })

    const sections = showsToMapSections(makeSection([valid, invalid]), TEST_CONTEXT)

    expect(sections[0].places.map((p) => p.id)).toEqual(["valid"])
  })

  it("leaves a section with no valid places rather than dropping it", () => {
    const invalid = makeShow({
      location: { cityGuideNeighborhood: null, coordinates: { lat: undefined, lng: undefined } },
    })

    const sections = showsToMapSections(makeSection([invalid]), TEST_CONTEXT)

    expect(sections).toHaveLength(1)
    expect(sections[0].places).toEqual([])
  })

  // The same card an itinerary stop gets, so a show reads the same on either map.
  it("gives each pin the show's own stop card", () => {
    const sections = showsToMapSections(makeSection([makeShow()]), TEST_CONTEXT)

    expect(sections[0].places[0].card).toMatchObject({
      kind: "show",
      title: "Frida Kahlo",
      hours: "Aug 24 – Sep 28, 2026",
      href: "/show/frida-kahlo",
    })
  })

  it("carries the show's cover image, and none when it has none", () => {
    const withCover = showsToMapSections(
      makeSection([
        makeShow({ cover_image: { url: "https://example.com/show.jpg" } } as Partial<Show>),
      ]),
      TEST_CONTEXT
    )

    expect(withCover[0].places[0].image).toEqual({ url: "https://example.com/show.jpg" })
    expect(
      showsToMapSections(makeSection([makeShow()]), TEST_CONTEXT)[0].places[0].image
    ).toBeNull()
  })

  it("uses the saved pin icon for a followed show, and the plain pin otherwise", () => {
    const followed = showsToMapSections(
      makeSection([makeShow({ is_followed: true })]),
      TEST_CONTEXT
    )
    const notFollowed = showsToMapSections(
      makeSection([makeShow({ is_followed: false })]),
      TEST_CONTEXT
    )

    expect(followed[0].places[0].icon).toEqual("pin-saved")
    expect(notFollowed[0].places[0].icon).toEqual("pin")
  })

  it("always injects a CityEventSaveControl", () => {
    const sections = showsToMapSections(makeSection([makeShow()]), TEST_CONTEXT)
    const saveControl = sections[0].places[0].saveControl

    expect(isValidElement(saveControl)).toBe(true)
    expect((saveControl as React.ReactElement).type).toBe(CityEventSaveControl)
  })

  it("threads the calling screen's context onto the save control", () => {
    const sections = showsToMapSections(makeSection([makeShow()]), TEST_CONTEXT)
    const saveControl = sections[0].places[0].saveControl as React.ReactElement

    expect(saveControl.props).toMatchObject({
      contextScreenOwnerType: OwnerType.cityGuideEventList,
      contextScreenOwnerSlug: "london-united-kingdom",
    })
  })
})

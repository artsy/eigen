import { CityEventShowSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"
import { showsToMapSections } from "app/Scenes/CityGuide/utils/showsToMapSections"
import { Show } from "app/Scenes/CityGuide/utils/types"
import { isValidElement } from "react"

const makeShow = (overrides: Partial<Show> = {}): Show =>
  ({
    id: "show-1",
    internalID: "internal-1",
    name: "Frida Kahlo",
    href: "/show/frida-kahlo",
    is_followed: false,
    exhibition_period: "Aug 24 – Sep 28, 2026",
    location: { postalCode: "EC1M 5RR", coordinates: { lat: 51.5, lng: -0.1 } },
    ...overrides,
  }) as unknown as Show

const makeSection = (items: Show[]): CityEventSection<Show>[] => [
  { id: "clerkenwell", title: "Clerkenwell", items },
]

describe("showsToMapSections", () => {
  it("carries the section id and title over unchanged", () => {
    const sections = showsToMapSections(makeSection([makeShow()]))

    expect(sections).toHaveLength(1)
    expect(sections[0].id).toEqual("clerkenwell")
    expect(sections[0].title).toEqual("Clerkenwell")
  })

  it("maps a show's id, title, coordinates and href", () => {
    const sections = showsToMapSections(makeSection([makeShow()]))

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
      location: { postalCode: "EC1M 5RR", coordinates: { lat: null, lng: null } },
    })

    const sections = showsToMapSections(makeSection([valid, invalid]))

    expect(sections[0].places.map((p) => p.id)).toEqual(["valid"])
  })

  it("leaves a section with no valid places rather than dropping it", () => {
    const invalid = makeShow({
      location: { postalCode: "EC1M 5RR", coordinates: { lat: undefined, lng: undefined } },
    })

    const sections = showsToMapSections(makeSection([invalid]))

    expect(sections).toHaveLength(1)
    expect(sections[0].places).toEqual([])
  })

  it("injects the exhibition period as plain text, not a lazy lookup", () => {
    const sections = showsToMapSections(makeSection([makeShow()]))
    const detail = sections[0].places[0].detail

    expect(isValidElement(detail)).toBe(true)
    expect((detail as React.ReactElement<{ children: string }>).props.children).toEqual(
      "Aug 24 – Sep 28, 2026"
    )
  })

  it("omits the detail node when there is no exhibition period", () => {
    const sections = showsToMapSections(makeSection([makeShow({ exhibition_period: null })]))

    expect(sections[0].places[0].detail).toBeUndefined()
  })

  it("uses the saved pin icon for a followed show, and the plain pin otherwise", () => {
    const followed = showsToMapSections(makeSection([makeShow({ is_followed: true })]))
    const notFollowed = showsToMapSections(makeSection([makeShow({ is_followed: false })]))

    expect(followed[0].places[0].icon).toEqual("pin-saved")
    expect(notFollowed[0].places[0].icon).toEqual("pin")
  })

  it("always injects a CityEventShowSaveControl", () => {
    const sections = showsToMapSections(makeSection([makeShow()]))
    const saveControl = sections[0].places[0].saveControl

    expect(isValidElement(saveControl)).toBe(true)
    expect((saveControl as React.ReactElement).type).toBe(CityEventShowSaveControl)
  })
})

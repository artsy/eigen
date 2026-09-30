import { OwnerType } from "@artsy/cohesion"
import { CityEventRowContext } from "app/Scenes/CityGuide/Components/CityEventRows"
import { activeItemsToMapPlaces } from "app/Scenes/CityGuide/utils/activeItemsToMapPlaces"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"

const TEST_CONTEXT: CityEventRowContext = {
  contextScreenOwnerType: OwnerType.cityGuideMap,
  contextScreenOwnerSlug: "london-united-kingdom",
}

const makeShow = (overrides: Partial<Show> = {}): Show =>
  ({
    id: "show-1",
    internalID: "show-internal-1",
    name: "Frida Kahlo",
    href: "/show/frida-kahlo",
    is_followed: false,
    location: { postalCode: "EC1M 5RR", coordinates: { lat: 51.5, lng: -0.1 } },
    ...overrides,
  }) as unknown as Show

const makeFair = (overrides: Partial<Fair> = {}): Fair =>
  ({
    id: "fair-1",
    internalID: "fair-internal-1",
    slug: "frieze-london",
    name: "Frieze London",
    location: {
      address: "The Regent's Park, London NW1 4NR",
      coordinates: { lat: 51.53, lng: -0.15 },
    },
    profile: { id: "profile-1", internalID: "profile-internal-1", isFollowed: false },
    ...overrides,
  }) as unknown as Fair

describe("activeItemsToMapPlaces", () => {
  it("returns no places for no items", () => {
    expect(activeItemsToMapPlaces([], TEST_CONTEXT)).toEqual([])
  })

  it("maps a fair as a fair and a show as a show", () => {
    const places = activeItemsToMapPlaces([makeShow(), makeFair()], TEST_CONTEXT)

    expect(places[0]).toMatchObject({ id: "show-1", href: "/show/frida-kahlo", icon: "pin" })
    expect(places[1]).toMatchObject({ id: "fair-1", href: "/fair/frieze-london", icon: "pin-fair" })
  })

  it("keeps the tapped order, even when fairs and shows are mixed", () => {
    const items = [
      makeFair({ id: "fair-a" }),
      makeShow({ id: "show-a" }),
      makeFair({ id: "fair-b" }),
      makeShow({ id: "show-b" }),
    ]

    expect(activeItemsToMapPlaces(items, TEST_CONTEXT).map((place) => place.id)).toEqual([
      "fair-a",
      "show-a",
      "fair-b",
      "show-b",
    ])
  })

  it("drops items without valid coordinates", () => {
    const items = [
      makeShow({ id: "valid" }),
      makeShow({ id: "invalid", location: { coordinates: { lat: null, lng: null } } } as any),
    ]

    expect(activeItemsToMapPlaces(items, TEST_CONTEXT).map((place) => place.id)).toEqual(["valid"])
  })

  it("passes the calling screen's context to each save control", () => {
    const places = activeItemsToMapPlaces([makeShow(), makeFair()], TEST_CONTEXT)

    places.forEach((place) => {
      expect((place.saveControl as React.ReactElement).props).toMatchObject({
        contextScreenOwnerType: OwnerType.cityGuideMap,
        contextScreenOwnerSlug: "london-united-kingdom",
      })
    })
  })
})

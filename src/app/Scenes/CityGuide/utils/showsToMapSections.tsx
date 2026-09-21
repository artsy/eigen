import { CityEventRowContext } from "app/Scenes/CityGuide/Components/CityEventRows"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { showCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"
import { Show } from "app/Scenes/CityGuide/utils/types"

/**
 * Adapts the event list screen's show sections into the shared map's section-shaped input.
 * `Show.location.coordinates` is nullable, unlike an itinerary stop's, so shows without a
 * valid pair are dropped rather than trusted (`isValidLatLng`). Each pin carries the same
 * `StopCard` content an itinerary stop does — including any event the show runs — so a show
 * reads the same whether you meet it on this map or in a guide.
 */
export const showsToMapSections = (
  sections: CityEventSection<Show>[],
  context: CityEventRowContext
): MapSection[] =>
  sections.map((section) => ({
    id: section.id,
    title: section.title,
    places: section.items
      .flatMap((show) => {
        const coordinates = show.location?.coordinates

        return isValidLatLng(coordinates) ? [{ show, coordinates }] : []
      })
      .map(({ show, coordinates }) => ({
        id: show.id,
        title: show.name ?? "",
        coordinates,
        href: show.href ?? null,
        icon: show.is_followed ? "pin-saved" : "pin",
        card: showCardFields(show),
        image: show.cover_image?.url ? { url: show.cover_image.url } : null,
        saveControl: (
          <CityEventSaveControl
            itemType="SHOW"
            itemID={show.internalID}
            itemSlug={show.slug ?? undefined}
            name={show.name ?? ""}
            contextScreenOwnerType={context.contextScreenOwnerType}
            contextScreenOwnerSlug={context.contextScreenOwnerSlug}
          />
        ),
      })),
  }))

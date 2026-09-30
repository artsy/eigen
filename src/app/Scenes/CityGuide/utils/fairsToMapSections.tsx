import { CityEventRowContext } from "app/Scenes/CityGuide/Components/CityEventRows"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { fairCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"
import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"
import { Fair } from "app/Scenes/CityGuide/utils/types"

/** Adapts fairs into map places with the same card content as itinerary stops. */
export const fairsToMapSections = (
  sections: CityEventSection<Fair>[],
  context: CityEventRowContext
): MapSection[] =>
  sections.map((section) => ({
    id: section.id,
    title: section.title,
    places: section.items
      .flatMap((fair) => {
        const coordinates = fair.location?.coordinates

        return isValidLatLng(coordinates) ? [{ fair, coordinates }] : []
      })
      .map(({ fair, coordinates }) => ({
        id: fair.id,
        title: fair.name ?? "",
        coordinates,
        href: `/fair/${fair.slug}`,
        icon: "pin-fair",
        card: fairCardFields(fair),
        image: fair.image?.url ? { url: fair.image.url } : null,
        // No longer gated on the fair having a profile: a stop stores the fair itself, so
        // there is nothing a missing profile would stop. Gated on the fair having an address
        // instead: a stop needs a place to go, same as the Fair page header.
        saveControl: fair.location?.address ? (
          <CityEventSaveControl
            itemType="FAIR"
            itemID={fair.internalID}
            itemSlug={fair.slug ?? undefined}
            name={fair.name ?? ""}
            isOnMyItineraries={fair.isOnMyItineraries}
            contextScreenOwnerType={context.contextScreenOwnerType}
            contextScreenOwnerSlug={context.contextScreenOwnerSlug}
          />
        ) : undefined,
      })),
  }))

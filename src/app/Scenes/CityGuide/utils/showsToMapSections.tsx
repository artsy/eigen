import { Text } from "@artsy/palette-mobile"
import { CityEventShowSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"
import { Show } from "app/Scenes/CityGuide/utils/types"

/**
 * Adapts the event list screen's show sections into the shared map's input. Shows with no
 * valid coordinates are dropped; the detail line is plain text since the period is already in hand.
 */
export const showsToMapSections = (sections: CityEventSection<Show>[]): MapSection[] =>
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
        detail: show.exhibition_period ? (
          <Text variant="xs" color="mono60">
            {show.exhibition_period}
          </Text>
        ) : undefined,
        saveControl: (
          <CityEventShowSaveControl
            id={show.id}
            internalID={show.internalID}
            isFollowed={show.is_followed}
            name={show.name ?? ""}
          />
        ),
      })),
  }))

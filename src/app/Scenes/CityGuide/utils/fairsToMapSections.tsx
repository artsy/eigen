import { Text } from "@artsy/palette-mobile"
import { CityEventFairSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { MapSection } from "app/Scenes/CityGuide/Components/Map/utils/mapSectionsToGeoJSON"
import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"
import { isValidLatLng } from "app/Scenes/CityGuide/utils/isValidLatLng"
import { Fair } from "app/Scenes/CityGuide/utils/types"

/**
 * Adapts the event list screen's fair sections into the shared map's section-shaped input.
 * Two fair-specific gotchas, both already handled by `CityEventRows.renderFairRow` and
 * repeated here rather than shared, since that helper returns a row, not a map place:
 * fairs fetch no `href`, so the URL is built from the slug by hand, and following a fair is
 * a follow of its **profile**, which is nullable, so the save control is only injected when
 * one exists.
 */
export const fairsToMapSections = (sections: CityEventSection<Fair>[]): MapSection[] =>
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
        detail: fair.exhibition_period ? (
          <Text variant="xs" color="mono60">
            {fair.exhibition_period}
          </Text>
        ) : undefined,
        saveControl: fair.profile ? (
          <CityEventFairSaveControl
            id={fair.profile.id}
            internalID={fair.profile.internalID}
            isFollowed={fair.profile.isFollowed}
            name={fair.name ?? ""}
          />
        ) : undefined,
      })),
  }))

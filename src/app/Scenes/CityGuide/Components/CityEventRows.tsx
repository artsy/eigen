import { CityEventRow } from "app/Scenes/CityGuide/Components/CityEventRow"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"

/**
 * Shared by `CityEventListScreen` and `CitySavedList`: both list shows and fairs as
 * `CityEventRow`s with the same fields and the same save control wiring.
 */
export const renderShowRow = (show: Show) => (
  <CityEventRow
    title={show.name ?? ""}
    subtitle={show.partner?.name ?? null}
    meta={show.exhibition_period ?? null}
    imageURL={show.cover_image?.url ?? null}
    href={show.href ?? null}
    saveControl={
      <CityEventSaveControl itemType="SHOW" itemID={show.internalID} name={show.name ?? ""} />
    }
  />
)

export const renderFairRow = (fair: Fair) => (
  <CityEventRow
    title={fair.name ?? ""}
    subtitle={fair.profile?.name ?? null}
    meta={fair.exhibition_period ?? null}
    imageURL={fair.image?.url ?? null}
    href={`/fair/${fair.slug}`}
    saveControl={
      <CityEventSaveControl itemType="FAIR" itemID={fair.internalID} name={fair.name ?? ""} />
    }
  />
)

import { ScreenOwnerType } from "@artsy/cohesion"
import { CityEventRow } from "app/Scenes/CityGuide/Components/CityEventRow"
import { CityEventSaveControl } from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"

/** Where the row is rendered — `CityEventListScreen` and `CitySavedList` are different
 *  screens, so neither gets to assume the other's owner type. */
export interface CityEventRowContext {
  contextScreenOwnerType: ScreenOwnerType
  contextScreenOwnerSlug?: string
}

/**
 * Shared by `CityEventListScreen` and `CitySavedList`: both list shows and fairs as
 * `CityEventRow`s with the same fields and the same save control wiring.
 */
export const renderShowRow = (show: Show, context: CityEventRowContext) => (
  <CityEventRow
    title={show.name ?? ""}
    subtitle={show.partner?.name ?? null}
    meta={show.exhibition_period ?? null}
    imageURL={show.cover_image?.url ?? null}
    href={show.href ?? null}
    saveControl={
      <CityEventSaveControl
        itemType="SHOW"
        itemID={show.internalID}
        itemSlug={show.slug ?? undefined}
        name={show.name ?? ""}
        contextScreenOwnerType={context.contextScreenOwnerType}
        contextScreenOwnerSlug={context.contextScreenOwnerSlug}
      />
    }
  />
)

export const renderFairRow = (fair: Fair, context: CityEventRowContext) => (
  <CityEventRow
    title={fair.name ?? ""}
    subtitle={fair.profile?.name ?? null}
    meta={fair.exhibition_period ?? null}
    imageURL={fair.image?.url ?? null}
    href={`/fair/${fair.slug}`}
    saveControl={
      <CityEventSaveControl
        itemType="FAIR"
        itemID={fair.internalID}
        itemSlug={fair.slug ?? undefined}
        name={fair.name ?? ""}
        contextScreenOwnerType={context.contextScreenOwnerType}
        contextScreenOwnerSlug={context.contextScreenOwnerSlug}
      />
    }
  />
)

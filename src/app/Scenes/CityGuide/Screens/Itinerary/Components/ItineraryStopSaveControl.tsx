import {
  CityEventFairSaveControl,
  CityEventPartnerSaveControl,
  CityEventShowSaveControl,
} from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import {
  ItineraryStopEntity,
  useItineraryStopEntity,
} from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"

interface Props {
  stopId: string
  stopTitle: string
  variant?: "icon" | "button"
  /**
   * Pass this when the control is rendered somewhere that cannot see
   * `ItineraryStopEntitiesProvider` — a `@gorhom/bottom-sheet` modal, for instance, re-parents
   * its children into a portal via `@gorhom/portal`, which does not carry React context across.
   * When omitted, the control falls back to reading context as usual.
   */
  entity?: ItineraryStopEntity
}

/**
 * Thin over the entity the itinerary screen's resolvers have already reported for this stop.
 * Fires no query of its own — that duplicated one query per row before this refactor.
 */
export const ItineraryStopSaveControl: React.FC<Props> = ({
  stopId,
  stopTitle,
  variant,
  entity: entityProp,
}) => {
  // Always called, so hook order stays stable regardless of whether `entity` is passed. The
  // context lookup is cheap and simply goes unused when a caller supplies the entity directly.
  const contextEntity = useItineraryStopEntity(stopId)
  const entity = entityProp ?? contextEntity

  // Nothing to render until this stop's resolver reports. Matches today's behaviour, where a
  // suspended per-row query rendered its own null fallback. Rows are independent of the
  // provider's overall completeness: one row appears as soon as its own lookup resolves.
  if (!entity) {
    return null
  }

  if (entity.type === "SHOW") {
    return (
      <CityEventShowSaveControl
        id={entity.id}
        internalID={entity.internalID}
        isFollowed={entity.isFollowed}
        name={stopTitle}
        variant={variant}
      />
    )
  }

  if (entity.type === "FAIR") {
    return (
      <CityEventFairSaveControl
        id={entity.id}
        internalID={entity.internalID}
        isFollowed={entity.isFollowed}
        name={stopTitle}
        variant={variant}
      />
    )
  }

  // PARTNER.
  return (
    <CityEventPartnerSaveControl
      id={entity.id}
      internalID={entity.internalID}
      isFollowed={entity.isFollowed}
      name={stopTitle}
      variant={variant}
    />
  )
}

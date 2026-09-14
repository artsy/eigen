import {
  CityEventFairSaveControl,
  CityEventPartnerSaveControl,
  CityEventShowSaveControl,
} from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { useItineraryStopEntity } from "app/Scenes/CityGuide/Screens/Itinerary/hooks/ItineraryStopEntities"

interface Props {
  stopId: string
  stopTitle: string
}

/**
 * Thin over the entity the itinerary screen's resolvers have already reported for this stop.
 * Fires no query of its own — that duplicated one query per row before this refactor.
 */
export const ItineraryStopSaveControl: React.FC<Props> = ({ stopId, stopTitle }) => {
  const entity = useItineraryStopEntity(stopId)

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
    />
  )
}

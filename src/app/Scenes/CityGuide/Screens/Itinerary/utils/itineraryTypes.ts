import { StopCardItem } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"

/** How a stop resolves to a saveable Artsy entity. null for a non-Artsy editorial place. */
export type ItinerarySaveTarget =
  | { type: "SHOW"; slug: string }
  /** Galleries and museums alike — both are Partners in Artsy's model. */
  | { type: "PARTNER"; slug: string }
  | { type: "FAIR"; slug: string }

/**
 * The badge shown on a stop. Editorial: whoever adds the stop picks it, because it is
 * finer-grained than the save target — a museum and a gallery are both Partners.
 */
export type ItineraryStopCategory = "MUSEUM" | "GALLERY" | "SHOW" | "FAIR"

export interface ItineraryStop {
  id: string
  title: string
  /** Display address. The row truncates it to one line; the preview shows it in full. */
  address?: string
  category?: ItineraryStopCategory
  /** Backend-formatted for display. e.g. "11am-4pm" */
  displayTime: string
  /**
   * Reserved, unused in this pass. ISO 8601. Carried so sorting and timezone-aware
   * behaviour do not need a schema change later. Never format from these — display
   * always comes from displayTime.
   */
  startAt?: string
  endAt?: string
  /** Freeform. May hold emoji ("🥂 🧀") or a short caption. */
  note?: string
  /**
   * Whether entry is free. The stop's own answer, which an author can set to override what
   * the entity says — so it wins over `Show.isFreeAdmission` on the card.
   */
  isFreeAdmission?: boolean
  imageUrl: string
  /**
   * Absent when the stop has no usable location: latitude and longitude are both nullable
   * server-side. Such a stop still belongs in the list — it just cannot be drawn, so the
   * map converters filter on this rather than plotting a 0,0 pin.
   */
  coordinates?: { lat: number; lng: number }
  /** null when the stop is not a saveable Artsy entity; no save control renders. */
  saveTarget: ItinerarySaveTarget | null
  /**
   * What the stop resolved to, kept in the shape the card needs. Separate from `saveTarget`,
   * which is only a type and a slug: the card also wants the entity's own name, place, href
   * and admission. Absent for a custom stop.
   */
  cardItem?: StopCardItem
}

export interface ItinerarySection {
  /** Stable identity. Used for keys, lookups, and map filters. */
  id: string
  /** Opaque backend-authored display string. Never used as identity. */
  title: string
  stops: ItineraryStop[]
}

export interface Itinerary {
  id: string
  /**
   * Editorial guides are curated; a user's own itinerary is not. The only ownership signal
   * available — `Query.itinerary` exposes no "is this mine". Drives what the screen hides for
   * your own itinerary: numbering, section headings and the byline.
   */
  isCurated: boolean
  citySlug: string
  title: string
  subtitle: string
  heroImageUrl: string
  authorName: string
  description: string
  sections: ItinerarySection[]
}

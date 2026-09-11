export type CityEventSectionKey = "fairs" | "shows" | "opening"

const SECTION_KEYS: CityEventSectionKey[] = ["fairs", "shows", "opening"]

/**
 * The route parameter is a runtime string from a deep link, so the TypeScript union proves
 * nothing about it. Anything unrecognised falls back to shows rather than rendering an
 * undefined title and an empty list.
 */
export const parseCityEventSection = (value: string | undefined): CityEventSectionKey =>
  SECTION_KEYS.includes(value as CityEventSectionKey) ? (value as CityEventSectionKey) : "shows"

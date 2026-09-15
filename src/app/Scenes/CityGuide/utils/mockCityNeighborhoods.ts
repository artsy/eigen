/**
 * MOCK DATA: neighbourhood isn't stored anywhere in Gravity, so this is editorial. The
 * grouping input (postalCode) is real; delete this file once `Location.neighborhood` lands.
 */
export interface NeighborhoodDef {
  id: string
  title: string
  /** Normalised outward-code prefixes: uppercase, no whitespace. Longest match wins. */
  postalPrefixes: string[]
}

export const MOCK_NEIGHBORHOODS: Record<string, NeighborhoodDef[]> = {
  "london-united-kingdom": [
    { id: "farringdon", title: "Farringdon", postalPrefixes: ["EC1"] },
    { id: "central-london", title: "Central London", postalPrefixes: ["W1", "SW1", "WC1", "WC2"] },
    { id: "east-london", title: "East London", postalPrefixes: ["E1", "E2", "E8", "E9", "EC2"] },
    {
      id: "north-london",
      title: "North London",
      postalPrefixes: ["N1", "N4", "NW1", "NW3", "NW5", "NW8"],
    },
    { id: "south-london", title: "South London", postalPrefixes: ["SE1", "SE5", "SE8", "SE15"] },
    {
      id: "west-london",
      title: "West London",
      postalPrefixes: ["W2", "W8", "W10", "W11", "SW3", "SW6", "SW7"],
    },
  ],
}

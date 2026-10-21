import { Tabs } from "@artsy/palette-mobile"

/**
 * The "Listings" tab of My Collection. Intentionally empty for now: only the tab's scroll view,
 * so the collapsing header keeps working.
 */
export const MyCollectionListingsQueryRenderer: React.FC = () => {
  return <Tabs.ScrollView testID="my-collection-listings" />
}

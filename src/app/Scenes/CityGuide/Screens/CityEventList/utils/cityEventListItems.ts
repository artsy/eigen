import { CityEventSection } from "app/Scenes/CityGuide/utils/cityEventSections"

export type CityEventListItem<T> =
  | { kind: "header"; sectionId: string; title: string; isExpanded: boolean }
  | { kind: "row"; sectionId: string; item: T }

/**
 * Flattens sections into one array for `Screen.FlatList`. A collapsed section keeps its header
 * and loses its rows, so collapsing shifts every index below it. That is why the screen's
 * headers are not sticky.
 */
export const toCityEventListItems = <T>(
  sections: CityEventSection<T>[],
  collapsedSectionIds: Set<string>
): CityEventListItem<T>[] =>
  sections.flatMap((section) => {
    const isExpanded = !collapsedSectionIds.has(section.id)

    const header: CityEventListItem<T> = {
      kind: "header",
      sectionId: section.id,
      title: section.title,
      isExpanded,
    }

    if (!isExpanded) {
      return [header]
    }

    return [
      header,
      ...section.items.map<CityEventListItem<T>>((item) => ({
        kind: "row",
        sectionId: section.id,
        item,
      })),
    ]
  })

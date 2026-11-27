import { ArtistCVList_artist$data } from "__generated__/ArtistCVList_artist.graphql"
import { ExtractNodeType } from "app/utils/relayHelpers"

export type CVShow = ExtractNodeType<ArtistCVList_artist$data["showsConnection"]>

type CVRow = { kind: "year"; year: string; isFirst: boolean } | { kind: "show"; show: CVShow }

// Shows arrive sorted by start date, so a new year starts wherever the year changes.
export const toCVRows = (shows: CVShow[]) => {
  const rows: CVRow[] = []

  shows.forEach((show, index) => {
    if (index === 0 || shows[index - 1].startYear !== show.startYear) {
      rows.push({ kind: "year", year: show.startYear ?? "", isFirst: index === 0 })
    }
    rows.push({ kind: "show", show })
  })

  return rows
}

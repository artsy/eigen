import { Sans } from "@artsy/palette"
import React from "react"

export const ArtistNamesList = ({ artists }) => {
  if (!artists || !artists.length) {
    return null
  }

  const names = artists
    .map(artist => artist.name)
    .slice(0, 5)
    .join(", ")
  const remainderCount = artists.length - 5
  const remainder =
    remainderCount > 0 ? (
      <>
        {" and "}
        <Sans size="2" weight="medium">
          {remainderCount} more
        </Sans>
      </>
    ) : null

  return (
    <Sans size="2">
      Works by{" "}
      <Sans size="2" weight="medium">
        {names}
      </Sans>
      {remainder}
    </Sans>
  )
}

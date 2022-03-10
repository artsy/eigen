import { MyCollectionArtworkAbout_artwork } from "__generated__/MyCollectionArtworkAbout_artwork.graphql"
import { MyCollectionArtworkInsights_artwork } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { OldMyCollectionArtworkQueryResponse } from "__generated__/OldMyCollectionArtworkQuery.graphql"
import { STATUSES } from "../Screens/Artwork/Components/MyCollectionArtworkSubmissionStatus"

export const showSubmitToSell = (
  artwork:
    | MyCollectionArtworkAbout_artwork
    | MyCollectionArtworkInsights_artwork
    | NonNullable<OldMyCollectionArtworkQueryResponse["artwork"]>
) => {
  const isPOneArtist =
    !!artwork.artists?.find((artist) => Boolean(artist?.targetSupply?.isTargetSupply)) ??
    !!artwork.artist?.targetSupply?.isTargetSupply ??
    false

  const displayText = artwork.consignmentSubmission?.displayText

  const isSold = !!displayText && STATUSES[displayText!.toLowerCase()]?.text === "Artwork Sold"

  return isPOneArtist && isSold
}

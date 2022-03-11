import { MyCollectionArtworkAbout_artwork } from "__generated__/MyCollectionArtworkAbout_artwork.graphql"
import { MyCollectionArtworkInsights_artwork } from "__generated__/MyCollectionArtworkInsights_artwork.graphql"
import { OldMyCollectionArtworkQueryResponse } from "__generated__/OldMyCollectionArtworkQuery.graphql"
import { STATUSES } from "../Screens/Artwork/Components/MyCollectionArtworkSubmissionStatus"

export const isPOneArtist = (
  artwork:
    | MyCollectionArtworkAbout_artwork
    | MyCollectionArtworkInsights_artwork
    | NonNullable<OldMyCollectionArtworkQueryResponse["artwork"]>
) =>
  !!artwork.artists?.find((artist) => Boolean(artist?.targetSupply?.isTargetSupply)) ??
  !!artwork.artist?.targetSupply?.isTargetSupply ??
  false

export const showSubmitToSell = (
  artwork:
    | MyCollectionArtworkAbout_artwork
    | MyCollectionArtworkInsights_artwork
    | NonNullable<OldMyCollectionArtworkQueryResponse["artwork"]>
) => {
  const displayText = artwork.consignmentSubmission?.displayText

  const isSubmissionEvaluated =
    !!displayText && STATUSES[displayText!.toLowerCase()]?.text === "Evaluation Complete"

  return isPOneArtist(artwork) && isSubmissionEvaluated
}

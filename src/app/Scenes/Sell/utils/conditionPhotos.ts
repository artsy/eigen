import { conditionPhotos_resaleSubmission$key } from "__generated__/conditionPhotos_resaleSubmission.graphql"
import { SellConditionPhoto } from "app/Scenes/Sell/Components/SellConditionPhotos"
import { graphql, readInlineData } from "react-relay"

/** The condition photos already saved on a resale submission, oldest first */
export const toSavedConditionPhotos = (
  key: conditionPhotos_resaleSubmission$key
): SellConditionPhoto[] =>
  readInlineData(conditionPhotosFragment, key).conditionPhotos.flatMap(({ internalID, url }) =>
    internalID && url ? [{ path: url, imageID: internalID }] : []
  )

const conditionPhotosFragment = graphql`
  fragment conditionPhotos_resaleSubmission on ResaleSubmission @inline {
    conditionPhotos {
      internalID
      url(version: ["square", "medium"])
    }
  }
`

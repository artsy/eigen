import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import {
  SavedSearchEntity,
  SearchCriteriaAttributes,
} from "app/Components/ArtworkFilter/SavedSearch/types"
import { BrowseSimilarWorksModalContent } from "app/Scenes/Artwork/Components/BrowseSimilarWorksModal/BrowseSimilarWorksModalContent"
import { CreateSavedSearchAlertParams } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"

export interface BrowseSimilarWorksModalContentWrapperProps {
  entity: SavedSearchEntity
  attributes: SearchCriteriaAttributes
  aggregations: Aggregations
}

export const BrowseSimilarWorksModalContentWrapper: React.FC<
  BrowseSimilarWorksModalContentWrapperProps
> = (props) => {
  const { entity, attributes, aggregations } = props

  const params: CreateSavedSearchAlertParams = {
    aggregations,
    attributes,
    entity,
    onClosePress: () => {},
    onComplete: () => {},
  }

  return <BrowseSimilarWorksModalContent params={params} />
}
